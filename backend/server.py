from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
from jose import jwt, JWTError
import httpx
from data_analysis import (bar_chart_figure, scatter_plot_figure,
    heatmap_figure, pie_chart_figure, get_nutritional_insights,
    get_recipes, get_clusters_by_diet)

app = Flask(__name__)
CORS(app)

# --- Firebase Auth config ---
# Firebase public keys URL for verifying tokens
FIREBASE_PROJECT_ID = "cpsy300-project"  # Ask Hayden for this
FIREBASE_JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"

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

@app.route('/')
def hello_world():
    return 'Hello, World!'

# Charts are public — no login needed
@app.route('/bar-chart-data')
def bar_chart_data():
    # return f'<img src="data:image/png;base64,{bar_chart_figure()}" alt="Bar Chart">'
    return bar_chart_figure()

@app.route('/scatter-plot-data')
def scatter_plot_data():
    # return f'<img src="data:image/png;base64,{scatter_plot_figure()}" alt="Scatter Plot">'
    return scatter_plot_figure()

@app.route('/heatmap-data')
def heatmap_data():
    # return f'<img src="data:image/png;base64,{heatmap_figure()}" alt="Heatmap">'
    return heatmap_figure()

@app.route('/pie-chart-data')
def pie_chart_data():
    # return f'<img src="data:image/png;base64,{pie_chart_figure()}" alt="Pie Chart">'
    return pie_chart_figure()

# Data routes are protected — require Firebase login
@app.route('/nutritional-insights')
@verify_token
def nutritional_insights():
    diet_type = request.args.get('diet_type', 'All')  # Get diet type from query parameters, default to 'All'
    return get_nutritional_insights(diet_type=diet_type)

@app.route('/recipes')
@verify_token
def recipes():
    diet_type = request.args.get('diet_type', 'All')  # Get diet type from query parameters, default to 'All'
    return get_recipes(diet_type=diet_type)

@app.route('/clusters')
@verify_token
def clusters():
    diet_type = request.args.get('diet_type', 'All')  # Get diet type from query parameters, default to 'All'
    return get_clusters_by_diet(diet_type=diet_type)

# Get Security Variables
@app.route('/security-status')
def security_status():
    # Add Logic
    # Replace With Real Values
    encryptVal = "AES-256"
    accessVal = "Azure Key Vault + Managed Identity"
    complianceVal = "JWT Protected API"

    return {
        "encryption": encryptVal,
        "access_control": accessVal,
        "compliance": complianceVal
    }

# Clean Up Resources
@app.route('/cleanup', methods=['POST'])
def cleanup():
    return jsonify({"message": "Cleanup triggered successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)