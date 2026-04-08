import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
from io import BytesIO
import base64
import os

from azure.storage.blob import BlobServiceClient
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

# Columns to load
read_cols = ['Diet_type', 'Recipe_name', 'Cuisine_type', 'Protein(g)', 'Carbs(g)', 'Fat(g)']

# --- Azure Key Vault / Local Fallback ---
try:
    credential = DefaultAzureCredential()
    secret_client = SecretClient(
        vault_url="https://ProjectNutritionKeyVault.vault.azure.net/",
        credential=credential
    )
    CONNECTION_STRING = secret_client.get_secret("StorageConnectionString").value
except:
    CONNECTION_STRING = os.getenv("STORAGE_CONNECTION_STRING")

# --- Azure Blob Storage ---
blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)
container_name = 'datasets'
blob_name = 'All_Diets.csv'

container_client = blob_service_client.get_container_client(container_name)
blob_client = container_client.get_blob_client(blob_name)

stream = blob_client.download_blob().readall()

# --- Load dataset ---
df = pd.read_csv(BytesIO(stream), usecols=read_cols)

# Normalize diet type
df['Diet_type'] = df['Diet_type'].str.lower()

# Macronutrients
nutrients = ['Protein(g)', 'Carbs(g)', 'Fat(g)']

# Fill missing values
df[nutrients] = df[nutrients].fillna(df[nutrients].mean())

# Groupby
groupby_types = df.groupby('Diet_type', sort=False)
avg_macros = groupby_types[nutrients].mean()

# Top 5 protein recipes
df_sorted = df.sort_values(by=['Diet_type', 'Protein(g)'], ascending=[True, False], kind='mergesort')
top_5_protein = df_sorted.groupby('Diet_type').head(5)

# Extra metrics
df['Protein_to_Carbs_ratio'] = df['Protein(g)'] / df['Carbs(g)']
df['Carbs_to_Fat_ratio'] = df['Carbs(g)'] / df['Fat(g)']

# ================= CHARTS =================

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
    return base64.b64encode(buf.getbuffer()).decode('ascii')


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

    plt.setp(ax.get_xticklabels(), rotation=45)

    ax.grid(axis='y', linestyle='--', alpha=0.5)
    ax.legend(title='Diet Type', bbox_to_anchor=(1.05, 1), loc='upper left')

    fig.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format='png')
    return base64.b64encode(buf.getbuffer()).decode('ascii')


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
    return base64.b64encode(buf.getbuffer()).decode('ascii')


def pie_chart_figure():
    fig = Figure(figsize=(8, 8))
    ax = fig.add_subplot(111)

    diet_counts = df['Diet_type'].value_counts()
    ax.pie(diet_counts, labels=diet_counts.index, autopct='%1.1f%%', startangle=140)

    ax.set_title('Recipe Distribution by Diet Type')

    fig.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format='png')
    return base64.b64encode(buf.getbuffer()).decode('ascii')


# ================= API FUNCTIONS =================

def get_nutritional_insights(diet_type):
    diet_type = diet_type.lower()

    if diet_type == 'all':
        return {
            'average_protein': avg_macros['Protein(g)'].mean(),
            'average_carbs': avg_macros['Carbs(g)'].mean(),
            'average_fat': avg_macros['Fat(g)'].mean()
        }

    insights = {}

    if diet_type in avg_macros.index.str.lower():
        row = avg_macros.loc[avg_macros.index.str.lower() == diet_type].iloc[0]

        insights['average_protein'] = row['Protein(g)']
        insights['average_carbs'] = row['Carbs(g)']
        insights['average_fat'] = row['Fat(g)']
    else:
        insights['error'] = 'Diet type not found'

    return insights


def get_recipes(diet_type):
    diet_type = diet_type.lower()

    if diet_type == 'all':
        recipes = df[['Recipe_name', 'Cuisine_type', 'Protein(g)', 'Carbs(g)', 'Fat(g)']]
        return recipes.to_dict(orient='records')

    if diet_type in df['Diet_type'].unique():
        recipes = df[df['Diet_type'] == diet_type][
            ['Recipe_name', 'Cuisine_type', 'Protein(g)', 'Carbs(g)', 'Fat(g)']
        ]
        return recipes.to_dict(orient='records')
    else:
        return {'error': 'Diet type not found'}


def get_clusters_by_diet(diet_type):
    diet_type = diet_type.lower()

    if diet_type == 'all':
        return df[nutrients].to_dict(orient='records')

    if diet_type in df['Diet_type'].unique():
        return df[df['Diet_type'] == diet_type][nutrients].to_dict(orient='records')
    else:
        return {'error': 'Diet type not found'}