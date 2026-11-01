import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import LanguageToggle from "../../../../shared/components/LanguageToggle";
import BrandLogo from "../../../../shared/components/BrandLogo";
import LoginForm from "../../components/LoginForm";
import AuthIllustration from "../../components/AuthIllustration";
import styles from "./LoginPage.module.scss";

export function LoginPage() {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // If already logged in, redirect away from login
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  return (
    <div className={styles.page}>
      {/* Top Utility Bar */}
      <header className={styles.header}>
        <div className={styles.brandWrapper}>
          <div className={styles.brand}>
            <BrandLogo variant="default" className={styles.headerLogo} />
            <span>{t("brandName")}</span>
          </div>

          <span className={styles.divider} aria-hidden="true" />

          <button
            type="button"
            onClick={() => { }}
            className={styles.switchButton}
          >
            {t("switchLink")}
          </button>
        </div>

        {/* Language toggle on end side */}
        <LanguageToggle />
      </header>

      {/* Main Content: Two-column layout on desktop, form first on mobile */}
      <main className={styles.main}>
        <div className={styles.cardContainer}>
          <div className={styles.illustrationCol}>
            <AuthIllustration />
          </div>
          <div className={styles.formCol}>
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
