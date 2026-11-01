import { useState, useEffect } from "react";
import { Users, Shield, CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import Badge from "../../../../shared/components/Badge";
import { adminService } from "../../services/adminService.js";
import styles from "./AdminPage.module.scss";

export function AdminPage() {
  const { t } = useLanguage();
  const [guards, setGuards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    adminService
      .getGuards()
      .then((data) => {
        if (!isCancelled) {
          setGuards(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setGuards([]);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.iconCircle} aria-hidden="true">
            <Users size={20} />
          </div>
          <div>
            <h2 className={styles.title}>{t("adminPageTitle")}</h2>
            <p className={styles.subtitle}>{t("adminPageSubtitle")}</p>
          </div>
        </div>
        <Badge variant="neutral" size="sm">
          {guards.length}
        </Badge>
      </div>

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.loadingText}>{t("adminLoading")}</span>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>{t("colGuardName")}</th>
                <th className={styles.th}>{t("colAssignedGates")}</th>
                <th className={styles.th}>{t("colStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {guards.map((guard) => {
                const isActive = guard.status === "active";
                return (
                  <tr key={guard.id} className={styles.row}>
                    <td className={styles.td}>
                      <div className={styles.guardNameWrapper}>
                        <Shield size={16} className={styles.guardIcon} aria-hidden="true" />
                        <span className={styles.guardName}>{guard.name}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.gatesList}>
                        {guard.assignedGates && guard.assignedGates.length > 0 ? (
                          guard.assignedGates.map((gateId) => (
                            <span key={gateId} className={styles.gateTag}>
                              {gateId}
                            </span>
                          ))
                        ) : (
                          <span className={styles.noGates}>{t("noAssignedGates")}</span>
                        )}
                      </div>
                    </td>
                    <td className={styles.td}>
                      <Badge
                        variant={isActive ? "success" : "neutral"}
                        size="sm"
                        className={styles.statusBadge}
                      >
                        {isActive ? (
                          <CheckCircle2 size={12} aria-hidden="true" />
                        ) : (
                          <XCircle size={12} aria-hidden="true" />
                        )}
                        <span>{isActive ? t("statusActive") : t("statusInactive")}</span>
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage;

