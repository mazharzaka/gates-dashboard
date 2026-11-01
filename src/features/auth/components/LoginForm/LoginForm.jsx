import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import TextInput from "../../../../shared/components/TextInput";
import BrandLogo from "../../../../shared/components/BrandLogo";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import { getLoginValidation } from "../../validation";
import styles from "./LoginForm.module.scss";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const validation = useMemo(() => getLoginValidation(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [serverError, setServerError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!lockedUntil) return;

    const updateCountdown = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setSecondsLeft(0);
        setLockedUntil(null);
        setFailedAttempts(0);
      } else {
        setSecondsLeft(remaining);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const onSubmit = async ({ username, password }) => {
    if (lockedUntil) return;

    setServerError("");

    try {
      await login(username, password);
      setFailedAttempts(0);
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);
      setServerError(t("invalidCredentials"));

      if (nextFailures >= 3) {
        // eslint-disable-next-line react-hooks/purity
        setLockedUntil(Date.now() + 30000);
      }
    }
  };

  const isLocked = Boolean(lockedUntil && secondsLeft > 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <BrandLogo variant="default" className={styles.formLogo} />
      </div>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("signInTitle")}</h1>
        <p className={styles.subtitle}>{t("signInSubtitle")}</p>
      </div>

      {serverError && (
        <div className={styles.banner} role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
        <TextInput
          label={t("usernameLabel")}
          placeholder={t("usernamePlaceholder")}
          required
          autoComplete="username"
          error={errors.username?.message}
          {...register("username", validation.username)}
          disabled={isLoading || isLocked}
        />

        <TextInput
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
          required
          isPassword
          type="password"
          autoComplete="current-password"
          toggleShowLabel={t("showPassword")}
          toggleHideLabel={t("hidePassword")}
          error={errors.password?.message}
          {...register("password", validation.password)}
          disabled={isLoading || isLocked}
        />

        {isLocked && (
          <p className={styles.lockout} role="status">
            {t("lockoutCountdown", { seconds: secondsLeft })}
          </p>
        )}

        <button
          type="submit"
          className={styles.submit}
          disabled={isLoading || isLocked}
        >
          {isLoading ? t("loggingIn") : t("loginButton")}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

