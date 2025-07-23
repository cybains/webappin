from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
mongo_uri = os.getenv("MONGODB_URI")
mongo_db_name = os.getenv("MONGODB_DB_NAME")

client = MongoClient(mongo_uri)
db = client[mongo_db_name]
jobs_collection = db["jobs"]

@app.route("/store-jobs", methods=["POST"])
def store_jobs():
    jobs = request.json.get("jobs", [])
    if not jobs:
        return jsonify({"error": "No jobs provided"}), 400

    for job in jobs:
        jobs_collection.update_one(
            {"id": job["id"]},  # avoid duplicates
            {"$set": job},
            upsert=True
        )

    return jsonify({"message": f"Stored {len(jobs)} jobs"}), 200

@app.route("/get-jobs", methods=["GET"])
def get_jobs():
    jobs = list(jobs_collection.find({}, {"_id": 0}))
    return jsonify({"jobs": jobs})

if __name__ == "__main__":
    app.run(debug=True)
