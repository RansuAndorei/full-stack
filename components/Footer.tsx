import styles from "../styles/Footer.module.css";
import { Color } from "../types";
import { useState, useEffect } from "react";
type LayoutProps = {
  theme: Color;
};

const Footer = ({ theme }: LayoutProps) => {
  const [colors, setColors] = useState(theme);

  useEffect(() => {
    setColors(theme);
  }, [theme]);

  return (
    <div className={`${styles.container} bg-${colors.textColor}`}>
      <span
        className={`${styles["footer-text"]} text-${colors.backgroundColor}`}
      >
        All rights reserved 2022
      </span>
    </div>
  );
};

export default Footer;
