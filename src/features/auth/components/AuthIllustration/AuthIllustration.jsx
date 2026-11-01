import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import BrandLogo from "../../../../shared/components/BrandLogo";
import styles from "./AuthIllustration.module.scss";

export function AuthIllustration() {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      {/* Decorative background ambient glows */}
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      {/* Main Vector Artwork: Security Shield & Smart Gate Gateway */}
      <div className={styles.artWrapper}>

      </div>

      {/* Brand Text Inside Panel */}
      <div className={styles.textContainer}>
        <div className={styles.logoWrapper}>
          <BrandLogo variant="white" className={styles.panelLogo} />
        </div>
        <h2 className={styles.title}>{t("brandName")}</h2>
        <p className={styles.subtitle}>{t("brandSubtitle")}</p>
      </div>
    </div>
  );
}

export default AuthIllustration;
