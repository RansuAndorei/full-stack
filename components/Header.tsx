import styles from "../styles/Header.module.css";
import { Color } from "../types";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

type LayoutProps = {
  theme: Color;
};

const Header = ({ theme }: LayoutProps) => {
  const [colors, setColors] = useState(theme);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [logout, setLogout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setColors(theme);
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setIsSignedIn(true);
        if (user.email !== null) {
          setEmail(user.email);
        }
      } else {
        setIsSignedIn(false);
      }
    });
  }, [theme]);

  const showLogout = () => {
    setLogout((prev) => !prev);
  };

  const logoutUser = () => {
    if (confirm("Do you want to logout? ") == true) {
      signOut(auth);
      router.push(`/`);
      setLogout(false);
    }
  };

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
      {isSignedIn ? (
        <div className={styles["tab-login"]} onClick={showLogout}>
          {theme.backgroundColor === "white" ? (
            <Image
              src={"/static/images/user.png"}
              height={30}
              width={30}
              alt={"login"}
            />
          ) : (
            <Image
              src={"/static/images/user2.png"}
              height={30}
              width={30}
              alt={"login"}
            />
          )}
        </div>
      ) : (
        <Link href={"/login"} passHref={true}>
          <div className={styles["tab-login"]}>
            {theme.backgroundColor === "white" ? (
              <Image
                src={"/static/images/login.png"}
                height={30}
                width={30}
                alt={"login"}
              />
            ) : (
              <Image
                src={"/static/images/login2.png"}
                height={30}
                width={30}
                alt={"login"}
              />
            )}
          </div>
        </Link>
      )}
      {logout && (
        <div
          className={`shadow-lg ${styles["logout-container"]} bg-${colors.backgroundColor}`}
        >
          <p className={`text-${colors.textColor}`}>{email}</p>
          <div className="dropdown-divider"></div>
          <div
            onClick={logoutUser}
            className={`drop-down-item ${styles["logout"]} text-${colors.textColor}`}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
