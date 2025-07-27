# transformers/worldbank_transformer.py
from dateutil.parser import parse

def transform_worldbank_records(records):
    transformed = []
    for record in records:
        try:
            year = record.get("disclosure_date")
            if year:
                # Parse and format date, fallback to original if fails
                year = parse(year).date().isoformat()
        except Exception:
            year = record.get("disclosure_date")

        transformed.append({
            "id": record.get("id"),
            "title": record.get("display_title"),
            "abstract": record.get("abstracts"),
            "countries": record.get("count"),
            "language": record.get("lang"),
            "document_type": record.get("docty"),
            "year": year,
            "url": record.get("url")
        })
    return transformed
