import csv
import os
from typing import Dict, List

import plotly.express as px
import plotly.graph_objects as go


CSV_PATH = "analysis_outputs/eu27_macro_overlay_2020_2025/02_annual_unemployment_youth.csv"
OUT_DIR = "analysis_outputs/visualizations"
OUT_HTML = "youth_unemployment_across_europe_heatmap.html"
OUT_PNG = "youth_unemployment_across_europe_heatmap.png"


ISO2_TO_ISO3: Dict[str, str] = {
    "AT": "AUT",
    "BE": "BEL",
    "BG": "BGR",
    "HR": "HRV",
    "CY": "CYP",
    "CZ": "CZE",
    "DK": "DNK",
    "EE": "EST",
    "FI": "FIN",
    "FR": "FRA",
    "DE": "DEU",
    "EL": "GRC",
    "HU": "HUN",
    "IE": "IRL",
    "IT": "ITA",
    "LV": "LVA",
    "LT": "LTU",
    "LU": "LUX",
    "MT": "MLT",
    "NL": "NLD",
    "PL": "POL",
    "PT": "PRT",
    "RO": "ROU",
    "SK": "SVK",
    "SI": "SVN",
    "ES": "ESP",
    "SE": "SWE",
}


def load_latest_year_rows() -> List[dict]:
    rows: List[dict] = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            val = r.get("youth_unemployment_rate", "")
            if not val:
                continue
            try:
                rate = float(val)
                year = int(r["year"])
            except (ValueError, TypeError):
                continue
            rows.append(
                {
                    "country": r["country"],
                    "geo": r["geo"],
                    "year": year,
                    "rate": rate,
                    "iso3": ISO2_TO_ISO3.get(r["geo"]),
                }
            )
    if not rows:
        raise ValueError("No valid youth unemployment values found.")

    latest_year = max(r["year"] for r in rows)
    latest_rows = [r for r in rows if r["year"] == latest_year and r["iso3"]]
    if not latest_rows:
        raise ValueError("No mappable rows found for latest year.")
    return latest_rows


def main() -> None:
    latest_rows = load_latest_year_rows()
    year = latest_rows[0]["year"]

    fig = px.choropleth(
        latest_rows,
        locations="iso3",
        locationmode="ISO-3",
        color="rate",
        hover_name="country",
        scope="europe",
        color_continuous_scale="YlOrRd",
        labels={"rate": "Youth unemployment (%)"},
        title=f"Youth Unemployment Across Europe ({year})",
    )

    fig.update_traces(
        marker_line_color="#FFFFFF",
        marker_line_width=0.6,
        hovertemplate="<b>%{hovertext}</b><br>Youth unemployment: %{z:.1f}%<extra></extra>",
    )

    fig.update_layout(
        width=1200,
        height=800,
        margin=dict(l=20, r=20, t=110, b=95),
        paper_bgcolor="white",
        plot_bgcolor="white",
        title_font=dict(size=34, color="#222222"),
        coloraxis_colorbar=dict(title="Rate (%)"),
        geo=dict(
            bgcolor="rgba(0,0,0,0)",
            lakecolor="rgba(0,0,0,0)",
            showlakes=False,
            showcountries=True,
            countrycolor="#D9D9D9",
        ),
    )

    fig.add_annotation(
        text="Where young workers struggle most.",
        x=0.5,
        y=1.04,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=18, color="#555555"),
    )
    fig.add_annotation(
        text="Source: Eurostat (2020–2024), youth unemployment rate (%)",
        x=0.5,
        y=-0.06,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=16, color="#1F1F1F"),
    )

    os.makedirs(OUT_DIR, exist_ok=True)
    html_path = os.path.join(OUT_DIR, OUT_HTML)
    png_path = os.path.join(OUT_DIR, OUT_PNG)

    fig.write_html(html_path, include_plotlyjs="cdn")
    try:
        fig.write_image(png_path, scale=2)
        image_status = f"PNG and HTML saved. PNG: {png_path}"
    except Exception:
        image_status = "HTML saved. PNG export unavailable (missing image engine such as kaleido)."

    print(html_path)
    print(image_status)


if __name__ == "__main__":
    main()
