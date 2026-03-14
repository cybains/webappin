import csv
import io
import os
import subprocess
from typing import Dict, List, Tuple

import imageio.v2 as imageio
import imageio_ffmpeg
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyBboxPatch


YOUTH_CSV = "analysis_outputs/eu27_macro_overlay_2020_2025/02_annual_unemployment_youth.csv"
VAC_CSV = "analysis_outputs/eu27_macro_overlay_2020_2025/04_annual_vacancy_construction.csv"
AUDIO_PATH = "analysis_outputs/visualizations/Density & Time - Packed (No Copyright Music).mp3"
OUT_DIR = "analysis_outputs/visualizations"
OUT_SILENT = "migmag_reel_progressive_silent.mp4"
OUT_AUDIO = "migmag_reel_progressive_with_audio.mp4"

FPS = 10
W = 1080
H = 1350
DPI = 100
FRAMES_PER_SCENE = 50  # 5 seconds per scene at 10 fps -> 25s total.

SLO_COLOR = "#EA580C"
EU_COLOR = "#64748B"
BG = "#F8FAFC"


def fig_to_frame(fig) -> np.ndarray:
    fig.canvas.draw()
    w, h = fig.canvas.get_width_height()
    buf = np.frombuffer(fig.canvas.tostring_rgb(), dtype=np.uint8)
    return buf.reshape(h, w, 3)


def smoothstep(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def read_series(path: str, value_col: str, geo: str) -> Dict[int, float]:
    out: Dict[int, float] = {}
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


def read_mismatch_points_2024() -> List[Tuple[str, str, float, float]]:
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


def base_figure(bg_color: str = BG):
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    fig.patch.set_facecolor(bg_color)
    return fig


def scene1_shortage(progress: float, years: List[int], slo: Dict[int, float], eu: Dict[int, float]) -> np.ndarray:
    fig = base_figure("#FFF7ED")
    ax = fig.add_axes([0.10, 0.23, 0.82, 0.55])
    y_s = [slo[y] for y in years]
    y_e = [eu[y] for y in years]

    p_eu_dim = smoothstep((progress - 0.15) / 0.45)
    p_fill = smoothstep((progress - 0.28) / 0.45)
    p_anno = smoothstep((progress - 0.62) / 0.30)

    ax.plot(years, y_e, marker="o", linewidth=3, linestyle="--", color=EU_COLOR, alpha=0.78 - 0.45 * p_eu_dim)
    ax.plot(years, y_s, marker="o", linewidth=5, color=SLO_COLOR, alpha=0.82 + 0.18 * p_eu_dim)
    ax.fill_between(years, y_s, y_e, where=[a >= b for a, b in zip(y_s, y_e)], color="#FDBA74", alpha=0.42 * p_fill)

    ax.set_xticks(years)
    ax.set_ylabel("Vacancy rate (%)", fontsize=13)
    ax.grid(axis="y", color="#E5E7EB")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.text(0.5, 0.91, "Slovenia Construction Still Needs Welders", ha="center", va="center", fontsize=31, fontweight="bold", color="#111827")
    fig.text(0.5, 0.855, "Construction vacancies: Slovenia vs EU-27", ha="center", va="center", fontsize=18, color="#475569")
    ax.text(2024.03, y_s[-1] + 0.02, "Slovenia", color=SLO_COLOR, fontsize=11, fontweight="bold", alpha=0.65 + 0.35 * p_fill)
    ax.text(2024.03, y_e[-1] - 0.02, "EU-27 avg", color=EU_COLOR, fontsize=10, alpha=0.65 + 0.35 * p_fill)
    ratio = y_s[-1] / y_e[-1] if y_e[-1] else 0
    ax.annotate(
        f"2024: {y_s[-1]:.1f}%  (~{ratio:.1f}x EU)",
        xy=(2024, y_s[-1]),
        xytext=(2022.78, y_s[-1] + 0.9),
        arrowprops=dict(arrowstyle="->", color="#9A3412", alpha=p_anno),
        fontsize=11,
        color=(0.604, 0.204, 0.071, p_anno),
    )
    fig.text(0.5, 0.12, "Employer demand remains high.", ha="center", va="center", fontsize=21, color=(0.067, 0.094, 0.153, p_anno))

    frame = fig_to_frame(fig)
    plt.close(fig)
    return frame


def scene2_mismatch(progress: float, pts: List[Tuple[str, str, float, float]]) -> np.ndarray:
    fig = base_figure("#F8FAFF")
    ax = fig.add_axes([0.10, 0.21, 0.82, 0.58])
    xs = [p[2] for p in pts]
    ys = [p[3] for p in pts]
    x_avg = sum(xs) / len(xs)
    y_avg = sum(ys) / len(ys)
    x_max = max(xs)
    y_max = max(ys)
    y_min = min(ys)

    p_spot = smoothstep((progress - 0.18) / 0.30)
    p_zone = smoothstep((progress - 0.45) / 0.32)
    p_text = smoothstep((progress - 0.70) / 0.22)

    if p_zone > 0:
        ax.axvspan(
            x_avg,
            x_max + 1,
            ymin=(y_avg - (y_min - 0.3)) / ((y_max + 0.5) - (y_min - 0.3)),
            ymax=1.0,
            color="#FED7AA",
            alpha=0.22 * p_zone,
            zorder=0,
        )

    for geo, country, x, y in pts:
        color = "#94A3B8"
        size = 90
        if geo == "SI":
            color = SLO_COLOR
            size = 110 + 70 * p_spot
        elif x >= x_avg and y >= y_avg:
            color = (0.918, 0.365, 0.016, 0.45 + 0.55 * p_spot)
        ax.scatter(x, y, s=size, color=color, edgecolor="white", linewidth=1.2, zorder=3)
        if geo == "SI":
            ax.scatter(x, y, s=300 + 180 * p_spot, facecolors="none", edgecolors=SLO_COLOR, linewidths=1.0 + 1.5 * p_spot, zorder=2, alpha=0.3 + 0.7 * p_spot)
            ax.text(x + 0.3, y + 0.22, "Slovenia", fontsize=11, fontweight="bold", alpha=0.4 + 0.6 * p_spot)

    ax.axvline(x_avg, linestyle="--", color="#64748B")
    ax.axhline(y_avg, linestyle="--", color="#64748B")
    ax.set_xlabel("Youth unemployment (%)", fontsize=13)
    ax.set_ylabel("Construction vacancies (%)", fontsize=13)
    ax.grid(color="#E5E7EB")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.text(0.5, 0.91, "Workers Exist, But Skills Do Not Always Match Jobs", ha="center", va="center", fontsize=28, fontweight="bold", color="#111827")
    fig.text(0.5, 0.855, "Europe labour market snapshot", ha="center", va="center", fontsize=18, color="#475569")
    ax.text(
        x_avg + 1.4,
        y_avg + 0.9,
        "Structural mismatch",
        fontsize=11,
        color=(0.604, 0.204, 0.071, 0.35 + 0.65 * p_zone),
        bbox=dict(boxstyle="round,pad=0.25", fc=(1.0, 0.968, 0.929, 0.40 + 0.50 * p_zone), ec=(0.992, 0.729, 0.455, 0.35 + 0.65 * p_zone)),
    )
    fig.text(0.5, 0.12, "Some countries have unemployment and shortages at the same time.", ha="center", va="center", fontsize=19, color=(0.067, 0.094, 0.153, p_text))

    frame = fig_to_frame(fig)
    plt.close(fig)
    return frame


def scene3_skill_filter(progress: float) -> np.ndarray:
    fig = base_figure("#F7FDF8")
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis("off")

    fig.text(0.5, 0.91, "MIG/MAG Welders Fit This Role", ha="center", va="center", fontsize=33, fontweight="bold", color="#111827")
    fig.text(0.5, 0.855, "Candidate -> skill filter -> role match", ha="center", va="center", fontsize=18, color="#475569")

    a1 = smoothstep((progress - 0.00) / 0.22)
    a2 = smoothstep((progress - 0.22) / 0.22)
    a3 = smoothstep((progress - 0.48) / 0.22)
    a4 = smoothstep((progress - 0.74) / 0.20)

    def box(x, y, w, h, title, body, fc, ec, tc, alpha=1.0):
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.012,rounding_size=0.02", linewidth=1.3, edgecolor=ec, facecolor=fc, alpha=alpha, transform=ax.transAxes)
        ax.add_patch(rect)
        ax.text(x + 0.02, y + h - 0.06, title, transform=ax.transAxes, ha="left", va="top", fontsize=18, fontweight="bold", color=tc, alpha=alpha)
        ax.text(x + 0.02, y + h - 0.11, body, transform=ax.transAxes, ha="left", va="top", fontsize=15, color=tc, linespacing=1.3, alpha=alpha)

    box(0.08, 0.42, 0.26, 0.30, "Candidate", "MIG/MAG\nwelder", "#F8FAFC", "#CBD5E1", "#0F172A", a1)

    txt = "- MIG/MAG exp"
    if a2 > 0.45:
        txt = "- MIG/MAG exp\n- Drawing basics"
    if a2 > 0.78:
        txt = "- MIG/MAG exp\n- Drawing basics\n- Quality weld ID\n- Industrial products"
    box(0.38, 0.42, 0.26, 0.30, "Skill Filter", txt, "#FFF7ED", "#FDBA74", "#9A3412", a2)

    box(0.68, 0.42, 0.24, 0.30, "Role Match", "Production hall\n(Not ship welding)\nRelocation support", "#ECFDF3", "#86EFAC", "#14532D", a3)
    if a2 > 0.05:
        ax.annotate("", xy=(0.37, 0.57), xytext=(0.34, 0.57), xycoords=ax.transAxes, arrowprops=dict(arrowstyle="->", lw=2.4 + 1.2 * a2, color="#6B7280", alpha=a2))
    if a3 > 0.05:
        ax.annotate("", xy=(0.67, 0.57), xytext=(0.64, 0.57), xycoords=ax.transAxes, arrowprops=dict(arrowstyle="->", lw=2.4 + 1.2 * a3, color="#6B7280", alpha=a3))
    fig.text(0.5, 0.13, "Clear filter = better fit and faster hiring.", ha="center", va="center", fontsize=21, color=(0.067, 0.094, 0.153, a4))

    frame = fig_to_frame(fig)
    plt.close(fig)
    return frame


def scene4_offer(progress: float) -> np.ndarray:
    fig = base_figure("#F0FDF4")
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis("off")

    annual_total = 1482 * 12 + 1482 + 741
    fig.text(0.5, 0.91, "Real Job. Clear Package. Managed Relocation.", ha="center", va="center", fontsize=32, fontweight="bold", color="#111827")

    a1 = smoothstep((progress - 0.00) / 0.25)
    a2 = smoothstep((progress - 0.25) / 0.25)
    a3 = smoothstep((progress - 0.55) / 0.28)

    fig.text(0.5, 0.77, "MIG/MAG welders | Slovenia", ha="center", va="center", fontsize=24, color=(0.216, 0.251, 0.318, a1))
    fig.text(
        0.5,
        0.64,
        f"~EUR {annual_total:,} gross per year",
        ha="center",
        va="center",
        fontsize=34 + 8 * a2,
        color=(0.918, 0.345, 0.047, a2),
        fontweight="bold",
    )
    fig.text(
        0.5,
        0.50,
        "Visa process handled\nAccommodation support\nAdmin support after arrival",
        ha="center",
        va="center",
        fontsize=22,
        color=(0.078, 0.325, 0.176, a3),
        linespacing=1.45,
    )
    fig.text(0.5, 0.18, "You know the offer before you move.", ha="center", va="center", fontsize=22, color=(0.067, 0.094, 0.153, a3))

    frame = fig_to_frame(fig)
    plt.close(fig)
    return frame


def scene5_cta(progress: float) -> np.ndarray:
    fig = base_figure("#ECFEFF")
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis("off")
    alpha = min(1.0, max(0.0, progress * 1.4))

    fig.text(0.5, 0.74, "MIG/MAG Welders Needed in Slovenia", ha="center", va="center", fontsize=35, color="#111827", fontweight="bold", alpha=alpha)
    fig.text(0.5, 0.56, "Message us on Facebook", ha="center", va="center", fontsize=31, color=SLO_COLOR, fontweight="bold", alpha=alpha)
    fig.text(0.5, 0.46, "Keyword: MIG/MAG Slovenia", ha="center", va="center", fontsize=23, color="#374151", alpha=alpha)
    fig.text(0.5, 0.20, "Sufoniq | European Work and Mobility Systems", ha="center", va="center", fontsize=15, color="#6B7280", alpha=alpha)

    frame = fig_to_frame(fig)
    plt.close(fig)
    return frame


def add_audio_to_video(silent_path: str, output_path: str, audio_path: str, duration_sec: int) -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    filter_complex = (
        f"[1:a]atrim=0:{duration_sec},asetpts=PTS-STARTPTS,"
        f"volume='if(lt(t,2),0.24,if(lt(t,{duration_sec-3}),0.68,0.90))',"
        f"afade=t=in:st=0:d=0.5,afade=t=out:st={duration_sec-0.4}:d=0.3[a]"
    )
    cmd = [
        ffmpeg,
        "-y",
        "-i",
        silent_path,
        "-stream_loop",
        "-1",
        "-i",
        audio_path,
        "-filter_complex",
        filter_complex,
        "-map",
        "0:v",
        "-map",
        "[a]",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        output_path,
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Audio mux failed:\n{res.stderr}")


def main():
    years = [2021, 2022, 2023, 2024]
    si_vac = read_series(VAC_CSV, "vacancy_rate_construction", "SI")
    eu_vac = read_eu_avg(VAC_CSV, "vacancy_rate_construction", years)
    points = read_mismatch_points_2024()

    frames: List[np.ndarray] = []
    for i in range(FRAMES_PER_SCENE):
        frames.append(scene1_shortage(i / (FRAMES_PER_SCENE - 1), years, si_vac, eu_vac))
    for i in range(FRAMES_PER_SCENE):
        frames.append(scene2_mismatch(i / (FRAMES_PER_SCENE - 1), points))
    for i in range(FRAMES_PER_SCENE):
        frames.append(scene3_skill_filter(i / (FRAMES_PER_SCENE - 1)))
    for i in range(FRAMES_PER_SCENE):
        frames.append(scene4_offer(i / (FRAMES_PER_SCENE - 1)))
    for i in range(FRAMES_PER_SCENE):
        frames.append(scene5_cta(i / (FRAMES_PER_SCENE - 1)))

    os.makedirs(OUT_DIR, exist_ok=True)
    silent_path = os.path.join(OUT_DIR, OUT_SILENT)
    audio_path = os.path.join(OUT_DIR, OUT_AUDIO)

    with imageio.get_writer(
        silent_path,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=1,
    ) as writer:
        for f in frames:
            writer.append_data(f)

    add_audio_to_video(silent_path, audio_path, AUDIO_PATH, duration_sec=25)
    print(silent_path)
    print(audio_path)


if __name__ == "__main__":
    main()
