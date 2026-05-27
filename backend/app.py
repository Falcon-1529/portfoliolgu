from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return jsonify({"status": "ok", "message": "Portfolio backend running."})

@app.route("/api/nowcast")
def nowcast():
    return jsonify({"message": "nowcast endpoint coming soon."})

if __name__ == "__main__":
    app.run(debug=True)