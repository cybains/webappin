# loaders/worldbank_loader.py
from pymongo import MongoClient, errors

client = MongoClient("mongodb://localhost:27017")
db = client["etl_database"]
collection = db["worldbank_data"]

def load_worldbank_data(records):
    if not records:
        print("⚠ No records to load.")
        return
    try:
        # Insert many records at once
        result = collection.insert_many(records)
        print(f"Inserted {len(result.inserted_ids)} records into MongoDB.")
    except errors.BulkWriteError as bwe:
        print("Bulk write error:", bwe.details)
    except Exception as e:
        print("Error inserting data:", e)
