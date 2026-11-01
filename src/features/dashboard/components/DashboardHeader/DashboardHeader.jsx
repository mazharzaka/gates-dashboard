import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../../../auth/context/AuthContext.jsx";
import { can } from "../../../auth/permissions.js";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import BrandLogo from "../../../../shared/components/BrandLogo";
import LanguageToggle from "../../../../shared/components/LanguageToggle";
import Badge from "../../../../shared/components/Badge";
import Button from "../../../../shared/components/Button";
import styles from "./DashboardHeader.module.scss";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();

  const userDisplayName = language === "ar" ? user?.nameAr || user?.name : user?.name;
  const isAdmin = can(user?.role, "viewAdminPage");
  const roleLabel = isAdmin ? t("roleBadgeAdmin") : t("roleBadgeGuard");
  const roleVariant = isAdmin ? "primary" : "neutral";

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand / Logo */}
        <div className={styles.brandGroup}>
          <div className={styles.logoDefault}>
            <BrandLogo variant="default" className={styles.headerLogo} />
          </div>
          <div className={styles.logoMark}>
            <BrandLogo variant="mark" className={styles.headerMark} />
          </div>
          <div>
            <span className={styles.brandName}>
              {t("brandName")}
            </span>
          </div>
        </div>

        {/* User Info, Language, Logout */}
        <div className={styles.userActions}>
          {/* User profile capsule */}
          <div className={styles.profileCapsule}>
            <div className={styles.avatar}>
              <UserIcon size={16} />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {userDisplayName}
              </span>
              <Badge variant={roleVariant} size="sm">
                {roleLabel}
              </Badge>
            </div>
          </div>

          {/* Language Toggle */}
          <LanguageToggle />

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            icon={<LogOut size={16} />}
            ariaLabel={t("logout")}
          >
            {t("logout")}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
