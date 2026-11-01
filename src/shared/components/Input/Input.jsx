import { useId } from "react";
import styles from "./Input.module.scss";

export function Input({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error = "",
  startIcon = null,
  endSlot = null,
  disabled = false,
  autoComplete,
  className = "",
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  const inputClasses = [
    styles.input,
    startIcon ? styles.withStartIcon : "",
    endSlot ? styles.withEndSlot : "",
    error ? styles.hasError : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.requiredAsterisk} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className={styles.inputContainer}>
        {startIcon && <div className={styles.startIcon}>{startIcon}</div>}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={inputClasses}
          {...rest}
        />

        {endSlot && <div className={styles.endSlot}>{endSlot}</div>}
      </div>

      {error && (
        <span id={errorId} role="alert" className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;

