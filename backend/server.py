from flask import Flask, request
from flask_cors import CORS
from data_analysis import bar_chart_figure, scatter_plot_figure, heatmap_figure, pie_chart_figure, get_nutritional_insights, get_recipes, get_clusters_by_diet

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def hello_world():
    return 'Hello, World!'

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

@app.route('/nutritional-insights')
def nutritional_insights():
    diet_type = request.args.get('diet_type', 'All')  # Get diet type from query parameters, default to 'All'
    return get_nutritional_insights(diet_type=diet_type)

@app.route('/recipes')
def recipes():
    diet_type = request.args.get('diet_type', 'All')  # Get diet type from query parameters, default to 'All'
    return get_recipes(diet_type=diet_type)

@app.route('/clusters')
def clusters():
    diet_type = request.args.get('diet_type', 'All')  # Get diet type from query parameters, default to 'All'
    return get_clusters_by_diet(diet_type=diet_type)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)