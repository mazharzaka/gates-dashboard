import { forwardRef } from "react";
import styles from "./Card.module.scss";

export const Card = forwardRef(function Card(
  { children, className = "", bordered = true, ...rest },
  ref
) {
  const cardClasses = [
    styles.card,
    bordered ? styles.bordered : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={cardClasses} {...rest}>
      {children}
    </div>
  );
});

export default Card;
