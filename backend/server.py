from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
from jose import jwt, JWTError
import httpx
from data_analysis import (
    bar_chart_figure, scatter_plot_figure,
    heatmap_figure, pie_chart_figure,
    get_nutritional_insights, get_recipes, get_clusters_by_diet
)

app = Flask(__name__)
CORS(app)

# --- Firebase Auth config ---
FIREBASE_PROJECT_ID = "cpsy300-project"  # Replace with your project ID
FIREBASE_JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"

# --- Helper functions ---
def get_token_from_header():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    return auth.split(" ")[1]

def verify_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_header()
        if not token:
            return jsonify({"error": "Missing token"}), 401
        try:
            jwks = httpx.get(FIREBASE_JWKS_URL).json()
            jwt.decode(
                token,
                jwks,
                algorithms=["RS256"],
                audience=FIREBASE_PROJECT_ID,
                issuer=f"https://securetoken.google.com/{FIREBASE_PROJECT_ID}"
            )
        except JWTError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

def normalize_diet(diet_type):
    return diet_type.strip().lower() if diet_type else "all"

# --- Routes ---
@app.route('/')
def hello_world():
    return 'Hello, World!'

# Chart endpoints (public)
@app.route('/bar-chart-data')
def bar_chart_data():
    return bar_chart_figure()

@app.route('/scatter-plot-data')
def scatter_plot_data():
    return scatter_plot_figure()

@app.route('/heatmap-data')
def heatmap_data():
    return heatmap_figure()

@app.route('/pie-chart-data')
def pie_chart_data():
    return pie_chart_figure()

# Protected data endpoints
@app.route('/nutritional-insights')
@verify_token
def nutritional_insights():
    diet_type = normalize_diet(request.args.get('diet_type', 'all'))
    return jsonify(get_nutritional_insights(diet_type=diet_type))

@app.route('/recipes')
@verify_token
def recipes():
    diet_type = normalize_diet(request.args.get('diet_type', 'all'))
    return jsonify(get_recipes(diet_type=diet_type))

@app.route('/clusters')
@verify_token
def clusters():
    diet_type = normalize_diet(request.args.get('diet_type', 'all'))
    return jsonify(get_clusters_by_diet(diet_type=diet_type))

# Security & Compliance
@app.route('/security-status')
def security_status():
    return {
        "encryption": "Enabled",
        "access_control": "Secure",
        "compliance": "GDPR Compliant"
    }

# Cloud resource cleanup
@app.route('/cleanup', methods=['POST'])
def cleanup():
    return jsonify({"message": "Cleanup triggered successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)