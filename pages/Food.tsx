import type { NextPage, InferGetStaticPropsType, GetStaticProps } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/MainTabs.module.css";
import data from "../data/favoriteFood";
import Title from "../components/Title";
import Card from "../components/Card";
import Sort from "../components/Sort";
import Layout from "../components/Layout";
import ImageView from "../components/ImageView";
import { Food } from "../types";
import { lightTheme, darkTheme } from "../data/colors";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Food: NextPage = ({
  FavoriteFoods,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [listOfFoods, setListOfFoods] = useState(FavoriteFoods);
  const [sortedFoods, setSortedFoods] = useState(FavoriteFoods);
  const [text, setText] = useState("");
  const [sort, setSort] = useState("name");
  const [color, setColors] = useState(lightTheme);
  const [showImage, setShowImage] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    const newFood = sessionStorage.getItem("Food");
    if (newFood !== null) {
      const parsedNewFood = JSON.parse(newFood).reverse();
      parsedNewFood.forEach((food: Food, index: number) => {
        parsedNewFood[index].phoneNumber = `(${food.phoneNumber.slice(
          0,
          4
        )}) ${food.phoneNumber.slice(4, 7)} - ${food.phoneNumber.slice(7, 12)}`;
      });
      const newSorted = [...parsedNewFood, ...sortedFoods];
      setSortedFoods(newSorted);
      setListOfFoods(newSorted);
      notify();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const notify = () =>
    toast.success("🍽️ Food added to your Food list", {
      position: "bottom-center",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const changeSort = (type: string) => {
    setSort(type);
    setSortedFoods((prev: Food[]) => {
      switch (type) {
        case "name":
          return prev.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
        case "increasing":
          return prev.sort((a, b) => a.rating - b.rating);
        case "decreasing":
          return prev.sort((a, b) => b.rating - a.rating);
        default:
          return 0;
      }
    });
  };

  const filterFood = (text: string) => {
    setText(text);
    setSortedFoods(() => {
      const tempFoods = listOfFoods.filter((food: Food) => {
        if (food.name.toLowerCase().includes(text, 0)) {
          return food;
        }
      });
      return tempFoods;
    });
    changeSort(sort);
  };

  const changeTheme = () => {
    setColors((prev) => {
      if (prev === lightTheme) {
        return darkTheme;
      } else {
        return lightTheme;
      }
    });
  };

  const getClickedImage = (image: string) => {
    setModalImage(image);
    setShowImage(true);
  };

  const closeImage = () => {
    setShowImage(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Favorite Food</title>
        <meta name="description" content="Hell Week Activities"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout theme={color}>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className={styles["toggle-button-container"]}>
          <button
            className={`btn btn-${color.buttonColor} ${styles["toggle-button"]}`}
            onClick={changeTheme}
          >
            {color === lightTheme ? "☾" : "☼"}
          </button>
        </div>
        {showImage && <ImageView closeImage={closeImage} image={modalImage} />}
        <Title
          title="Welcome to my Favorite Dishes"
          backgroundImage="/static/images/foodBg.jpg"
        />
        <div
          className={`${styles["main-container"]} bg-${color.backgroundColor}`}
        >
          <Sort
            text={text}
            sort={sort}
            filterData={filterFood}
            changeSort={changeSort}
            theme={color}
          />
          <div className={styles["add-container"]}>
            <Link href={"/form/Food"}>
              <a className="btn btn-success w-50">Add Food</a>
            </Link>
          </div>
          <div className={`${styles["cards-container"]}`}>
            {sortedFoods.map((food: Food) => {
              return (
                <Card
                  key={food.id}
                  data={food}
                  theme={color}
                  getClickedImage={getClickedImage}
                />
              );
            })}
            {sortedFoods.length === 0 && (
              <span className={`display-5 m-10 text-${color.textColor}`}>
                No Food Found
              </span>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const FavoriteFoods: Food[] = [...data].sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );

  if (FavoriteFoods[0].phoneNumber.length === 11) {
    FavoriteFoods.forEach((food, index) => {
      FavoriteFoods[index].phoneNumber = `(${food.phoneNumber.slice(
        0,
        4
      )}) ${food.phoneNumber.slice(4, 7)} - ${food.phoneNumber.slice(7, 12)}`;
    });
  }

  return {
    props: {
      FavoriteFoods,
    },
  };
};

export default Food;
