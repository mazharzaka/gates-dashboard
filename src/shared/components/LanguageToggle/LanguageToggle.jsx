import { Globe } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage.js";
import styles from "./LanguageToggle.module.scss";

export function LanguageToggle({ className = "", variant = "subtle" }) {
  const { toggleLanguage, t } = useLanguage();

  const variantClass = variant === "subtle" ? styles.variantSubtle : styles.variantGhost;

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t("switchLanguage")}
      className={`${styles.toggleButton} ${variantClass} ${className}`.trim()}
    >
      <Globe size={15} aria-hidden="true" />
      <span>{t("switchLanguage")}</span>
    </button>
  );
}

export default LanguageToggle;

