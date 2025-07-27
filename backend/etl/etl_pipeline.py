from extractors.worldbank_extractor import fetch_worldbank_data
from transformers.worldbank_transformer import transform_worldbank_records
from loaders.worldbank_loader import load_worldbank_data

def run_worldbank_etl():
    print("Starting ETL pipeline for World Bank API...")
    
    # Extract
    raw_data = fetch_worldbank_data(
        qterm=None,
        max_pages=None  # no 'fields' parameter here
    )
    print(f"Extracted {len(raw_data)} records")

    if not raw_data:
        print("⚠ No data extracted. Check your query or API response.")
        return

    # Transform
    transformed_data = transform_worldbank_records(raw_data)
    print(f"Transformed {len(transformed_data)} records")

    # Load
    load_worldbank_data(transformed_data)
    print("Data loaded successfully!")

if __name__ == "__main__":
    run_worldbank_etl()
