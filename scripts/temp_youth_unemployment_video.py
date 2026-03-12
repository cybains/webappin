import csv
import io
import os
from typing import Dict, List

import imageio.v2 as imageio
import plotly.express as px
import plotly.graph_objects as go


CSV_PATH = "analysis_outputs/eu27_macro_overlay_2020_2025/02_annual_unemployment_youth.csv"
OUT_DIR = "analysis_outputs/visualizations"
OUT_MP4 = "youth_unemployment_across_europe_story_2020_2024.mp4"

# Facebook-friendly portrait format.
WIDTH = 1080
HEIGHT = 1350
FPS = 2
INTRO_SECONDS = 2
PER_YEAR_SECONDS = 2
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
    rows: List[dict] = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            val = r.get("youth_unemployment_rate", "")
            iso3 = ISO2_TO_ISO3.get(r.get("geo", ""))
            if not val or not iso3:
                continue
            try:
                year = int(r["year"])
                rate = float(val)
            except (ValueError, TypeError):
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


def fig_to_frame(fig: go.Figure):
    png_bytes = fig.to_image(format="png", width=WIDTH, height=HEIGHT, scale=1)
    return imageio.imread(io.BytesIO(png_bytes))


def add_repeated_frame(frames: List, fig: go.Figure, seconds: int) -> None:
    frame = fig_to_frame(fig)
    for _ in range(FPS * seconds):
        frames.append(frame)


def build_intro_figure(start_year: int, end_year: int, n_countries: int) -> go.Figure:
    fig = go.Figure()
    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        paper_bgcolor="#FFFDF7",
        plot_bgcolor="#FFFDF7",
        margin=dict(l=40, r=40, t=60, b=60),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
    )
    fig.add_annotation(
        text="Youth Unemployment Across Europe",
        x=0.5,
        y=0.78,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=58, color="#1E1E1E"),
    )
    fig.add_annotation(
        text=f"{start_year} to {end_year} | EU-27",
        x=0.5,
        y=0.69,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=30, color="#555555"),
    )
    fig.add_annotation(
        text="Where young workers struggle most.",
        x=0.5,
        y=0.52,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=30, color="#5A5A5A"),
    )
    fig.add_annotation(
        text=f"{n_countries} countries | rate = unemployed share of labor force (ages 15-24)",
        x=0.5,
        y=0.14,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=22, color="#4A4A4A"),
    )
    return fig


def build_year_figure(
    year_rows: List[dict],
    year: int,
    zmin: float,
    zmax: float,
    eu_avg: float,
) -> go.Figure:
    fig = px.choropleth(
        year_rows,
        locations="iso3",
        locationmode="ISO-3",
        color="rate",
        hover_name="country",
        scope="europe",
        color_continuous_scale="YlOrRd",
        range_color=(zmin, zmax),
        labels={"rate": "Youth unemployment (%)"},
        title=f"Youth Unemployment Across Europe | {year}",
    )
    fig.update_traces(
        marker_line_color="#F4F4F4",
        marker_line_width=0.8,
        hovertemplate="<b>%{hovertext}</b><br>Youth unemployment: %{z:.1f}%<extra></extra>",
    )
    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        margin=dict(l=20, r=20, t=120, b=95),
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFFFFF",
        title_font=dict(size=44, color="#1F1F1F"),
        coloraxis_colorbar=dict(
            title="Rate (%)",
            titlefont=dict(size=18),
            tickfont=dict(size=14),
            len=0.42,
            y=0.20,
            x=0.09,
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

    top = sorted(year_rows, key=lambda r: r["rate"], reverse=True)[:5]
    top_text = "<br>".join([f"{i+1}. {r['country']}: {r['rate']:.1f}%" for i, r in enumerate(top)])
    fig.add_annotation(
        text="<b>Highest Rates</b><br>" + top_text,
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
        text=f"<b>EU-27 Avg:</b> {eu_avg:.1f}%",
        x=0.97,
        y=0.34,
        xref="paper",
        yref="paper",
        showarrow=False,
        align="left",
        bordercolor="#E0E0E0",
        borderwidth=1,
        borderpad=8,
        bgcolor="#FAFAFA",
        font=dict(size=20, color="#202020"),
    )

    fig.add_annotation(
        text="Darker colors = higher youth unemployment.",
        x=0.5,
        y=1.02,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=21, color="#525252"),
    )
    fig.add_annotation(
        text="Source: Eurostat (2020–2024), youth unemployment rate (%)",
        x=0.5,
        y=-0.05,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=18, color="#222222"),
    )
    return fig


def build_outro_figure(changes: List[dict]) -> go.Figure:
    improved = sorted(changes, key=lambda r: r["change"])[:3]
    worsened = sorted(changes, key=lambda r: r["change"], reverse=True)[:3]

    imp_text = "<br>".join([f"{r['country']}: {r['change']:.1f} pp" for r in improved])
    wor_text = "<br>".join([f"{r['country']}: +{r['change']:.1f} pp" for r in worsened])

    fig = go.Figure()
    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFFFFF",
        margin=dict(l=40, r=40, t=60, b=60),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
    )
    fig.add_annotation(
        text="Key Takeaway (2020 to 2024)",
        x=0.5,
        y=0.88,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=50, color="#1E1E1E"),
    )
    fig.add_annotation(
        text="Biggest improvements (percentage-point change):<br>" + imp_text,
        x=0.5,
        y=0.58,
        xref="paper",
        yref="paper",
        showarrow=False,
        align="left",
        bordercolor="#D9EFD9",
        borderwidth=1,
        borderpad=12,
        bgcolor="#F2FBF2",
        font=dict(size=28, color="#1E4025"),
    )
    fig.add_annotation(
        text="Largest deteriorations:<br>" + wor_text,
        x=0.5,
        y=0.30,
        xref="paper",
        yref="paper",
        showarrow=False,
        align="left",
        bordercolor="#F2D3D3",
        borderwidth=1,
        borderpad=12,
        bgcolor="#FFF4F4",
        font=dict(size=28, color="#5B1D1D"),
    )
    return fig


def main() -> None:
    rows = load_rows()
    if not rows:
        raise ValueError("No valid rows found in youth unemployment CSV.")

    years = sorted({r["year"] for r in rows})
    # Keep the period available in your prepared file (2020-2024).
    years = [y for y in years if 2020 <= y <= 2024]
    if not years:
        raise ValueError("No data years in expected range 2020-2024.")

    all_rates = [r["rate"] for r in rows if r["year"] in years]
    zmin = min(all_rates)
    zmax = max(all_rates)

    frames = []
    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, OUT_MP4)

    add_repeated_frame(
        frames,
        build_intro_figure(start_year=years[0], end_year=years[-1], n_countries=len({r["geo"] for r in rows})),
        INTRO_SECONDS,
    )

    yearly_data = {y: [r for r in rows if r["year"] == y] for y in years}
    for y in years:
        yr_rows = yearly_data[y]
        eu_avg = sum(r["rate"] for r in yr_rows) / len(yr_rows)
        add_repeated_frame(
            frames,
            build_year_figure(yr_rows, y, zmin=zmin, zmax=zmax, eu_avg=eu_avg),
            PER_YEAR_SECONDS,
        )

    first_by_country = {r["geo"]: r for r in yearly_data[years[0]]}
    last_by_country = {r["geo"]: r for r in yearly_data[years[-1]]}
    changes = []
    for geo, row_last in last_by_country.items():
        row_first = first_by_country.get(geo)
        if not row_first:
            continue
        changes.append(
            {
                "country": row_last["country"],
                "change": row_last["rate"] - row_first["rate"],
            }
        )
    if changes:
        add_repeated_frame(frames, build_outro_figure(changes), OUTRO_SECONDS)

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
