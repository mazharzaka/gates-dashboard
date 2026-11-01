import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./TextInput.module.scss";

export const TextInput = forwardRef(function TextInput(
  {
    label,
    error,
    required = false,
    isPassword = false,
    type = "text",
    toggleShowLabel = "إظهار كلمة المرور",
    toggleHideLabel = "إخفاء كلمة المرور",
    ...rest
  },
  ref
) {
  const id = useId();
  const errorId = `${id}-error`;
  const [showPassword, setShowPassword] = useState(false);

  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          ref={ref}
          id={id}
          type={resolvedType}
          className={`${styles.input} ${error ? styles.hasError : ""}`.trim()}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? toggleHideLabel : toggleShowLabel}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default TextInput;
