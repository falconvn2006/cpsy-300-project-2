import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
from io import BytesIO
import base64

# Create list of columns to load
read_cols = ['Diet_type', 'Recipe_name', 'Cuisine_type', 'Protein(g)', 'Carbs(g)', 'Fat(g)']

# Load the dataset
df = pd.read_csv('All_Diets.csv', usecols=read_cols)

# Select macronutrient columns only
nutrients = ['Protein(g)', 'Carbs(g)', 'Fat(g)']

# Fill missing values with column means
df[nutrients] = df[nutrients].fillna(df[nutrients].mean())

# Create a groupby object for diet types for reuse
groupby_types = df.groupby('Diet_type', sort=False)

# Calculate the average macronutrient content for each diet type
avg_macros = groupby_types[nutrients].mean()
# print(avg_macros)

# Find the top 5 protein-rich recipes for each diet type
df_sorted = df.sort_values(by=['Diet_type', 'Protein(g)'], ascending=[True, False], kind='mergesort')
top_5_protein = df_sorted.groupby('Diet_type').head(5)
# print(top_5_protein[['Diet_type', 'Recipe_name', 'Cuisine_type', 'Protein(g)']])

# Find the diet type with the highest protein content across all recipes.
highest_protein_diet = groupby_types['Protein(g)'].sum().idxmax()
# print(f"Highest protein diet type: {highest_protein_diet}")

# Identify the most common cuisines for each diet type.
most_common_cuisine = (groupby_types['Cuisine_type'].agg(lambda x: x.value_counts().idxmax()))
# print(most_common_cuisine)

# Add new metrics (Protein-to-Carbs ratio and Carbs-to-Fat ratio)
df['Protein_to_Carbs_ratio'] = df['Protein(g)'] / df['Carbs(g)']
df['Carbs_to_Fat_ratio'] = df['Carbs(g)'] / df['Fat(g)']

# ==========BAR CHART==========
# # Create bar chart

def bar_chart_figure():
    fig = Figure(figsize=(10, 6))
    ax = fig.add_subplot(111)
    avg_macros.plot(kind='bar', ax=ax)
    ax.set_title('Average Macronutrient Content by Diet Type')
    ax.set_xlabel('Diet Type')
    ax.set_ylabel('Grams')
    ax.set_xticklabels(avg_macros.index, rotation=45, ha='right')
    fig.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format='png')
    data = base64.b64encode(buf.getbuffer()).decode('ascii')
    return data

# ==========SCATTER PLOT==========
# Nutrient relationships: Scatter plot of Protein vs Carbs, colored by Diet_type
def scatter_plot_figure():
    fig = Figure(figsize=(12, 7))
    ax = fig.add_subplot(111)

    diet_types = top_5_protein['Diet_type'].unique()
    colors = plt.cm.get_cmap('Set1', len(diet_types))

    for i, diet in enumerate(diet_types):
        subset = top_5_protein[top_5_protein['Diet_type'] == diet]
        ax.scatter(
            subset['Cuisine_type'], 
            subset['Protein(g)'], 
            label=diet, 
            color=colors(i), 
            s=120,
            edgecolor='black', 
            alpha=0.8
        )

    ax.set_title('Top 5 Protein-Rich Recipes: Distribution across Cuisines')
    ax.set_xlabel('Cuisine Type')
    ax.set_ylabel('Protein (g)')
    ax.set_xticklabels(ax.get_xticklabels(), rotation=45)
    ax.grid(axis='y', linestyle='--', alpha=0.5)
    ax.legend(title='Diet Type', bbox_to_anchor=(1.05, 1), loc='upper left')
    fig.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format='png')
    data = base64.b64encode(buf.getbuffer()).decode('ascii')
    return data 

# ==========HEATMAP==========
def heatmap_figure():
    fig = Figure(figsize=(10, 6))
    ax = fig.add_subplot(111)
    cax = ax.imshow(avg_macros, cmap='viridis')

    ax.set_title('Average Macronutrient Content by Diet Type')
    ax.set_xticks(range(len(nutrients)))
    ax.set_xticklabels(nutrients, rotation=45, ha='right')
    ax.set_yticks(range(len(avg_macros.index)))
    ax.set_yticklabels(avg_macros.index)

    for i in range(len(avg_macros.index)):
        for j in range(len(nutrients)):
            value = avg_macros.iloc[i, j]
            ax.text(j, i, f"{value:.1f}", ha='center', va='center', color='white')

    fig.colorbar(cax)
    fig.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format='png')
    data = base64.b64encode(buf.getbuffer()).decode('ascii')
    return data

# ==========Pie Chart==========
# Pie chart of recipe distribution by diet type
def pie_chart_figure():
    fig = Figure(figsize=(8, 8))
    ax = fig.add_subplot(111)
    diet_counts = df['Diet_type'].value_counts()
    ax.pie(diet_counts, labels=diet_counts.index, autopct='%1.1f%%', startangle=140)
    ax.set_title('Recipe Distribution by Diet Type')
    fig.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format='png')
    data = base64.b64encode(buf.getbuffer()).decode('ascii')
    return data

# plt.title('Top 5 Protein-Rich Recipes: Distribution across Cuisines')
# plt.xlabel('Cuisine Type')
# plt.ylabel('Protein (g)')
# plt.xticks(rotation=45)
# plt.grid(axis='y', linestyle='--', alpha=0.5)
# plt.legend(title='Diet Type', bbox_to_anchor=(1.05, 1), loc='upper left')
# plt.tight_layout()
# plt.show()