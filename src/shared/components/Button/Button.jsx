import styles from "./Button.module.scss";

/**
 * Reusable Button component
 * Variants: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * Sizes: 'sm' | 'md' | 'lg'
 */
export function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  icon = null,
  onClick,
  className = "",
  ariaLabel,
  ...rest
}) {
  const variantClass = {
    primary: styles.variantPrimary,
    secondary: styles.variantSecondary,
    outline: styles.variantOutline,
    ghost: styles.variantGhost,
    danger: styles.variantDanger,
  }[variant] || styles.variantPrimary;

  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  }[size] || styles.sizeMd;

  const buttonClasses = [
    styles.button,
    variantClass,
    sizeClass,
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      className={buttonClasses}
      {...rest}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        icon && <span className={styles.iconWrapper}>{icon}</span>
      )}
      {children && <span>{children}</span>}
    </button>
  );
}

export default Button;
