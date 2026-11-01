import { useEffect, useRef } from "react";
import { X, MapPin, Users, AlertTriangle, Inbox, Clock, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../../../shared/hooks/useLanguage.js";
import { formatDateTime } from "../../../../shared/utils/formatTime.js";
import { getGoogleMapsUrl } from "../../utils/googleMapsUrl.js";
import CooldownButton from "../../../../shared/components/CooldownButton";
import styles from "./GateDetailModal.module.scss";

export function GateDetailModal({
  gate,
  occupants = [],
  isLoading = false,
  error = null,
  onClose,
  triggerElement = null,
}) {
  const { language, t } = useLanguage();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElementRef = useRef(triggerElement || document.activeElement);

  const gateDisplayName = language === "en" ? gate?.nameEn || gate?.name : gate?.name;

  // Background scroll locking, focus management & keyboard navigation
  useEffect(() => {
    document.body.classList.add("modalOpen");

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const prevElement = previousActiveElementRef.current;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modalOpen");
      window.removeEventListener("keydown", handleKeyDown);
      if (prevElement && prevElement.focus) {
        prevElement.focus();
      }
    };
  }, [onClose]);

  if (!gate) return null;

  const handleOpenMaps = () => {
    const url = getGoogleMapsUrl(gate.location);
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-detail-modal-title"
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2 id="gate-detail-modal-title" className={styles.title}>
              {gateDisplayName}
            </h2>
            {gate.location?.address && (
              <p className={styles.address}>
                <MapPin size={14} className={styles.addressIcon} aria-hidden="true" />
                <span>{gate.location.address}</span>
              </p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label={t("closePanel")}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Fixed Controls / Summary Bar */}
        <div className={styles.summaryBar}>
          <div className={styles.countBadge}>
            <Users size={16} aria-hidden="true" />
            <span>{t("totalInsideCount", { count: occupants.length })}</span>
          </div>

          <CooldownButton
            onClick={handleOpenMaps}
            cooldownMs={5000}
            icon={<MapPin size={15} />}
            aria-label={t("openInGoogleMapsAria", { gate: gateDisplayName })}
          >
            {t("openInGoogleMaps")}
          </CooldownButton>
        </div>

        {/* Scrollable Occupants List Area */}
        <div className={styles.body}>
          {isLoading ? (
            <div className={styles.stateWrapper}>
              <span className={styles.spinner} aria-hidden="true" />
              <p className={styles.stateText}>{t("occupantsLoading")}</p>
            </div>
          ) : error ? (
            <div className={styles.stateWrapper} role="alert">
              <AlertTriangle size={24} className={styles.errorIcon} />
              <p className={styles.stateText}>{error || t("occupantsError")}</p>
            </div>
          ) : occupants.length === 0 ? (
            <div className={styles.stateWrapper}>
              <div className={styles.emptyIconCircle} aria-hidden="true">
                <Inbox size={28} />
              </div>
              <p className={styles.emptyTitle}>{t("emptyOccupantsMessage")}</p>
            </div>
          ) : (
            <ul className={styles.occupantsList} aria-label={t("gateOccupantsTitle")}>
              {occupants.map((person) => (
                <li key={person.id} className={styles.occupantItem}>
                  <div className={styles.occupantHeader}>
                    <span className={styles.personName}>{person.person}</span>
                  </div>

                  <div className={styles.occupantMeta}>
                    <span className={styles.metaField}>
                      <Clock size={13} aria-hidden="true" />
                      <span>{formatDateTime(person.entryTime, language)}</span>
                    </span>

                    {person.recordedBy && (
                      <span className={styles.metaField}>
                        <ShieldCheck size={13} aria-hidden="true" />
                        <span>{person.recordedBy}</span>
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default GateDetailModal;

