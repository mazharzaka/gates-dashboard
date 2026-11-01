import { useLanguage } from "../../hooks/useLanguage.js";
import defaultLogo from "../../assets/brand/etisalat-logo.svg";
import whiteLogo from "../../assets/brand/etisalat-logo-white.svg";
import markLogo from "../../assets/brand/etisalat-mark.svg";
import styles from "./BrandLogo.module.scss";

const LOGO_SRC = {
  default: defaultLogo,
  white: whiteLogo,
  mark: markLogo,
};

export function BrandLogo({ variant = "default", height, className = "" }) {
  const { t } = useLanguage();
  const src = LOGO_SRC[variant] || defaultLogo;
  const variantClass = styles[variant] || "";

  return (
    <img
      src={src}
      alt={t("brandAlt")}
      height={height}
      className={`${styles.logo} ${variantClass} ${className}`.trim()}
    />
  );
}

export default BrandLogo;

