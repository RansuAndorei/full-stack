import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../../styles/MainTabs.module.css";
import Title from "../../components/Title";
import Card from "../../components/Card";
import Sort from "../../components/Sort";
import Layout from "../../components/Layout";
import ImageView from "../../components/ImageView";
import { Food } from "../../types";
import { lightTheme, darkTheme } from "../../data/colors";
import Link from "next/link";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, auth } from "../../utils/firebase";

const Food: NextPage = () => {
  const [listOfFoods, setListOfFoods] = useState<Array<Food>>([]);
  const [sortedFoods, setSortedFoods] = useState<Array<Food>>([]);
  const [text, setText] = useState("");
  const [sort, setSort] = useState("name");
  const [color, setColors] = useState(lightTheme);
  const [showImage, setShowImage] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
    const colRef = collection(db, "foods");
    const queryFood = query(colRef, orderBy("createdAt", "desc"));
    const snap = onSnapshot(queryFood, (snapshot) => {
      const foods: Array<Food> = [];
      snapshot.docs.forEach((doc) => {
        const fPhoneNumber = `(${doc.data().phoneNumber.slice(0, 4)}) ${doc
          .data()
          .phoneNumber.slice(4, 7)} - ${doc.data().phoneNumber.slice(7, 12)}`;

        foods.push({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          rating: doc.data().rating,
          phoneNumber: fPhoneNumber,
          releaseDate: doc.data().releaseDate,
          image: doc.data().image,
          createdAt: doc.data().createdAt,
        });
        // console.log(
        //   new Date(
        //     doc.data().createdAt.seconds * 1000 +
        //       doc.data().createdAt.nanoseconds / 1000000
        //   )
        // );
      });
      // const d = new Date();
      // d.setDate(d.getDate() - 5);
      // console.log("CURRENT DATE", new Date(d));
      setListOfFoods(foods);
      setSortedFoods(foods);
    });

    return () => {
      // cancel the subscription
      snap();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const changeSort = (type: string) => {
    setSort(type);

    setSortedFoods((prev: Array<Food>) => {
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
          return [];
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
          {isSignedIn && (
            <div className={styles["add-container"]}>
              <Link href={"/form/Food"}>
                <a className="btn btn-success w-50">Add Food</a>
              </Link>
            </div>
          )}

          <div className={`${styles["cards-container"]}`}>
            {sortedFoods.map((food: Food) => {
              return (
                <Card
                  key={food.id}
                  data={food}
                  theme={color}
                  getClickedImage={getClickedImage}
                  source={"Food"}
                  signedIn={isSignedIn}
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

export default Food;
