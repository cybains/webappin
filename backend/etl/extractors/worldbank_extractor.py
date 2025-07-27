import requests
import time

BASE_URL = "https://search.worldbank.org/api/v3/wds"
ROWS_PER_PAGE = 50  # Must match API max rows per page

def fetch_worldbank_data(qterm=None, max_pages=None):
    offset = 0
    all_records = []
    total_records = None  # Will get from API response

    while True:
        params = {
            "format": "json",
            "rows": ROWS_PER_PAGE,
            "os": offset
        }
        if qterm:
            params["qterm"] = qterm
        
        print(f"Fetching page with offset {offset}...")
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        # On first request, get total records count
        if total_records is None:
            total_records = int(data.get("total", 0))
            print(f"Total records reported by API: {total_records}")
            if total_records == 0:
                print("No records found for the given query.")
                break

            # Optional: print sample keys and fields
            documents = data.get("documents", {})
            if documents:
                first_record = next(iter(documents.values()))
                fields_to_log = list(first_record.keys())
                print(f"Available fields in first record: {fields_to_log}")

        # Extract current page records
        documents = data.get("documents", {})
        if not documents:
            print("No more records to fetch.")
            break

        current_records = list(documents.values())
        all_records.extend(current_records)

        offset += ROWS_PER_PAGE

        # If max_pages is set, check if limit reached
        if max_pages is not None and (offset // ROWS_PER_PAGE) >= max_pages:
            print(f"Reached max_pages limit: {max_pages}")
            break

        # Stop if offset exceeds or equals total_records
        if offset >= total_records:
            print("Reached end of available records.")
            break

        time.sleep(1)  # avoid hitting API too fast

    print(f"Total records fetched: {len(all_records)}")
    return all_records
