import csv
import os
from typing import Dict, List

import matplotlib.pyplot as plt


CSV_PATH = "analysis_outputs/eu27_macro_overlay_2020_2025/03_annual_construction_activity_with_yoy.csv"
OUT_DIR = "analysis_outputs/visualizations"
OUT_FILE = "construction_growth_story_social_v2.png"

VALUE_COL = "construction_index_annual_avg_I21_NSA"
HIGHLIGHT = {"Italy", "Germany", "Spain"}


def load_growth_rows() -> List[Dict[str, float]]:
    data: Dict[str, Dict[str, float]] = {}
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            country = r["country"]
            year = r["year"]
            raw = r.get(VALUE_COL, "")
            if raw in ("", None):
                continue
            try:
                val = float(raw)
            except ValueError:
                continue
            data.setdefault(country, {})[year] = val

    rows: List[Dict[str, float]] = []
    for country, years in data.items():
        v2020 = years.get("2020")
        v2025 = years.get("2025")
        if v2020 is None or v2025 is None or v2020 == 0:
            continue
        growth = ((v2025 / v2020) - 1.0) * 100.0
        rows.append({"country": country, "growth": growth})

    rows.sort(key=lambda x: x["growth"])
    return rows


def bar_color(country: str, growth: float) -> str:
    if country in HIGHLIGHT and growth >= 0:
        return "#0B7A47"
    if country in HIGHLIGHT and growth < 0:
        return "#A01D1D"
    if growth >= 0:
        return "#87CFA0"
    return "#E7A4A4"


def main() -> None:
    rows = load_growth_rows()
    if not rows:
        raise ValueError("No valid 2020 and 2025 construction values found.")

    countries = [r["country"] for r in rows]
    growth = [r["growth"] for r in rows]
    colors = [bar_color(r["country"], r["growth"]) for r in rows]

    plt.rcParams["font.family"] = "DejaVu Sans"
    fig, ax = plt.subplots(figsize=(13.5, 11), facecolor="white")
    ax.set_facecolor("white")

    bars = ax.barh(countries, growth, color=colors, height=0.8)
    ax.axvline(0, color="#333333", linewidth=1.2)

    # Clean look: no grid and minimal spines.
    ax.grid(False)
    for spine in ["top", "right", "left", "bottom"]:
        ax.spines[spine].set_visible(False)

    ax.tick_params(axis="y", labelsize=13)
    ax.tick_params(axis="x", labelsize=11, colors="#444444")
    ax.set_xlabel("Construction activity index change (%) from 2020 to 2025", fontsize=13, color="#222222")
    ax.set_ylabel("")

    fig.suptitle(
        "Where Construction Is Expanding — And Where It’s Slowing",
        fontsize=30,
        fontweight="bold",
        y=0.96,
        color="#121212",
    )
    ax.set_title(
        "Data-driven ranking of EU countries by growth in construction activity",
        fontsize=13,
        color="#555555",
        pad=10,
    )

    # Value labels.
    for b, v in zip(bars, growth):
        y = b.get_y() + b.get_height() / 2
        if v >= 0:
            ax.text(v + 0.5, y, f"{v:.1f}%", va="center", ha="left", fontsize=11, color="#1E1E1E")
        else:
            ax.text(v - 0.5, y, f"{v:.1f}%", va="center", ha="right", fontsize=11, color="#1E1E1E")

    lookup = {r["country"]: r["growth"] for r in rows}

    # Story callouts (data-driven values).
    if "Italy" in lookup:
        ax.annotate(
            f"Italy\n+{lookup['Italy']:.1f}% construction growth",
            xy=(lookup["Italy"], countries.index("Italy")),
            xytext=(lookup["Italy"] - 20, countries.index("Italy") - 1.5),
            textcoords="data",
            fontsize=11,
            color="#0B7A47",
            bbox=dict(boxstyle="round,pad=0.3", fc="#ECF8F1", ec="#B8DFC8"),
            arrowprops=dict(arrowstyle="-|>", color="#0B7A47", lw=1.2),
        )
    if "Germany" in lookup:
        ax.text(
            2.0,
            countries.index("Germany") + 1.15,
            f"Germany\n{lookup['Germany']:.1f}% construction decline",
            fontsize=11,
            color="#8D1717",
            bbox=dict(boxstyle="round,pad=0.3", fc="#FDEEEE", ec="#F1C6C6"),
            ha="left",
            va="center",
        )

    # Subtle emphasis for Spain in the middle of the chart.
    if "Spain" in lookup:
        ax.text(
            2.0,
            countries.index("Spain") + 0.45,
            f"Spain {lookup['Spain']:.1f}%",
            fontsize=10,
            color="#8D1717",
            fontweight="bold",
            ha="left",
            va="center",
        )

    fig.text(
        0.5,
        0.055,
        "Europe does not have one construction labour market.",
        ha="center",
        va="center",
        fontsize=16,
        color="#121212",
        fontweight="bold",
    )
    fig.text(
        0.5,
        0.026,
        "Sufoniq | European Work & Mobility Systems",
        ha="center",
        va="center",
        fontsize=10,
        color="#555555",
    )

    plt.tight_layout(rect=[0.03, 0.08, 0.98, 0.93])
    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, OUT_FILE)
    plt.savefig(out_path, dpi=220, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(out_path)


if __name__ == "__main__":
    main()
