from dateutil.parser import parse

def transform_worldbank_records(records):
    transformed = []
    for record in records:
        rec = record.copy()
        try:
            year = rec.get("disclosure_date")
            if year:
                rec["disclosure_date"] = parse(year).date().isoformat()
        except Exception:
            pass
        transformed.append(rec)
    return transformed
