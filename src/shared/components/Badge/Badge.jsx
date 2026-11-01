import styles from "./Badge.module.scss";

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  withDot = false,
  className = "",
}) {
  const variantClass = {
    success: styles.variantSuccess,
    danger: styles.variantDanger,
    warning: styles.variantWarning,
    primary: styles.variantPrimary,
    neutral: styles.variantNeutral,
  }[variant] || styles.variantNeutral;

  const sizeClass = size === "sm" ? styles.sizeSm : styles.sizeMd;
  const dotSizeClass = size === "sm" ? styles.dotSm : styles.dotMd;

  const badgeClasses = [
    styles.badge,
    variantClass,
    sizeClass,
    className,
  ].filter(Boolean).join(" ");

  return (
    <span className={badgeClasses}>
      {withDot && (
        <span
          className={`${styles.dot} ${dotSizeClass}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export default Badge;

