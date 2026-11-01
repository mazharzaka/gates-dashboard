import { useLanguage } from "../../hooks/useLanguage.js";
import styles from "./Text.module.scss";

export default function Text({
  children,
  i18nKey,
  className = "",
  fontSize = 14,
  fontFamily = "font500",
  color = "dark",
  lineHeight,
  ...otherProps
}) {
  const { t } = useLanguage();

  const colorClass = styles[`color-${color}`] || "";
  const fontKey = String(fontFamily).replace("font", "");
  const fontClass = styles[`font-${fontKey}`] || styles["font-500"];
  const sizeClass = styles[`size-${fontSize}`] || "";

  return (
    <p
      {...otherProps}
      className={`${styles.text} ${colorClass} ${fontClass} ${sizeClass} ${className}`.trim()}
      {...(lineHeight ? { style: { lineHeight } } : {})}
    >
      {i18nKey ? t(i18nKey) : children}
    </p>
  );
}
