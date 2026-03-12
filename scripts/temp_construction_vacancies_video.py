import csv
import io
import os
from typing import Dict, List

import imageio.v2 as imageio
import plotly.express as px
import plotly.graph_objects as go


CSV_PATH = "analysis_outputs/eu27_macro_overlay_2020_2025/04_annual_vacancy_construction.csv"
OUT_DIR = "analysis_outputs/visualizations"
OUT_MP4 = "construction_vacancies_story_video_2021_2024.mp4"

WIDTH = 1080
HEIGHT = 1350
FPS = 4
INTRO_SECONDS = 2
PER_YEAR_SECONDS = 2.5
OUTRO_SECONDS = 3

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
    rows = []
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
                rows.append(
                    {
                        "country": r["country"],
                        "geo": r["geo"],
                        "iso3": iso3,
                        "year": int(r["year"]),
                        "rate": float(raw),
                    }
                )
            except (TypeError, ValueError):
                continue
    return rows


def fig_to_frame(fig: go.Figure):
    png_bytes = fig.to_image(format="png", width=WIDTH, height=HEIGHT, scale=1)
    return imageio.imread(io.BytesIO(png_bytes))


def add_repeated_frame(frames: List, fig: go.Figure, seconds: float) -> None:
    frame = fig_to_frame(fig)
    repeats = max(1, int(round(FPS * seconds)))
    for _ in range(repeats):
        frames.append(frame)


def build_intro_figure(year_start: int, year_end: int) -> go.Figure:
    fig = go.Figure()
    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        paper_bgcolor="#F9FBFD",
        plot_bgcolor="#F9FBFD",
        margin=dict(l=40, r=40, t=50, b=60),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
    )
    fig.add_annotation(
        text="Where Construction Vacancies Are Highest",
        x=0.5,
        y=0.77,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=56, color="#141414"),
    )
    fig.add_annotation(
        text=f"EU-27 | {year_start} to {year_end}",
        x=0.5,
        y=0.66,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=30, color="#4F4F4F"),
    )
    fig.add_annotation(
        text="Vacancy rate is a proxy for unmet hiring demand.",
        x=0.5,
        y=0.50,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=27, color="#2E2E2E"),
    )
    fig.add_annotation(
        text="Watch where labour pressure intensifies year by year.",
        x=0.5,
        y=0.16,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=22, color="#505050"),
    )
    return fig


def build_year_figure(year_rows: List[dict], year: int, zmin: float, zmax: float, eu_avg: float) -> go.Figure:
    top3 = sorted(year_rows, key=lambda r: r["rate"], reverse=True)[:3]
    top_text = "<br>".join([f"{i+1}. {r['country']}: {r['rate']:.1f}%" for i, r in enumerate(top3)])

    fig = px.choropleth(
        year_rows,
        locations="iso3",
        locationmode="ISO-3",
        color="rate",
        hover_name="country",
        scope="europe",
        color_continuous_scale=[
            [0.0, "#FFF7BC"],
            [0.35, "#FEC44F"],
            [0.7, "#FE9929"],
            [1.0, "#D94801"],
        ],
        range_color=(zmin, zmax),
        labels={"rate": "Construction vacancy rate (%)"},
        title=f"Construction Labour Demand Pressure | {year}",
    )
    fig.update_traces(
        marker_line_color="#FFFFFF",
        marker_line_width=0.8,
        hovertemplate="<b>%{hovertext}</b><br>Vacancy rate: %{z:.1f}%<extra></extra>",
    )
    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFFFFF",
        margin=dict(l=24, r=24, t=120, b=90),
        title_font=dict(size=44, color="#171717"),
        coloraxis_colorbar=dict(
            title="Rate (%)",
            titlefont=dict(size=17),
            tickfont=dict(size=14),
            len=0.40,
            y=0.20,
            x=0.10,
            thickness=14,
        ),
        geo=dict(
            bgcolor="rgba(0,0,0,0)",
            showcoastlines=False,
            showcountries=True,
            countrycolor="#D8D8D8",
            projection_type="mercator",
            domain=dict(x=[0.0, 0.78], y=[0.12, 0.92]),
        ),
    )

    fig.add_annotation(
        text=f"EU-27 average vacancy rate: <b>{eu_avg:.1f}%</b>",
        x=0.5,
        y=1.02,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=21, color="#4C4C4C"),
    )
    fig.add_annotation(
        text="<b>Top Hiring Pressure</b><br>" + top_text,
        x=0.97,
        y=0.76,
        xref="paper",
        yref="paper",
        showarrow=False,
        align="left",
        bordercolor="#E3E3E3",
        borderwidth=1,
        borderpad=10,
        bgcolor="#FBFBFB",
        font=dict(size=18, color="#202020"),
    )
    fig.add_annotation(
        text="Higher vacancy rates usually mean stronger unmet labour demand.",
        x=0.5,
        y=0.06,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=22, color="#1F1F1F"),
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
    return fig


def build_outro_figure(changes: List[dict], start_year: int, end_year: int) -> go.Figure:
    increased = sorted(changes, key=lambda r: r["change"], reverse=True)[:3]
    decreased = sorted(changes, key=lambda r: r["change"])[:3]
    inc_text = "<br>".join([f"{r['country']}: +{r['change']:.1f} pp" for r in increased])
    dec_text = "<br>".join([f"{r['country']}: {r['change']:.1f} pp" for r in decreased])

    fig = go.Figure()
    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFFFFF",
        margin=dict(l=40, r=40, t=50, b=60),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
    )
    fig.add_annotation(
        text=f"What Changed ({start_year} to {end_year})",
        x=0.5,
        y=0.86,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=50, color="#151515"),
    )
    fig.add_annotation(
        text="Largest increases in vacancy pressure:<br>" + inc_text,
        x=0.5,
        y=0.56,
        xref="paper",
        yref="paper",
        showarrow=False,
        align="left",
        bordercolor="#F3D3B0",
        borderwidth=1,
        borderpad=12,
        bgcolor="#FFF7ED",
        font=dict(size=28, color="#7A3E08"),
    )
    fig.add_annotation(
        text="Largest declines:<br>" + dec_text,
        x=0.5,
        y=0.28,
        xref="paper",
        yref="paper",
        showarrow=False,
        align="left",
        bordercolor="#D7E8F9",
        borderwidth=1,
        borderpad=12,
        bgcolor="#F3F8FE",
        font=dict(size=28, color="#184A7A"),
    )
    fig.add_annotation(
        text="Europe does not have one construction labour market.",
        x=0.5,
        y=0.08,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=25, color="#202020"),
    )
    return fig


def main() -> None:
    rows = load_rows()
    if not rows:
        raise ValueError("No construction vacancy data found.")

    coverage = {}
    for r in rows:
        coverage[r["year"]] = coverage.get(r["year"], 0) + 1
    max_cov = max(coverage.values())
    full_years = sorted([y for y, c in coverage.items() if c == max_cov])
    # Prefer the most recent four comparable years for a clean story arc.
    years = full_years[-4:] if len(full_years) >= 4 else full_years
    if len(years) < 2:
        raise ValueError("Not enough comparable years to build a story video.")

    yearly = {y: [r for r in rows if r["year"] == y] for y in years}
    all_rates = [r["rate"] for y in years for r in yearly[y]]
    zmin, zmax = min(all_rates), max(all_rates)

    frames = []
    add_repeated_frame(frames, build_intro_figure(years[0], years[-1]), INTRO_SECONDS)
    for y in years:
        eu_avg = sum(r["rate"] for r in yearly[y]) / len(yearly[y])
        add_repeated_frame(frames, build_year_figure(yearly[y], y, zmin, zmax, eu_avg), PER_YEAR_SECONDS)

    start_map = {r["geo"]: r for r in yearly[years[0]]}
    end_map = {r["geo"]: r for r in yearly[years[-1]]}
    changes = []
    for geo, r_end in end_map.items():
        r_start = start_map.get(geo)
        if r_start:
            changes.append({"country": r_end["country"], "change": r_end["rate"] - r_start["rate"]})
    add_repeated_frame(frames, build_outro_figure(changes, years[0], years[-1]), OUTRO_SECONDS)

    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, OUT_MP4)
    with imageio.get_writer(
        out_path,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=1,
    ) as writer:
        for frame in frames:
            writer.append_data(frame)
    print(out_path)


if __name__ == "__main__":
    main()
