import { Users, LogIn, DoorOpen } from "lucide-react";
import Card from "../../../../shared/components/Card";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import styles from "./OccupancySummary.module.scss";

export function OccupancySummary({ gates = [] }) {
  const { t } = useLanguage();

  const totalInside = gates.reduce((acc, gate) => acc + (gate.inside || 0), 0);
  const totalEntriesToday = gates.reduce((acc, gate) => acc + (gate.entriesToday || 0), 0);
  const openGatesCount = gates.filter((gate) => gate.status === "open").length;
  const totalGates = gates.length;

  const statItems = [
    {
      id: "inside",
      label: t("summaryTotalInside"),
      value: totalInside,
      unit: t("peopleUnit"),
      icon: <Users size={22} />,
    },
    {
      id: "entries",
      label: t("summaryTotalEntries"),
      value: totalEntriesToday,
      unit: t("entriesUnit"),
      icon: <LogIn size={22} />,
    },
    {
      id: "open-gates",
      label: t("summaryOpenGates"),
      value: `${openGatesCount} / ${totalGates}`,
      unit: t("activeGatesUnit"),
      icon: <DoorOpen size={22} />,
    },
  ];

  return (
    <div className={styles.grid}>
      {statItems.map((item) => (
        <Card key={item.id}>
          <div className={styles.itemWrapper}>
            <div className={styles.iconContainer} aria-hidden="true">
              {item.icon}
            </div>
            <div className={styles.infoCol}>
              <span className={styles.label}>
                {item.label}
              </span>
              <div className={styles.valueRow}>
                <span className={styles.value}>
                  {item.value}
                </span>
                <span className={styles.unit}>
                  {item.unit}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default OccupancySummary;
