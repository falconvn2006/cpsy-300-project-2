from flask import Flask
from flask_cors import CORS
from data_analysis import bar_chart_figure, scatter_plot_figure, heatmap_figure, pie_chart_figure

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)