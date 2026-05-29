from flask import Flask, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import requests
import metpy.calc as mpcalc
from metpy.units import units

app = Flask(__name__)
CORS(app)

# load model and model reqs 
model     = joblib.load("../models/xgb_classifier.joblib")
FEAT_COLS = joblib.load("../models/feature_cols.joblib")
config    = joblib.load("../models/model_config.joblib")
THRESHOLD = config["threshold"]

SEVERITY_LABELS = {0: "Benign", 1: "Moderate", 2: "Severe"}
SEVERITY_COLORS = {0: "green",  1: "orange",   2: "red"}

# feature engineering
def build_features():
    params = {
        "latitude":       40.7128,
        "longitude":      -74.0060,
        "hourly": [
            "temperature_2m", "dewpoint_2m", "precipitation",
            "snowfall", "windspeed_10m", "windgusts_10m",
            "winddirection_10m", "pressure_msl", "cloudcover",
            "boundary_layer_height",
            "total_column_integrated_water_vapour",
            "wet_bulb_temperature_2m", "vapour_pressure_deficit",
            "surface_pressure", "et0_fao_evapotranspiration",
            "soil_temperature_0_to_7cm",
        ],
        "timezone":       "America/New_York",
        "past_days":      7,
        "forecast_days":  0,
    }
    
    resp = requests.get(
        "https://archive-api.open-meteo.com/v1/archive",
        params=params,
        timeout=30
    )
    """
    resp = requests.get(
    "https://api.open-meteo.com/v1/forecast",
    params=params,
    timeout=30
    )
    """    
    resp.raise_for_status()
    data = resp.json()

    df = pd.DataFrame(data["hourly"])
    df["time"] = pd.to_datetime(df["time"])
    df = df.set_index("time")

    # derived features
    df["relative_humidity"] = 100 * (
        np.exp(17.625 * df["dewpoint_2m"] / (243.04 + df["dewpoint_2m"]))
        / np.exp(17.625 * df["temperature_2m"] / (243.04 + df["temperature_2m"]))
    )
    df["dewpoint_depression"] = df["temperature_2m"] - df["dewpoint_2m"]

    angle_rad  = np.deg2rad(df["winddirection_10m"])
    df["u_wind"] = -df["windspeed_10m"] * np.sin(angle_rad)
    df["v_wind"] = -df["windspeed_10m"] * np.cos(angle_rad)

    df["pressure_tendency_3h"] = df["pressure_msl"].diff(3)
    df["pbl_tendency_1h"]      = df["boundary_layer_height"].diff(1)

    T  = df["temperature_2m"].values * units.degC
    Td = df["dewpoint_2m"].values    * units.degC
    p  = df["pressure_msl"].values   * units.hPa

    df["theta_e"]              = mpcalc.equivalent_potential_temperature(p, T, Td).magnitude
    df["convective_potential"] = df["theta_e"] * df["boundary_layer_height"] / 1000
    df["moisture_instability"] = df["total_column_integrated_water_vapour"] * df["theta_e"] / 1000

    df["month_sin"] = np.sin(2 * np.pi * df.index.month / 12)
    df["month_cos"] = np.cos(2 * np.pi * df.index.month / 12)

    # lagged features
    LAG_FEATURES = [
        "theta_e", "pressure_msl", "total_column_integrated_water_vapour",
        "windgusts_10m", "relative_humidity", "boundary_layer_height",
        "vapour_pressure_deficit", "surface_pressure",
    ]
    for feat in LAG_FEATURES:
        for lag in [3, 6, 12, 24, 48, 72]:
            df[f"{feat}_lag{lag}h"] = df[feat].shift(lag)

    # rolling features
    ROLLING_FEATURES = [
        "theta_e", "pressure_msl",
        "total_column_integrated_water_vapour", "vapour_pressure_deficit",
    ]
    for feat in ROLLING_FEATURES:
        for w in [3, 6, 12, 24, 48, 72]:
            df[f"{feat}_roll{w}h_mean"] = df[feat].rolling(w).mean()
            df[f"{feat}_roll{w}h_std"]  = df[feat].rolling(w).std()

    df.drop(columns=["winddirection_10m"], errors="ignore", inplace=True)
    df.dropna(inplace=True)

    # enforce exact column order from training
    latest = df.iloc[[-1]][FEAT_COLS]
    return latest, df.index[-1]


# routes
@app.route("/")
def index():
    return jsonify({"status": "ok", "message": "Portfolio backend running."})


@app.route("/api/nowcast")
def nowcast():
    try:
        features, timestamp = build_features()

        proba = model.predict_proba(features)[0]

        if proba[2] >= THRESHOLD:
            severity = 2
        elif proba[1] >= 0.5:
            severity = 1
        else:
            severity = 0

        return jsonify({
            "timestamp":      timestamp.isoformat(),
            "severity":       severity,
            "severity_label": SEVERITY_LABELS[severity],
            "severity_color": SEVERITY_COLORS[severity],
            "probabilities": {
                "benign":   round(float(proba[0]), 3),
                "moderate": round(float(proba[1]), 3),
                "severe":   round(float(proba[2]), 3),
            },
            "current_conditions": {
                "temperature_c":     round(float(features["temperature_2m"].iloc[0]), 1),
                "pressure_hpa":      round(float(features["pressure_msl"].iloc[0]), 1),
                "relative_humidity": round(float(features["relative_humidity"].iloc[0]), 1),
                "theta_e":           round(float(features["theta_e"].iloc[0]), 1),
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)