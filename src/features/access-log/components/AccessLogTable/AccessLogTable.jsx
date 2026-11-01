import { useState } from "react";
import { Download, ChevronRight, ChevronLeft, Inbox, ArrowDownRight, ArrowUpLeft } from "lucide-react";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import { useAuth } from "../../../auth/context/AuthContext.jsx";
import { can } from "../../../auth/permissions.js";
import Badge from "../../../../shared/components/Badge";
import Button from "../../../../shared/components/Button";
import { formatDateTime } from "../../../../shared/utils/formatTime.js";
import { exportLogsToCsv } from "../../utils/exportCsv.js";
import styles from "./AccessLogTable.module.scss";

const PAGE_SIZE = 10;

export function AccessLogTable({ logs = [], isLoading = false }) {
  const { language, dir, t } = useLanguage();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const currentLogs = logs.slice(startIndex, startIndex + PAGE_SIZE);

  const handleExport = () => {
    exportLogsToCsv(logs, language, {
      colPerson: t("colPerson"),
      colGate: t("colGate"),
      colType: t("colType"),
      colTime: t("colTime"),
      colRecordedBy: t("colRecordedBy"),
      filterTypeIn: t("filterTypeIn"),
      filterTypeOut: t("filterTypeOut"),
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  // When dir is rtl, Next arrow points left, Prev arrow points right
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <div className={styles.tableContainer}>
      {/* Table Header Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            {t("tabAccessLog")}
          </h2>
          <span className={styles.countBadge}>
            {t("paginationTotalRows", { total: logs.length })}
          </span>
        </div>

        {can(user?.role, "exportLogs") && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={logs.length === 0}
            icon={<Download size={15} />}
          >
            {t("exportCsv")}
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.loadingText}>{t("logsLoading")}</span>
        </div>
      ) : logs.length === 0 ? (
        /* Empty State */
        <div className={styles.emptyWrapper}>
          <div className={styles.emptyIconCircle}>
            <Inbox size={28} />
          </div>
          <h3 className={styles.emptyTitle}>
            {t("emptyLogsTitle")}
          </h3>
          <p className={styles.emptySubtitle}>
            {t("emptyLogsSubtitle")}
          </p>
        </div>
      ) : (
        /* Data Table */
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.th}>{t("colPerson")}</th>
                <th className={styles.th}>{t("colGate")}</th>
                <th className={styles.th}>{t("colType")}</th>
                <th className={styles.th}>{t("colTime")}</th>
                <th className={styles.th}>{t("colRecordedBy")}</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log) => {
                const isIn = log.type === "in";
                return (
                  <tr key={log.id} className={styles.tr}>
                    {/* Person Name */}
                    <td className={styles.tdPerson}>
                      {log.person}
                    </td>

                    {/* Gate */}
                    <td className={styles.tdGate}>
                      <span className={styles.gateTag}>
                        {log.gateId}
                      </span>
                    </td>

                    {/* Type Badge */}
                    <td className={styles.tdType}>
                      <Badge
                        variant={isIn ? "success" : "neutral"}
                        size="sm"
                        withDot
                      >
                        {isIn ? (
                          <ArrowDownRight size={13} className={styles.typeIcon} />
                        ) : (
                          <ArrowUpLeft size={13} className={styles.typeIcon} />
                        )}
                        {isIn ? t("filterTypeIn") : t("filterTypeOut")}
                      </Badge>
                    </td>

                    {/* Time */}
                    <td className={styles.tdTime}>
                      {formatDateTime(log.timestamp, language)}
                    </td>

                    {/* Recorded By */}
                    <td className={styles.tdRecordedBy}>
                      {log.recordedBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {logs.length > 0 && (
        <div className={styles.paginationBar}>
          <span className={styles.pageInfo}>
            {t("paginationPage", { current: safePage, total: totalPages })}
          </span>

          <div className={styles.pageActions}>
            <Button
              variant="secondary"
              size="sm"
              disabled={safePage <= 1}
              onClick={handlePrevPage}
              icon={<PrevIcon size={16} />}
              ariaLabel={t("paginationPrev")}
            >
              {t("paginationPrev")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={handleNextPage}
              icon={<NextIcon size={16} />}
              ariaLabel={t("paginationNext")}
            >
              {t("paginationNext")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessLogTable;

