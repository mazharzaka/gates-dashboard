import { Link, useLocation } from "react-router-dom";
import styles from "./Tabs.module.scss";

/**
 * Tabs component
 * Can be used with router links (items have `to` property) or callback (items have `id` & `onClick`)
 *
 * @param {Array<{ id: string, label: string, to?: string, count?: number, icon?: React.ReactNode }>} items
 * @param {string} activeTab
 * @param {Function} onTabChange
 */
export function Tabs({ items = [], activeTab, onTabChange, className = "" }) {
  const location = useLocation();

  return (
    <nav
      role="tablist"
      aria-label="Dashboard Navigation"
      className={`${styles.nav} ${className}`.trim()}
    >
      {items.map((item) => {
        const isActive = item.to
          ? location.pathname === item.to
          : activeTab === item.id;

        const tabClasses = [
          styles.tab,
          isActive ? styles.active : "",
        ].filter(Boolean).join(" ");

        const content = (
          <>
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={`${styles.countBadge} ${
                  isActive ? styles.countBadgeActive : ""
                }`.trim()}
              >
                {item.count}
              </span>
            )}
          </>
        );

        if (item.to) {
          return (
            <Link
              key={item.id}
              to={item.to}
              role="tab"
              aria-selected={isActive}
              className={tabClasses}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange && onTabChange(item.id)}
            className={tabClasses}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}

export default Tabs;

