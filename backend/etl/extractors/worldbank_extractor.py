import requests
import time

BASE_URL = "https://search.worldbank.org/api/v3/wds"
ROWS_PER_PAGE = 50

def fetch_worldbank_data(qterm=None, display_title=None, count_exact=None, fields=None, max_pages=None):
    offset = 0
    all_records = []
    
    while True:
        params = {
            "format": "json",
            "rows": ROWS_PER_PAGE,
            "os": offset
        }
        if qterm:
            params["qterm"] = qterm
        if display_title:
            params["display_title"] = display_title
        if count_exact:
            params["count_exact"] = count_exact
        if fields:
            params["fl"] = ",".join(fields)

        print(f"Fetching page with offset {offset}...")
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        if offset == 0:
            print("Sample API response keys:", data.keys())

        total_records = int(data.get("total", 0))
        if total_records == 0:
            print("No records found for the given query.")
            break

        # ✅ Correct key: 'documents'
        records = data.get("documents", {})
        if not records:
            print("No more records to fetch.")
            break

        records_list = list(records.values())
        all_records.extend(records_list)

        offset += ROWS_PER_PAGE
        if offset >= total_records or (max_pages and offset // ROWS_PER_PAGE >= max_pages):
            break

        time.sleep(1)  # avoid hitting API too fast
    
    return all_records
