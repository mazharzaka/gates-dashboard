import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Shield, FileText, Users, RefreshCw, AlertCircle } from "lucide-react";
import DashboardHeader from "../../components/DashboardHeader";
import Tabs from "../../../../shared/components/Tabs";
import Button from "../../../../shared/components/Button";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import { formatTimeOnly } from "../../../../shared/utils/formatTime.js";
import { useAuth } from "../../../auth/context/AuthContext.jsx";
import { can } from "../../../auth/permissions.js";
import { useGates } from "../../../gates/hooks/useGates.js";
import { useGateOccupants } from "../../../gates/hooks/useGateOccupants.js";
import GateCard from "../../../gates/components/GateCard";
import GateDetailModal from "../../../gates/components/GateDetailModal";
import OccupancySummary from "../../../gates/components/OccupancySummary";
import AccessLogFilters from "../../../access-log/components/AccessLogFilters";
import AccessLogTable from "../../../access-log/components/AccessLogTable";
import { accessLogService } from "../../../access-log/services/accessLogService.js";
import AdminPage from "../../../admin/pages/AdminPage";
import styles from "./DashboardPage.module.scss";

const initialFilters = {
  search: "",
  gateId: "all",
  type: "all",
  dateFrom: "",
  dateTo: "",
};

export function DashboardPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  // Gates State (via hook)
  const {
    gates,
    isLoading: isGatesLoading,
    error: gatesError,
    lastUpdated,
    refresh: refreshGates,
  } = useGates();

  // Detail Modal State
  const [selectedGateId, setSelectedGateId] = useState(null);
  const [triggerElement, setTriggerElement] = useState(null);

  const selectedGate = gates.find((g) => g.id === selectedGateId) || null;
  const {
    occupants,
    isLoading: isOccupantsLoading,
    error: occupantsError,
  } = useGateOccupants(selectedGateId);

  // Access Log State
  const [filters, setFilters] = useState(initialFilters);
  const [logs, setLogs] = useState([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);

  // Fetch logs whenever filters or user change
  useEffect(() => {
    let isCancelled = false;

    accessLogService
      .getLogs(filters, user)
      .then((data) => {
        if (!isCancelled) {
          setLogs(data);
          setIsLogsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setLogs([]);
          setIsLogsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [filters, user]);

  const handleFilterChange = (field, value) => {
    setIsLogsLoading(true);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setIsLogsLoading(true);
    setFilters(initialFilters);
  };

  const handleOpenDetail = (gate, el) => {
    setSelectedGateId(gate.id);
    setTriggerElement(el);
  };

  const handleCloseDetail = () => {
    setSelectedGateId(null);
  };

  // Tab definitions
  const currentPath = location.pathname;
  if (currentPath === "/dashboard" || currentPath === "/dashboard/") {
    return <Navigate to="/dashboard/gates" replace />;
  }

  const isGatesTab = currentPath.includes("/gates");
  const isAdminTab = currentPath.includes("/admin");
  const isLogTab = currentPath.includes("/log");

  const canViewAdmin = can(user?.role, "viewAdminPage");

  // If user tries to access /admin directly without permission
  if (isAdminTab && !canViewAdmin) {
    return <Navigate to="/dashboard/gates" replace />;
  }

  const tabItems = [
    {
      id: "gates",
      label: t("tabGates"),
      to: "/dashboard/gates",
      icon: <Shield size={17} />,
      count: gates.length,
    },
    {
      id: "log",
      label: t("tabAccessLog"),
      to: "/dashboard/log",
      icon: <FileText size={17} />,
    },
    ...(canViewAdmin
      ? [
          {
            id: "admin",
            label: t("tabAdmin"),
            to: "/dashboard/admin",
            icon: <Users size={17} />,
          },
        ]
      : []),
  ];

  return (
    <div className={styles.page}>
      {/* Shell Header */}
      <DashboardHeader />

      {/* Main Container */}
      <main className={styles.main}>
        {/* Navigation Tabs */}
        <div className={styles.tabsContainer}>
          <Tabs items={tabItems} />
        </div>

        {/* Tab 1: Gates */}
        {isGatesTab && (
          <div>
            {/* Top Stat Summary */}
            <OccupancySummary gates={gates} />

            {/* Subheader: Live update indicator & manual refresh */}
            <div className={styles.liveBar}>
              <div className={styles.indicatorWrapper}>
                <span className={styles.pulseDot} aria-hidden="true" />
                <span className={styles.lastUpdatedText}>
                  {t("lastUpdated")}: {formatTimeOnly(lastUpdated, language)}
                </span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={refreshGates}
                isLoading={isGatesLoading}
                icon={<RefreshCw size={14} />}
              >
                {t("refreshGates")}
              </Button>
            </div>

            {/* Error Banner */}
            {gatesError && (
              <div role="alert" className={styles.errorBanner}>
                <AlertCircle size={18} />
                <span>{gatesError}</span>
              </div>
            )}

            {/* Gates Grid */}
            <div className={styles.gatesGrid}>
              {gates.map((gate) => (
                <GateCard
                  key={gate.id}
                  gate={gate}
                  onSelect={handleOpenDetail}
                />
              ))}
            </div>

            {/* Centered Detail Modal */}
            {selectedGate && (
              <GateDetailModal
                gate={selectedGate}
                occupants={occupants}
                isLoading={isOccupantsLoading}
                error={occupantsError}
                onClose={handleCloseDetail}
                triggerElement={triggerElement}
              />
            )}
          </div>
        )}

        {/* Tab 2: Access Log */}
        {isLogTab && (
          <div>
            {/* Filters Bar */}
            <AccessLogFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {/* Log Table with Pagination & CSV Export */}
            <AccessLogTable logs={logs} isLoading={isLogsLoading} />
          </div>
        )}

        {/* Tab 3: Admin */}
        {isAdminTab && canViewAdmin && <AdminPage />}
      </main>
    </div>
  );
}

export default DashboardPage;
