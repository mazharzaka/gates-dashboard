import { Search, RotateCcw } from "lucide-react";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import Button from "../../../../shared/components/Button";
import styles from "./AccessLogFilters.module.scss";

const GATE_OPTIONS = [
  { id: "all", labelKey: "filterAllGates" },
  { id: "GATE-01", label: "GATE-01" },
  { id: "GATE-02", label: "GATE-02" },
  { id: "GATE-03", label: "GATE-03" },
  { id: "GATE-04", label: "GATE-04" },
];

export function AccessLogFilters({ filters, onFilterChange, onReset }) {
  const { t } = useLanguage();

  return (
    <div className={styles.filterCard}>
      {/* Search by Person */}
      <div className={styles.searchGroup}>
        <label htmlFor="filter-search" className={styles.label}>
          {t("colPerson")}
        </label>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} aria-hidden="true" />
          <input
            id="filter-search"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder={t("searchPlaceholder")}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Select Gate */}
      <div className={styles.gateGroup}>
        <label htmlFor="filter-gate" className={styles.label}>
          {t("filterGate")}
        </label>
        <select
          id="filter-gate"
          value={filters.gateId}
          onChange={(e) => onFilterChange("gateId", e.target.value)}
          className={styles.select}
        >
          {GATE_OPTIONS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.labelKey ? t(g.labelKey) : g.label}
            </option>
          ))}
        </select>
      </div>

      {/* Select Type */}
      <div className={styles.typeGroup}>
        <label htmlFor="filter-type" className={styles.label}>
          {t("filterType")}
        </label>
        <select
          id="filter-type"
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className={styles.select}
        >
          <option value="all">{t("filterAllTypes")}</option>
          <option value="in">{t("filterTypeIn")}</option>
          <option value="out">{t("filterTypeOut")}</option>
        </select>
      </div>

      {/* Date From */}
      <div className={styles.dateGroup}>
        <label htmlFor="filter-date-from" className={styles.label}>
          {t("filterDateFrom")}
        </label>
        <input
          id="filter-date-from"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange("dateFrom", e.target.value)}
          className={styles.dateInput}
        />
      </div>

      {/* Date To */}
      <div className={styles.dateGroup}>
        <label htmlFor="filter-date-to" className={styles.label}>
          {t("filterDateTo")}
        </label>
        <input
          id="filter-date-to"
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange("dateTo", e.target.value)}
          className={styles.dateInput}
        />
      </div>

      {/* Reset Filter Button */}
      <div className={styles.btnGroup}>
        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          icon={<RotateCcw size={14} />}
          className={styles.resetButton}
          ariaLabel={t("clearFilters")}
        >
          {t("clearFilters")}
        </Button>
      </div>
    </div>
  );
}

export default AccessLogFilters;

