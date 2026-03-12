import csv
import io
import os
import subprocess
from typing import Dict, List

import imageio.v2 as imageio
import imageio_ffmpeg
import plotly.express as px
import plotly.graph_objects as go


CSV_PATH = "analysis_outputs/eu27_macro_overlay_2020_2025/04_annual_vacancy_construction.csv"
AUDIO_PATH = "analysis_outputs/visualizations/Density & Time - Packed (No Copyright Music).mp3"
OUT_DIR = "analysis_outputs/visualizations"
OUT_SILENT = "construction_vacancies_story_v2_silent.mp4"
OUT_AUDIO = "construction_vacancies_story_v2_with_audio.mp4"

WIDTH = 1080
HEIGHT = 1350
FPS = 5

# 15-second structure.
SCENE_SECONDS = {
    "intro": 2.0,
    "map_latest": 4.0,
    "rise": 3.0,
    "cool": 3.0,
    "outro": 3.0,
}

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
    out = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            raw = r.get("vacancy_rate_construction", "")
            iso3 = ISO2_TO_ISO3.get(r.get("geo", ""))
            if not raw or not iso3:
                continue
            try:
                out.append(
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
    return out


def fig_to_frame(fig: go.Figure):
    png = fig.to_image(format="png", width=WIDTH, height=HEIGHT, scale=1)
    return imageio.imread(io.BytesIO(png))


def add_scene(frames: List, fig: go.Figure, seconds: float) -> None:
    frame = fig_to_frame(fig)
    repeats = max(1, int(round(seconds * FPS)))
    for _ in range(repeats):
        frames.append(frame)


def canvas() -> go.Figure:
    fig = go.Figure()
    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        paper_bgcolor="#07111f",
        plot_bgcolor="#07111f",
        margin=dict(l=40, r=40, t=40, b=40),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
    )
    return fig


def intro_figure(start: int, end: int) -> go.Figure:
    fig = canvas()
    fig.add_annotation(
        text="CONSTRUCTION HIRING PRESSURE",
        x=0.5,
        y=0.77,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=52, color="#F8FAFC"),
    )
    fig.add_annotation(
        text=f"EU-27 | {start}-{end}",
        x=0.5,
        y=0.68,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=28, color="#C5D1E0"),
    )
    fig.add_annotation(
        text="Where are construction employers struggling to hire?",
        x=0.5,
        y=0.50,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=28, color="#E2E8F0"),
    )
    fig.add_annotation(
        text="Vacancy rate = share of unfilled jobs",
        x=0.5,
        y=0.20,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=22, color="#94A3B8"),
    )
    return fig


def map_latest_figure(rows_latest: List[dict], year: int, zmin: float, zmax: float) -> go.Figure:
    eu_avg = sum(r["rate"] for r in rows_latest) / len(rows_latest)
    top = sorted(rows_latest, key=lambda r: r["rate"], reverse=True)[:4]
    top_txt = "<br>".join([f"{i+1}. {r['country']} {r['rate']:.1f}%" for i, r in enumerate(top)])

    fig = px.choropleth(
        rows_latest,
        locations="iso3",
        locationmode="ISO-3",
        color="rate",
        hover_name="country",
        scope="europe",
        color_continuous_scale=[
            [0.0, "#0EA5E9"],
            [0.5, "#22D3EE"],
            [0.75, "#F59E0B"],
            [1.0, "#EF4444"],
        ],
        range_color=(zmin, zmax),
        labels={"rate": "Vacancy rate (%)"},
        title=f"Where Construction Vacancies Are Highest ({year})",
    )
    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        paper_bgcolor="#07111f",
        plot_bgcolor="#07111f",
        margin=dict(l=24, r=24, t=110, b=70),
        title_font=dict(size=42, color="#F8FAFC"),
        coloraxis_colorbar=dict(
            title="Rate (%)",
            titlefont=dict(size=16, color="#DDE7F3"),
            tickfont=dict(size=13, color="#DDE7F3"),
            len=0.4,
            x=0.1,
            y=0.19,
            thickness=14,
            bgcolor="rgba(0,0,0,0)",
        ),
        geo=dict(
            bgcolor="rgba(0,0,0,0)",
            showcountries=True,
            countrycolor="#1F2A3A",
            showcoastlines=False,
            projection_type="mercator",
            domain=dict(x=[0.0, 0.78], y=[0.1, 0.92]),
        ),
    )
    fig.update_traces(marker_line_color="#0f172a", marker_line_width=0.8)
    fig.add_annotation(
        text=f"EU-27 average: <b>{eu_avg:.1f}%</b>",
        x=0.5,
        y=1.01,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=20, color="#C5D1E0"),
    )
    fig.add_annotation(
        text="<b>Highest demand pressure</b><br>" + top_txt,
        x=0.97,
        y=0.78,
        xref="paper",
        yref="paper",
        showarrow=False,
        align="left",
        bordercolor="#223045",
        borderwidth=1,
        borderpad=10,
        bgcolor="#0b1728",
        font=dict(size=17, color="#E6EDF7"),
    )
    fig.add_annotation(
        text="Hotter colors = tighter hiring conditions",
        x=0.5,
        y=0.04,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=18, color="#9FB0C5"),
    )
    return fig


def bars_figure(rows: List[dict], title: str, subtitle: str, positive: bool) -> go.Figure:
    rows = sorted(rows, key=lambda r: r["change"], reverse=positive)[:6]
    countries = [r["country"] for r in rows][::-1]
    vals = [r["change"] for r in rows][::-1]
    color = "#f97316" if positive else "#22c55e"

    fig = go.Figure(
        go.Bar(
            x=vals,
            y=countries,
            orientation="h",
            marker=dict(color=color),
            text=[f"{v:+.1f} pp" for v in vals],
            textposition="outside",
        )
    )
    fig.update_layout(
        width=WIDTH,
        height=HEIGHT,
        paper_bgcolor="#07111f",
        plot_bgcolor="#07111f",
        margin=dict(l=160, r=80, t=130, b=110),
        title=dict(text=title, x=0.5, font=dict(size=44, color="#F8FAFC")),
        xaxis=dict(
            title="Change in vacancy rate (percentage points)",
            color="#C7D3E0",
            gridcolor="#1c2a3c",
            zerolinecolor="#334155",
        ),
        yaxis=dict(color="#E2E8F0"),
    )
    fig.add_annotation(
        text=subtitle,
        x=0.5,
        y=1.02,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=21, color="#AAB9CB"),
    )
    fig.add_annotation(
        text="2021 to 2024 | EU-27 construction vacancy rate",
        x=0.5,
        y=0.03,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=16, color="#8FA1B8"),
    )
    return fig


def outro_figure() -> go.Figure:
    fig = canvas()
    fig.add_annotation(
        text="ONE EUROPE, DIFFERENT LABOUR MARKETS",
        x=0.5,
        y=0.73,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=47, color="#F8FAFC"),
    )
    fig.add_annotation(
        text="Construction hiring pressure is not evenly distributed.",
        x=0.5,
        y=0.52,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=28, color="#D7E0EC"),
    )
    fig.add_annotation(
        text="Source: Eurostat | Vacancy rate in construction (%)",
        x=0.5,
        y=0.2,
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=20, color="#93A4B9"),
    )
    return fig


def add_audio(silent_path: str, out_path: str, audio_path: str) -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    # Requested structure:
    # 0-2s soft intro, 2-12s main beat, 12-15s slight rise.
    filter_complex = (
        "[1:a]atrim=0:15,asetpts=PTS-STARTPTS,"
        "volume='if(lt(t,2),0.24,if(lt(t,12),0.68,0.90))',"
        "afade=t=in:st=0:d=0.5,afade=t=out:st=14.7:d=0.3[a]"
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
        out_path,
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"ffmpeg audio mux failed:\n{res.stderr}")


def main() -> None:
    rows = load_rows()
    if not rows:
        raise ValueError("No vacancy data rows loaded.")

    coverage: Dict[int, int] = {}
    for r in rows:
        coverage[r["year"]] = coverage.get(r["year"], 0) + 1

    max_cov = max(coverage.values())
    full_years = sorted([y for y, c in coverage.items() if c == max_cov])
    # Build story on comparable years only.
    years = full_years[-4:] if len(full_years) >= 4 else full_years
    if len(years) < 2:
        raise ValueError("Need at least two comparable years.")

    rows_by_year = {y: [r for r in rows if r["year"] == y] for y in years}
    latest_year = years[-1]
    latest_rows = rows_by_year[latest_year]
    zmin = min(r["rate"] for y in years for r in rows_by_year[y])
    zmax = max(r["rate"] for y in years for r in rows_by_year[y])

    start_year = years[0]
    start_map = {r["geo"]: r for r in rows_by_year[start_year]}
    end_map = {r["geo"]: r for r in rows_by_year[latest_year]}
    changes = []
    for geo, r_end in end_map.items():
        if geo in start_map:
            changes.append(
                {
                    "country": r_end["country"],
                    "change": r_end["rate"] - start_map[geo]["rate"],
                }
            )

    frames: List = []
    add_scene(frames, intro_figure(start_year, latest_year), SCENE_SECONDS["intro"])
    add_scene(frames, map_latest_figure(latest_rows, latest_year, zmin, zmax), SCENE_SECONDS["map_latest"])
    add_scene(
        frames,
        bars_figure(
            changes,
            "Where Vacancy Pressure Rose Fastest",
            "Biggest increases in unfilled construction jobs",
            positive=True,
        ),
        SCENE_SECONDS["rise"],
    )
    add_scene(
        frames,
        bars_figure(
            changes,
            "Where Pressure Cooled",
            "Largest declines in vacancy rates",
            positive=False,
        ),
        SCENE_SECONDS["cool"],
    )
    add_scene(frames, outro_figure(), SCENE_SECONDS["outro"])

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
        for frame in frames:
            writer.append_data(frame)

    add_audio(silent_path, audio_path, AUDIO_PATH)
    print(silent_path)
    print(audio_path)


if __name__ == "__main__":
    main()
