# EU27 macro overlay methodology (2020-2025)

## Output files
- `00_final_eu27_macro_overlay_2020_2025.csv`
- `01_annual_unemployment_overall.csv`
- `02_annual_unemployment_youth.csv`
- `03_annual_construction_activity_with_yoy.csv`
- `04_annual_vacancy_construction.csv`
- `05_annual_wage_differential_construction_vs_B-S.csv`

## Source datasets and column mappings
- `une_rt_a` (annual unemployment):
  - overall unemployment: `age=Y15-74`, `sex=T`, `unit=PC_ACT`
  - youth unemployment: `age=Y15-24`, `sex=T`, `unit=PC_ACT`
  - output columns: `unemployment_2020`, `unemployment_2024`, `youth_unemployment_2020`, `youth_unemployment_2024`
- `une_rt_m` (monthly unemployment, optional 2025 derivation):
  - overall: `age=TOTAL`, `sex=T`, `unit=PC_ACT`, `s_adj=SA`
  - youth: `age=Y_LT25`, `sex=T`, `unit=PC_ACT`, `s_adj=SA`
  - output columns: `unemployment_2025_optional`, `youth_unemployment_2025_optional` (12-month mean, no imputation)
- `sts_copr_m` (production in construction, monthly):
  - `indic_bt=PRD`, `nace_r2=F`, `s_adj=NSA`, `unit=I21`
  - note: `I15` was rejected because many EU countries had no 2024-2025 observations under that unit
  - output columns: `construction_index_annual_avg_I21_NSA`, `yoy_pct`, `construction_activity_direction`
- `jvs_a_rate_r2` (annual vacancy rate):
  - `nace_r2=F`, `sizeclas=TOTAL`, `unit=AVG_A`
  - output columns: `vacancy_rate_construction`, `vacancy_tightness_direction`
- `lc_lci_r2_q` (quarterly labour cost index):
  - construction: `nace_r2=F`
  - comparator: `nace_r2=B-S` (broad aggregate comparator)
  - common filters: `lcstruct=D1_D4_MD5`, `unit=I20`, `s_adj=NSA`
  - output columns: `lci_yoy_construction_F_pct`, `lci_yoy_comparator_B-S_pct`, `differential_pp`, `wage_labour_cost_pressure`

## Rules implementation
- unemployment trend and youth trend:
  - `down` if 2024 <= 2020 - 0.3 pp
  - `up` if 2024 >= 2020 + 0.3 pp
  - `flat` otherwise
- construction activity direction:
  - annual average index for each year 2020-2025 from monthly values
  - YoY from annual averages for 2021..2025
  - `expansion` if positive YoY in at least 4/5 moves
  - `contraction` if negative YoY in at least 4/5 moves
  - `volatile` otherwise
  - `unclear` if continuity insufficient for full 2020-2025 rule
- vacancy tightness direction:
  - baseline rule: compare 2025 vs 2020 with +/-0.2 pp thresholds
  - fallback: if 2025 missing, compare nearest available endpoint vs 2020 and document in `data_quality_note`
- wage/labour-cost pressure:
  - annual average YoY for construction and comparator
  - differential = construction YoY - comparator YoY
  - category based on average differential over available 2021..2025 years
  - `Strong` >= 1.0 pp; `Moderate` >= 0.3 and < 1.0 pp; `Weak` < 0.3 pp; `Unclear` on insufficient continuity

## Missing data and continuity treatment
- No imputation or smoothing applied.
- Missing values remain blank in intermediate CSVs.
- `une_rt_m` optional 2025 values require full monthly availability (12 months).
- `sts_copr_m` 2025 annual averages require >=9 months; 2020-2024 require 12 months.
- `lc_lci_r2_q` 2025 annual averages require >=3 quarters; 2019-2024 require 4 quarters.

## Country-level issues identified
- construction direction unclear (insufficient 2020-2025 continuity): Cyprus, Estonia, Greece, Ireland, Latvia, Lithuania, Malta
- vacancy direction unclear (no valid endpoints): France
- wage pressure unclear (insufficient LCI continuity): Denmark, Ireland, Sweden
