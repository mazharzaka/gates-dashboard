import { useRef } from "react";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import styles from "./GateCard.module.scss";

export function GateCard({ gate, onSelect }) {
  const { language } = useLanguage();
  const cardRef = useRef(null);

  const gateDisplayName = language === "en" ? gate?.nameEn || gate?.name : gate?.name;

  const handleClick = () => {
    if (onSelect) {
      onSelect(gate, cardRef.current);
    }
  };

  return (
    <button
      ref={cardRef}
      id={`gate-card-${gate.id}`}
      type="button"
      className={styles.cardButton}
      onClick={handleClick}
      aria-label={gateDisplayName}
    >
      <span className={styles.gateName}>{gateDisplayName}</span>
    </button>
  );
}

export default GateCard;
