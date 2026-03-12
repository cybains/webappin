import csv
import os
from typing import Dict, List

import plotly.express as px
import plotly.graph_objects as go


YOUTH_CSV = "analysis_outputs/eu27_macro_overlay_2020_2025/02_annual_unemployment_youth.csv"
VACANCY_CSV = "analysis_outputs/eu27_macro_overlay_2020_2025/04_annual_vacancy_construction.csv"
OUT_DIR = "analysis_outputs/visualizations"
OUT_PNG = "eu_labour_mismatch_scatter_2024.png"
OUT_HTML = "eu_labour_mismatch_scatter_2024.html"
YEAR = 2024


def read_metric(path: str, value_col: str, year: int) -> Dict[str, dict]:
    out: Dict[str, dict] = {}
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            try:
                y = int(r["year"])
            except (TypeError, ValueError):
                continue
            if y != year:
                continue
            raw = r.get(value_col, "")
            if raw in ("", None):
                continue
            try:
                out[r["geo"]] = {"country": r["country"], "value": float(raw)}
            except ValueError:
                continue
    return out


def main() -> None:
    youth = read_metric(YOUTH_CSV, "youth_unemployment_rate", YEAR)
    vac = read_metric(VACANCY_CSV, "vacancy_rate_construction", YEAR)

    merged: List[dict] = []
    for geo, y in youth.items():
        v = vac.get(geo)
        if not v:
            continue
        merged.append(
            {
                "geo": geo,
                "country": y["country"],
                "youth_unemployment": y["value"],
                "construction_vacancy": v["value"],
            }
        )
    if not merged:
        raise ValueError("No overlapping country records for the selected year.")

    x_avg = sum(r["youth_unemployment"] for r in merged) / len(merged)
    y_avg = sum(r["construction_vacancy"] for r in merged) / len(merged)

    for r in merged:
        high_x = r["youth_unemployment"] >= x_avg
        high_y = r["construction_vacancy"] >= y_avg
        if high_x and high_y:
            r["quadrant"] = "Mismatch Zone"
        elif (not high_x) and high_y:
            r["quadrant"] = "Tight but Absorbing"
        elif high_x and (not high_y):
            r["quadrant"] = "Slack Labour Market"
        else:
            r["quadrant"] = "Lower Pressure"

    # Pick label candidates from the mismatch zone by "distance above both averages".
    mismatch = [
        r
        for r in merged
        if r["youth_unemployment"] >= x_avg and r["construction_vacancy"] >= y_avg
    ]
    mismatch.sort(
        key=lambda r: (r["youth_unemployment"] - x_avg) + (r["construction_vacancy"] - y_avg),
        reverse=True,
    )
    label_set = {r["country"] for r in mismatch[:6]}

    fig = px.scatter(
        merged,
        x="youth_unemployment",
        y="construction_vacancy",
        color="quadrant",
        color_discrete_map={
            "Mismatch Zone": "#E85D04",
            "Tight but Absorbing": "#1D4ED8",
            "Slack Labour Market": "#9333EA",
            "Lower Pressure": "#16A34A",
        },
        hover_name="country",
        labels={
            "youth_unemployment": "Youth unemployment rate (%)",
            "construction_vacancy": "Construction vacancy rate (%)",
        },
        title="Europe’s Labour Mismatch",
    )

    fig.update_traces(
        marker=dict(size=14, line=dict(width=1, color="#FFFFFF")),
        hovertemplate="<b>%{hovertext}</b><br>Youth unemployment: %{x:.1f}%<br>Construction vacancy: %{y:.1f}%<extra></extra>",
    )

    # Average lines create the four narrative quadrants.
    fig.add_vline(x=x_avg, line_width=1.4, line_dash="dash", line_color="#6B7280")
    fig.add_hline(y=y_avg, line_width=1.4, line_dash="dash", line_color="#6B7280")

    # Quadrant labels.
    x_min = min(r["youth_unemployment"] for r in merged)
    x_max = max(r["youth_unemployment"] for r in merged)
    y_min = min(r["construction_vacancy"] for r in merged)
    y_max = max(r["construction_vacancy"] for r in merged)

    fig.add_annotation(
        x=(x_avg + x_max) / 2,
        y=(y_avg + y_max) / 2,
        text="Mismatch Zone",
        showarrow=False,
        font=dict(size=14, color="#7C2D12"),
        bgcolor="rgba(232,93,4,0.10)",
        bordercolor="rgba(232,93,4,0.35)",
        borderwidth=1,
    )
    fig.add_annotation(
        x=(x_min + x_avg) / 2,
        y=(y_avg + y_max) / 2,
        text="Tight but Absorbing",
        showarrow=False,
        font=dict(size=13, color="#1E3A8A"),
        bgcolor="rgba(29,78,216,0.10)",
        bordercolor="rgba(29,78,216,0.30)",
        borderwidth=1,
    )
    fig.add_annotation(
        x=(x_avg + x_max) / 2,
        y=(y_min + y_avg) / 2,
        text="Slack Labour Market",
        showarrow=False,
        font=dict(size=13, color="#5B21B6"),
        bgcolor="rgba(147,51,234,0.10)",
        bordercolor="rgba(147,51,234,0.30)",
        borderwidth=1,
    )
    fig.add_annotation(
        x=(x_min + x_avg) / 2,
        y=(y_min + y_avg) / 2,
        text="Lower Pressure",
        showarrow=False,
        font=dict(size=13, color="#166534"),
        bgcolor="rgba(22,163,74,0.10)",
        bordercolor="rgba(22,163,74,0.30)",
        borderwidth=1,
    )

    # Label key mismatch countries.
    for r in merged:
        if r["country"] not in label_set:
            continue
        fig.add_annotation(
            x=r["youth_unemployment"],
            y=r["construction_vacancy"],
            text=r["country"],
            showarrow=True,
            arrowhead=0,
            ax=18,
            ay=-18,
            font=dict(size=11, color="#111827"),
            bgcolor="rgba(255,255,255,0.88)",
            bordercolor="#D1D5DB",
            borderwidth=1,
        )

    fig.update_layout(
        width=1080,
        height=1350,
        paper_bgcolor="white",
        plot_bgcolor="white",
        margin=dict(l=80, r=45, t=120, b=130),
        title_font=dict(size=52, color="#111827"),
        legend_title_text="Country Position",
        legend=dict(orientation="h", y=1.02, x=0.0),
    )
    fig.update_xaxes(showgrid=True, gridcolor="#F1F5F9", zeroline=False)
    fig.update_yaxes(showgrid=True, gridcolor="#F1F5F9", zeroline=False)

    fig.add_annotation(
        x=0.5,
        y=1.04,
        xref="paper",
        yref="paper",
        showarrow=False,
        text=f"EU-27 snapshot ({YEAR}) | High youth unemployment + high vacancies = structural mismatch risk",
        font=dict(size=17, color="#475569"),
    )
    fig.add_annotation(
        x=0.5,
        y=-0.09,
        xref="paper",
        yref="paper",
        showarrow=False,
        text="Countries in the upper-right quadrant can face both joblessness and hiring shortages at the same time.",
        font=dict(size=17, color="#1F2937"),
    )
    fig.add_annotation(
        x=0.5,
        y=-0.14,
        xref="paper",
        yref="paper",
        showarrow=False,
        text="Source: Eurostat (youth unemployment, construction vacancies)",
        font=dict(size=13, color="#6B7280"),
    )

    os.makedirs(OUT_DIR, exist_ok=True)
    png_path = os.path.join(OUT_DIR, OUT_PNG)
    html_path = os.path.join(OUT_DIR, OUT_HTML)
    fig.write_image(png_path, width=1080, height=1350, scale=2)
    fig.write_html(html_path, include_plotlyjs="cdn")
    print(png_path)
    print(html_path)


if __name__ == "__main__":
    main()
