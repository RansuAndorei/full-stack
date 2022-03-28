import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import { lightTheme, darkTheme } from "../data/colors";

const Home: NextPage = () => {
  const [color, setColors] = useState(lightTheme);

  const changeTheme = () => {
    setColors((prev) => {
      if (prev === lightTheme) {
        return darkTheme;
      } else {
        return lightTheme;
      }
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <meta name="description" content="Hell Week Activities"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout theme={color}>
        <div className={styles["toggle-button-container"]}>
          <button
            className={`btn btn-${color.buttonColor} ${styles["toggle-button"]}`}
            onClick={changeTheme}
          >
            {color === lightTheme ? "☾" : "☼"}
          </button>
        </div>
        <div
          className={`${styles["index-container"]} bg-${color.backgroundColor}`}
        >
          <h1 className={`display-1 text-${color.textColor}`}>
            Welcome to Hell Week
          </h1>
          <p className={`lead text-${color.textColor}`}>
            A 7 day period to help familiarize with the tools used internally.
          </p>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
