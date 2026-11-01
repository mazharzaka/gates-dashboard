import { Circle } from "lucide-react";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import styles from "./GateStatusBadge.module.scss";

export function GateStatusBadge({ status, size = "md" }) {
  const { t } = useLanguage();
  const isOpen = status === "open";
  const sizeClass = size === "sm" ? styles.sizeSm : styles.sizeMd;

  return (
    <span className={`${styles.statusBadge} ${sizeClass}`}>
      <Circle
        size={8}
        fill={isOpen ? "currentColor" : "none"}
        strokeWidth={2}
        className={styles.icon}
        aria-hidden="true"
      />
      <span className={styles.label}>
        {isOpen ? t("gateStatusOpen") : t("gateStatusClosed")}
      </span>
    </span>
  );
}

export default GateStatusBadge;
