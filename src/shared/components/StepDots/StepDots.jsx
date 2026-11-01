import { useLanguage } from "../../hooks/useLanguage.js";
import styles from "./StepDots.module.scss";

/**
 * StepDots indicator
 * Displays 3 short bars/dots with active step highlighted in primary color
 */
export function StepDots({ totalSteps = 3, currentStep = 1, className = "" }) {
  const { t } = useLanguage();

  return (
    <div
      role="progressbar"
      aria-label={t("stepIndicator", { step: currentStep })}
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      className={`${styles.container} ${className}`.trim()}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        const dotClasses = [
          styles.dot,
          isActive ? styles.active : "",
          isCompleted ? styles.completed : "",
        ].filter(Boolean).join(" ");

        return (
          <span
            key={stepNum}
            className={dotClasses}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export default StepDots;

