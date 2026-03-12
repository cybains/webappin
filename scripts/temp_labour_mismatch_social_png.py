import csv
import os
from typing import Dict, List

import plotly.express as px
import plotly.graph_objects as go


YOUTH_CSV = "analysis_outputs/eu27_macro_overlay_2020_2025/02_annual_unemployment_youth.csv"
VAC_CSV = "analysis_outputs/eu27_macro_overlay_2020_2025/04_annual_vacancy_construction.csv"
OUT_DIR = "analysis_outputs/visualizations"
OUT_PNG = "eu_labour_mismatch_social_master_2024.png"
YEAR = 2024


def read_for_year(path: str, value_col: str, year: int) -> Dict[str, dict]:
    out: Dict[str, dict] = {}
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                y = int(row["year"])
            except (TypeError, ValueError):
                continue
            if y != year:
                continue
            raw = row.get(value_col, "")
            if not raw:
                continue
            try:
                val = float(raw)
            except ValueError:
                continue
            out[row["geo"]] = {"country": row["country"], "value": val}
    return out


def build_rows() -> List[dict]:
    youth = read_for_year(YOUTH_CSV, "youth_unemployment_rate", YEAR)
    vac = read_for_year(VAC_CSV, "vacancy_rate_construction", YEAR)
    rows: List[dict] = []
    for geo, y in youth.items():
        v = vac.get(geo)
        if not v:
            continue
        rows.append(
            {
                "geo": geo,
                "country": y["country"],
                "youth_unemployment": y["value"],
                "construction_vacancy": v["value"],
            }
        )
    return rows


def main() -> None:
    rows = build_rows()
    if not rows:
        raise ValueError("No overlapping data to plot.")

    x_avg = sum(r["youth_unemployment"] for r in rows) / len(rows)
    y_avg = sum(r["construction_vacancy"] for r in rows) / len(rows)

    for r in rows:
        high_x = r["youth_unemployment"] >= x_avg
        high_y = r["construction_vacancy"] >= y_avg
        if high_x and high_y:
            r["group"] = "High mismatch risk"
        elif (not high_x) and high_y:
            r["group"] = "High hiring pressure"
        elif high_x and (not high_y):
            r["group"] = "High youth unemployment"
        else:
            r["group"] = "Lower pressure"

    x_vals = [r["youth_unemployment"] for r in rows]
    y_vals = [r["construction_vacancy"] for r in rows]
    x_min, x_max = min(x_vals), max(x_vals)
    y_min, y_max = min(y_vals), max(y_vals)

    fig = px.scatter(
        rows,
        x="youth_unemployment",
        y="construction_vacancy",
        color="group",
        hover_name="country",
        color_discrete_map={
            "High mismatch risk": "#E85D04",
            "High hiring pressure": "#1D4ED8",
            "High youth unemployment": "#7C3AED",
            "Lower pressure": "#16A34A",
        },
        labels={
            "youth_unemployment": "Youth unemployment rate (%)",
            "construction_vacancy": "Construction vacancy rate (%)",
        },
        title="Europe’s Labour Mismatch",
    )

    fig.update_traces(
        marker=dict(size=17, line=dict(width=1.2, color="#FFFFFF")),
        hovertemplate="<b>%{hovertext}</b><br>Youth unemployment: %{x:.1f}%<br>Construction vacancies: %{y:.1f}%<extra></extra>",
    )

    # Highlight top-right zone as the main message.
    fig.add_shape(
        type="rect",
        x0=x_avg,
        x1=x_max + 0.8,
        y0=y_avg,
        y1=y_max + 0.6,
        fillcolor="rgba(232, 93, 4, 0.10)",
        line=dict(width=0),
        layer="below",
    )
    fig.add_annotation(
        x=x_avg + (x_max - x_avg) * 0.58,
        y=y_avg + (y_max - y_avg) * 0.72,
        text="<b>Mismatch zone:</b><br>High youth joblessness<br>+ high unfilled construction jobs",
        showarrow=False,
        font=dict(size=15, color="#7C2D12"),
        bgcolor="rgba(255,255,255,0.92)",
        bordercolor="rgba(232, 93, 4, 0.40)",
        borderwidth=1,
    )

    # Average reference lines.
    fig.add_vline(x=x_avg, line_dash="dash", line_color="#64748B", line_width=1.8)
    fig.add_hline(y=y_avg, line_dash="dash", line_color="#64748B", line_width=1.8)
    fig.add_annotation(
        x=x_avg,
        y=y_min - 0.3,
        text=f"EU avg youth unemployment: {x_avg:.1f}%",
        showarrow=False,
        font=dict(size=12, color="#475569"),
    )
    fig.add_annotation(
        x=x_min - 0.6,
        y=y_avg,
        text=f"EU avg vacancies: {y_avg:.1f}%",
        showarrow=False,
        textangle=-90,
        font=dict(size=12, color="#475569"),
    )

    # Label the most relevant countries for storytelling.
    mismatch = [r for r in rows if r["group"] == "High mismatch risk"]
    mismatch.sort(
        key=lambda r: (r["youth_unemployment"] - x_avg) + (r["construction_vacancy"] - y_avg),
        reverse=True,
    )
    key_labels = {r["country"] for r in mismatch[:6]}
    for r in rows:
        if r["country"] not in key_labels:
            continue
        fig.add_annotation(
            x=r["youth_unemployment"],
            y=r["construction_vacancy"],
            text=r["country"],
            showarrow=True,
            arrowhead=0,
            ax=16,
            ay=-14,
            font=dict(size=11, color="#111827"),
            bgcolor="rgba(255,255,255,0.92)",
            bordercolor="#CBD5E1",
            borderwidth=1,
        )

    fig.update_layout(
        width=1080,
        height=1350,
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFFFFF",
        margin=dict(l=85, r=45, t=120, b=150),
        title_font=dict(size=54, color="#0F172A"),
        legend_title_text="Country position",
        legend=dict(orientation="h", y=1.02, x=0),
    )
    fig.update_xaxes(
        showgrid=True,
        gridcolor="#EEF2F7",
        zeroline=False,
        range=[x_min - 0.8, x_max + 0.8],
    )
    fig.update_yaxes(
        showgrid=True,
        gridcolor="#EEF2F7",
        zeroline=False,
        range=[y_min - 0.4, y_max + 0.6],
    )

    fig.add_annotation(
        x=0.5,
        y=1.04,
        xref="paper",
        yref="paper",
        showarrow=False,
        text=f"EU-27 snapshot ({YEAR}) | One chart, two realities: unemployment and labour shortages",
        font=dict(size=17, color="#475569"),
    )
    fig.add_annotation(
        x=0.5,
        y=-0.11,
        xref="paper",
        yref="paper",
        showarrow=False,
        text="What jumps out: some countries have many young people unemployed while construction firms still cannot fill jobs.",
        font=dict(size=18, color="#111827"),
    )
    fig.add_annotation(
        x=0.5,
        y=-0.16,
        xref="paper",
        yref="paper",
        showarrow=False,
        text="Source: Eurostat (youth unemployment, construction vacancies)",
        font=dict(size=13, color="#6B7280"),
    )

    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, OUT_PNG)
    fig.write_image(out_path, width=1080, height=1350, scale=2)
    print(out_path)


if __name__ == "__main__":
    main()
