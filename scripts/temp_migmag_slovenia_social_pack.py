import csv
import os
from typing import Dict, List, Tuple

import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch


YOUTH_CSV = "analysis_outputs/eu27_macro_overlay_2020_2025/02_annual_unemployment_youth.csv"
VAC_CSV = "analysis_outputs/eu27_macro_overlay_2020_2025/04_annual_vacancy_construction.csv"
OUT_DIR_V22 = "analysis_outputs/visualizations/migmag_slovenia_pack_v22"

SLO_COLOR = "#EA580C"
EU_COLOR = "#64748B"


def read_series(path: str, value_col: str, geo: str) -> Dict[int, float]:
    out = {}
    with open(path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r.get("geo") != geo:
                continue
            raw = r.get(value_col, "")
            if not raw:
                continue
            try:
                out[int(r["year"])] = float(raw)
            except (TypeError, ValueError):
                continue
    return out


def read_eu_avg(path: str, value_col: str, years: List[int]) -> Dict[int, float]:
    vals = {y: [] for y in years}
    with open(path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            try:
                y = int(r["year"])
            except (TypeError, ValueError):
                continue
            if y not in vals:
                continue
            raw = r.get(value_col, "")
            if not raw:
                continue
            try:
                vals[y].append(float(raw))
            except ValueError:
                continue
    return {y: (sum(v) / len(v) if v else 0.0) for y, v in vals.items()}


def read_2024_points() -> List[Tuple[str, str, float, float]]:
    youth = {}
    with open(YOUTH_CSV, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r.get("year") != "2024":
                continue
            raw = r.get("youth_unemployment_rate", "")
            if not raw:
                continue
            try:
                youth[r["geo"]] = (r["country"], float(raw))
            except ValueError:
                continue

    out = []
    with open(VAC_CSV, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r.get("year") != "2024":
                continue
            raw = r.get("vacancy_rate_construction", "")
            if not raw:
                continue
            y = youth.get(r["geo"])
            if not y:
                continue
            try:
                out.append((r["geo"], y[0], y[1], float(raw)))
            except ValueError:
                continue
    return out


def init_slide():
    fig = plt.figure(figsize=(10.8, 13.5), dpi=100)
    fig.patch.set_facecolor("white")
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis("off")
    return fig, ax


def cue_strip(bg, state: str):
    colors = ["#EA580C", "#1D4ED8", "#16A34A"]
    alpha = [0.25, 0.25, 0.25]
    if state == "shortage":
        alpha = [0.9, 0.25, 0.25]
    elif state == "analysis":
        alpha = [0.25, 0.9, 0.25]
    elif state == "opportunity":
        alpha = [0.25, 0.25, 0.9]

    x0, w, y, h = 0.06, 0.28, 0.975, 0.012
    for i, c in enumerate(colors):
        rect = FancyBboxPatch(
            (x0 + i * (w + 0.01), y),
            w,
            h,
            boxstyle="round,pad=0.002,rounding_size=0.004",
            linewidth=0,
            facecolor=c,
            alpha=alpha[i],
            transform=bg.transAxes,
        )
        bg.add_patch(rect)


def draw_card(bg, x, y, w, h, title, body, fc, ec, tc, body_fs=16):
    rect = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.012,rounding_size=0.02",
        linewidth=1.2,
        edgecolor=ec,
        facecolor=fc,
        transform=bg.transAxes,
    )
    bg.add_patch(rect)
    bg.text(x + 0.02, y + h - 0.06, title, transform=bg.transAxes, ha="left", va="top", fontsize=20, fontweight="bold", color=tc)
    bg.text(x + 0.02, y + h - 0.11, body, transform=bg.transAxes, ha="left", va="top", fontsize=body_fs, color=tc, linespacing=1.28)


def slide0_exec_summary(out_dir: str):
    fig, bg = init_slide()
    cue_strip(bg, "analysis")
    bg.text(0.5, 0.93, "Executive Summary", ha="center", va="center", fontsize=38, fontweight="bold", color="#111827")
    body = (
        "1. Slovenia still shows elevated construction hiring pressure versus the EU average.\n\n"
        "2. Europe shows labour mismatch: unemployment and vacancies can coexist.\n\n"
        "3. This MIG/MAG role targets that mismatch with a clear fit profile.\n\n"
        "4. A transparent package and managed relocation make action feasible now."
    )
    draw_card(bg, 0.10, 0.33, 0.80, 0.50, "Top Message", body, "#F8FAFC", "#CBD5E1", "#0F172A")
    bg.text(0.5, 0.20, "Conclusion: Slovenia needs skilled MIG/MAG welders and offers a clear relocation pathway.", ha="center", va="center", fontsize=20, color="#111827", fontweight="bold")
    fig.savefig(os.path.join(out_dir, "slide_0_executive_summary.png"), bbox_inches="tight")
    plt.close(fig)


def slide1_shortage(years, si_vac, eu_vac, out_dir: str):
    fig, bg = init_slide()
    cue_strip(bg, "shortage")
    bg.text(0.5, 0.95, "Slovenia Construction Still Faces Worker Shortages", ha="center", va="center", fontsize=32, fontweight="bold", color="#111827")
    bg.text(0.5, 0.915, "Vacancy rate in construction, 2021-2024", ha="center", va="center", fontsize=16, color="#475569")

    ax = fig.add_axes([0.10, 0.24, 0.82, 0.58])
    y_si = [si_vac.get(y, 0) for y in years]
    y_eu = [eu_vac.get(y, 0) for y in years]
    ax.plot(years, y_si, marker="o", linewidth=5, color=SLO_COLOR)
    ax.plot(years, y_eu, marker="o", linewidth=3, linestyle="--", color=EU_COLOR)
    ax.fill_between(years, y_si, y_eu, where=[a >= b for a, b in zip(y_si, y_eu)], color="#FED7AA", alpha=0.35)
    ax.set_xticks(years)
    ax.set_ylabel("Vacancy rate (%)", fontsize=14)
    ax.grid(axis="y", color="#EEF2F7")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    v2024 = si_vac.get(2024, 0.0)
    eu2024 = eu_vac.get(2024, 0.0)
    ratio = (v2024 / eu2024) if eu2024 else 0.0
    ax.annotate(
        f"2024: {v2024:.1f}%\n~{ratio:.1f}x EU avg",
        xy=(2024, v2024),
        xytext=(2023.0, v2024 + 1.0),
        arrowprops=dict(arrowstyle="->", color="#9A3412"),
        fontsize=12,
        color="#9A3412",
    )
    ax.text(2024.03, y_si[-1] + 0.03, "Slovenia", color=SLO_COLOR, fontsize=12, fontweight="bold", va="center")
    ax.text(2024.03, y_eu[-1] - 0.03, "EU-27 average", color=EU_COLOR, fontsize=11, va="center")

    bg.text(0.5, 0.14, "So what: employer demand remains elevated in Slovenia.", ha="center", va="center", fontsize=21, color="#111827")
    fig.savefig(os.path.join(out_dir, "slide_1_shortage_evidence.png"), bbox_inches="tight")
    plt.close(fig)


def slide2_mismatch(points, out_dir: str):
    fig, bg = init_slide()
    cue_strip(bg, "analysis")
    bg.text(0.5, 0.95, "High Youth Unemployment and High Vacancies Coexist in Europe", ha="center", va="center", fontsize=30, fontweight="bold", color="#111827")
    bg.text(0.5, 0.915, "2024 snapshot: youth unemployment (x) vs construction vacancies (y)", ha="center", va="center", fontsize=16, color="#475569")

    ax = fig.add_axes([0.10, 0.22, 0.82, 0.60])
    xs = [p[2] for p in points]
    ys = [p[3] for p in points]
    x_avg = sum(xs) / len(xs)
    y_avg = sum(ys) / len(ys)
    x_min, x_max = min(xs), max(xs)
    y_min, y_max = min(ys), max(ys)

    # Mismatch quadrant background.
    ax.axvspan(x_avg, x_max + 1, ymin=(y_avg - (y_min - 0.3)) / ((y_max + 0.5) - (y_min - 0.3)), ymax=1.0, color="#FED7AA", alpha=0.18, zorder=0)

    for geo, country, x, y in points:
        color = SLO_COLOR if geo == "SI" else ("#EA580C" if (x >= x_avg and y >= y_avg) else "#94A3B8")
        size = 160 if geo == "SI" else 90
        ax.scatter(x, y, s=size, color=color, edgecolor="white", linewidth=1.2, zorder=3)
        if geo == "SI":
            ax.scatter(x, y, s=420, facecolors="none", edgecolors=SLO_COLOR, linewidths=2.0, zorder=2)
            ax.text(x + 0.30, y + 0.22, "Slovenia", fontsize=11, color="#111827", fontweight="bold")

    ax.axvline(x_avg, linestyle="--", color="#64748B")
    ax.axhline(y_avg, linestyle="--", color="#64748B")
    ax.set_xlabel("Youth unemployment rate (%)", fontsize=14)
    ax.set_ylabel("Construction vacancy rate (%)", fontsize=14)
    ax.grid(color="#EEF2F7")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.text(x_avg + 1.4, y_avg + 0.95, "Structural mismatch", fontsize=12, color="#9A3412", bbox=dict(boxstyle="round,pad=0.25", fc="#FFF7ED", ec="#FDBA74"))
    ax.text(x_avg - 6.6, y_avg + 0.95, "Skilled labour shortage", fontsize=10, color="#1E3A8A")
    ax.text(x_avg + 1.4, y_avg - 0.95, "Labour surplus", fontsize=10, color="#5B21B6")
    ax.text(x_avg - 6.6, y_avg - 0.95, "Balanced / lower pressure", fontsize=10, color="#166534")

    bg.text(0.5, 0.14, "So what: mismatch persists even when workers are available.", ha="center", va="center", fontsize=21, color="#111827")
    fig.savefig(os.path.join(out_dir, "slide_2_mismatch_evidence.png"), bbox_inches="tight")
    plt.close(fig)


def slide3_role_fit(out_dir: str):
    fig, bg = init_slide()
    cue_strip(bg, "analysis")
    bg.text(0.5, 0.95, "MIG/MAG Welders With Industrial Experience Fit This Production Role", ha="center", va="center", fontsize=30, fontweight="bold", color="#111827")
    bg.text(0.5, 0.915, "Role mechanism: candidate profile -> skill filter -> role match", ha="center", va="center", fontsize=16, color="#475569")

    draw_card(bg, 0.08, 0.42, 0.26, 0.28, "Candidate", "MIG/MAG\nwelder", "#F8FAFC", "#CBD5E1", "#0F172A")
    draw_card(bg, 0.38, 0.42, 0.26, 0.28, "Skill Filter", "- MIG/MAG exp\n- Drawing basics\n- Quality weld ID\n- Industrial products", "#FFF7ED", "#FDBA74", "#9A3412")
    draw_card(bg, 0.68, 0.42, 0.24, 0.28, "Role Match", "Production hall\n(Not ship welding)\nRelocation support", "#ECFDF3", "#86EFAC", "#14532D")
    bg.annotate("", xy=(0.37, 0.56), xytext=(0.34, 0.56), xycoords=bg.transAxes, arrowprops=dict(arrowstyle="->", lw=3.2, color="#6B7280"))
    bg.annotate("", xy=(0.67, 0.56), xytext=(0.64, 0.56), xycoords=bg.transAxes, arrowprops=dict(arrowstyle="->", lw=3.2, color="#6B7280"))

    bg.text(0.5, 0.19, "So what: this role directly targets the observed mismatch.", ha="center", va="center", fontsize=21, color="#111827")
    fig.savefig(os.path.join(out_dir, "slide_3_role_mechanism.png"), bbox_inches="tight")
    plt.close(fig)


def slide4_offer(out_dir: str):
    fig, bg = init_slide()
    cue_strip(bg, "opportunity")
    bg.text(0.5, 0.95, "A Transparent Package and Managed Relocation Reduce Candidate Risk", ha="center", va="center", fontsize=29, fontweight="bold", color="#111827")
    bg.text(0.5, 0.915, "Offer clarity supports conversion", ha="center", va="center", fontsize=16, color="#475569")

    annual_total = 1482 * 12 + 1482 + 741
    comp = (
        f"- Annual gross est.: ~EUR {annual_total:,}\n"
        "- Monthly salary: EUR 1,482 gross\n"
        "- Holiday allowance: EUR 1,482 gross\n"
        "- Winter bonus: ~EUR 741 gross"
    )
    support = (
        "- Work permit process handled\n"
        "- Accommodation support on arrival\n"
        "- Full admin onboarding support\n"
        "- Long-term cooperation model"
    )
    draw_card(bg, 0.07, 0.35, 0.40, 0.45, "Compensation", comp, "#ECFDF3", "#86EFAC", "#14532D", body_fs=14)
    draw_card(bg, 0.53, 0.35, 0.40, 0.45, "Visa & relocation", support, "#EFF6FF", "#93C5FD", "#1E3A8A", body_fs=14)

    bg.text(0.5, 0.19, "So what: the opportunity is concrete and executable.", ha="center", va="center", fontsize=21, color="#111827")
    fig.savefig(os.path.join(out_dir, "slide_4_offer_solution.png"), bbox_inches="tight")
    plt.close(fig)


def slide5_cta(out_dir: str):
    fig, bg = init_slide()
    cue_strip(bg, "opportunity")
    bg.text(0.5, 0.95, "A Simple Process Enables Hiring Now", ha="center", va="center", fontsize=34, fontweight="bold", color="#111827")
    bg.text(0.5, 0.915, "Expected timing reduces uncertainty", ha="center", va="center", fontsize=16, color="#475569")

    steps = [
        ("1", "Message us", "MIG/MAG Slovenia\n1 day"),
        ("2", "Screening", "Fit check\n1-2 days"),
        ("3", "Documents", "Permit prep\n~2 weeks"),
        ("4", "Relocate", "Arrival support\nAfter approval"),
    ]
    x_positions = [0.12, 0.36, 0.60, 0.84]
    for (num, title, desc), x in zip(steps, x_positions):
        bg.text(x, 0.66, num, transform=bg.transAxes, ha="center", va="center", fontsize=20, color="white", bbox=dict(boxstyle="circle,pad=0.3", fc="#111827", ec="#111827"))
        bg.text(x, 0.56, title, transform=bg.transAxes, ha="center", va="center", fontsize=16, fontweight="bold", color="#111827")
        # Keep copy compact so every step label stays inside its visual lane.
        bg.text(x, 0.505, desc, transform=bg.transAxes, ha="center", va="center", fontsize=12, color="#374151")
    for x0, x1 in [(0.18, 0.30), (0.42, 0.54), (0.66, 0.78)]:
        bg.annotate("", xy=(x1, 0.66), xytext=(x0, 0.66), xycoords=bg.transAxes, arrowprops=dict(arrowstyle="->", lw=2, color="#9CA3AF"))

    bg.text(0.5, 0.23, "Message now to reserve one of ", ha="right", va="center", fontsize=24, color="#111827")
    bg.text(0.5, 0.23, "4 openings", ha="left", va="center", fontsize=24, color="#B91C1C", fontweight="bold")
    fig.savefig(os.path.join(out_dir, "slide_5_action_cta.png"), bbox_inches="tight")
    plt.close(fig)


def main():
    os.makedirs(OUT_DIR_V22, exist_ok=True)
    years = [2021, 2022, 2023, 2024]
    si_vac = read_series(VAC_CSV, "vacancy_rate_construction", "SI")
    eu_vac = read_eu_avg(VAC_CSV, "vacancy_rate_construction", years)
    points = read_2024_points()

    slide0_exec_summary(OUT_DIR_V22)
    slide1_shortage(years, si_vac, eu_vac, OUT_DIR_V22)
    slide2_mismatch(points, OUT_DIR_V22)
    slide3_role_fit(OUT_DIR_V22)
    slide4_offer(OUT_DIR_V22)
    slide5_cta(OUT_DIR_V22)
    print(OUT_DIR_V22)


if __name__ == "__main__":
    main()
