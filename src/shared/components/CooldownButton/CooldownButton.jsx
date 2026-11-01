import { useCooldown } from "../../hooks/useCooldown.js";
import styles from "./CooldownButton.module.scss";

export function CooldownButton({
  onClick,
  cooldownMs = 5000,
  children,
  icon,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}) {
  const { isCoolingDown, start } = useCooldown(cooldownMs);

  const handleClick = (e) => {
    if (isCoolingDown) return;
    start();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isCoolingDown}
      aria-disabled={isCoolingDown}
      aria-label={ariaLabel}
      className={`${styles.button} ${isCoolingDown ? styles.coolingDown : ""} ${className}`.trim()}
      {...rest}
    >
      {icon && <span className={styles.iconWrapper} aria-hidden="true">{icon}</span>}
      <span className={styles.label}>{children}</span>
    </button>
  );
}

export default CooldownButton;

