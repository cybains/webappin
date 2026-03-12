import csv
import os
from typing import Dict, List

import plotly.express as px
import plotly.graph_objects as go


CSV_PATH = "analysis_outputs/eu27_macro_overlay_2020_2025/04_annual_vacancy_construction.csv"
OUT_DIR = "analysis_outputs/visualizations"
OUT_PNG = "construction_vacancies_highest_europe_story.png"
OUT_HTML = "construction_vacancies_highest_europe_story.html"

# Facebook portrait format.
WIDTH = 1080
HEIGHT = 1350

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


def load_rows() -> List[dict]:
    rows: List[dict] = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            raw = r.get("vacancy_rate_construction", "")
            if raw in ("", None):
                continue
            iso3 = ISO2_TO_ISO3.get(r["geo"])
            if not iso3:
                continue
            try:
                year = int(r["year"])
                rate = float(raw)
            except (TypeError, ValueError):
                continue
            rows.append(
                {
                    "country": r["country"],
                    "geo": r["geo"],
                    "iso3": iso3,
                    "year": year,
                    "rate": rate,
                }
            )
    return rows


def pick_latest_comparable_year(rows: List[dict]) -> int:
    coverage: Dict[int, int] = {}
    for r in rows:
        coverage[r["year"]] = coverage.get(r["year"], 0) + 1
    max_cov = max(coverage.values())
    candidates = [y for y, c in coverage.items() if c == max_cov]
    return max(candidates)


def main() -> None:
    rows = load_rows()
    if not rows:
        raise ValueError("No vacancy rows found.")

    year = pick_latest_comparable_year(rows)
    yr_rows = [r for r in rows if r["year"] == year]
    yr_rows.sort(key=lambda r: r["rate"], reverse=True)

    eu_avg = sum(r["rate"] for r in yr_rows) / len(yr_rows)
    top5 = yr_rows[:5]
    top_text = "<br>".join([f"{i+1}. {r['country']}: {r['rate']:.1f}%" for i, r in enumerate(top5)])

    zmin = min(r["rate"] for r in yr_rows)
    zmax = max(r["rate"] for r in yr_rows)

    fig = px.choropleth(
        yr_rows,
        locations="iso3",
        locationmode="ISO-3",
        color="rate",
        hover_name="country",
        scope="europe",
        color_continuous_scale="YlOrRd",
        range_color=(zmin, zmax),
        labels={"rate": "Construction vacancy rate (%)"},
        title="Where Construction Vacancies Are Highest",
    )

    fig.update_traces(
        marker_line_color="#F4F4F4",
        marker_line_width=0.8,
        hovertemplate="<b>%{hovertext}</b><br>Vacancy rate: %{z:.1f}%<extra></extra>",
    )

    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        margin=dict(l=25, r=25, t=120, b=90),
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFFFFF",
        title_font=dict(size=52, color="#1C1C1C"),
        coloraxis_colorbar=dict(
            title="Rate (%)",
            titlefont=dict(size=18),
            tickfont=dict(size=14),
            len=0.42,
            y=0.20,
            x=0.10,
            thickness=14,
        ),
        geo=dict(
            bgcolor="rgba(0,0,0,0)",
            showcoastlines=False,
            showcountries=True,
            countrycolor="#D0D0D0",
            projection_type="mercator",
            domain=dict(x=[0.0, 0.78], y=[0.12, 0.92]),
        ),
    )

    fig.add_annotation(
        text=f"Latest comparable year: {year} | EU-27 average: {eu_avg:.1f}%",
        x=0.5,
        y=1.02,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=21, color="#505050"),
    )

    fig.add_annotation(
        text="<b>Highest Vacancy Rates</b><br>" + top_text,
        x=0.97,
        y=0.78,
        xref="paper",
        yref="paper",
        showarrow=False,
        align="left",
        bordercolor="#E0E0E0",
        borderwidth=1,
        borderpad=10,
        bgcolor="#FAFAFA",
        font=dict(size=18, color="#202020"),
    )

    fig.add_annotation(
        text="Where demand for construction labour is strongest.",
        x=0.5,
        y=0.06,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=26, color="#1A1A1A"),
    )
    fig.add_annotation(
        text="Source: Eurostat construction vacancy rate (%)",
        x=0.5,
        y=0.02,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=14, color="#666666"),
    )

    os.makedirs(OUT_DIR, exist_ok=True)
    png_path = os.path.join(OUT_DIR, OUT_PNG)
    html_path = os.path.join(OUT_DIR, OUT_HTML)

    fig.write_html(html_path, include_plotlyjs="cdn")
    fig.write_image(png_path, width=WIDTH, height=HEIGHT, scale=2)
    print(png_path)
    print(html_path)


if __name__ == "__main__":
    main()
