import styles from "../styles/Header.module.css";
import { Color } from "../types";
import { useState, useEffect } from "react";
import Link from "next/link";
type LayoutProps = {
  theme: Color;
};

const Header = ({ theme }: LayoutProps) => {
  const [colors, setColors] = useState(theme);

  useEffect(() => {
    setColors(theme);
  }, [theme]);

  return (
    <div className={`${styles.container} bg-${colors.backgroundColor}`}>
      <Link href={"/"} passHref={true} data-testid="home-link">
        <div className={styles.logo}>
          <a className={`text-${colors.textColor}`}>Hell Week</a>
        </div>
      </Link>
      <div className={styles["tab-container"]}>
        <Link href={"/Food"} passHref={true}>
          <div className={styles.tab} data-testid="food-link">
            <a className={`text-${colors.textColor}`}>Foods</a>
          </div>
        </Link>
        <Link href={"/Movie"} passHref={true}>
          <div className={styles.tab}>
            <a className={`text-${colors.textColor}`}>Movies</a>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
