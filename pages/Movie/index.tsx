import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../../styles/MainTabs.module.css";
import Title from "../../components/Title";
import Card from "../../components/Card";
import Sort from "../../components/Sort";
import Layout from "../../components/Layout";
import ImageView from "../../components/ImageView";
import { Movie } from "../../types";
import { lightTheme, darkTheme } from "../../data/colors";
import Link from "next/link";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../utils/firebase";

const Movie: NextPage = () => {
  const [listOfMovies, setListOfMovies] = useState<Array<Movie>>([]);
  const [sortedMovies, setSortedMovies] = useState<Array<Movie>>([]);
  const [text, setText] = useState("");
  const [sort, setSort] = useState("name");
  const [color, setColors] = useState(lightTheme);
  const [showImage, setShowImage] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    const colRef = collection(db, "movies");
    const queryFood = query(colRef, orderBy("createdAt", "desc"));
    const snap = onSnapshot(queryFood, (snapshot) => {
      const movies: Array<Movie> = [];
      snapshot.docs.forEach((doc) => {
        const fPhoneNumber = `(${doc.data().phoneNumber.slice(0, 4)}) ${doc
          .data()
          .phoneNumber.slice(4, 7)} - ${doc.data().phoneNumber.slice(7, 12)}`;

        movies.push({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          rating: doc.data().rating,
          phoneNumber: fPhoneNumber,
          releaseDate: doc.data().releaseDate,
          image: doc.data().image,
          createdAt: doc.data().createdAt,
        });
      });
      setListOfMovies(movies);
      setSortedMovies(movies);
    });

    return () => {
      // cancel the subscription
      snap();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const changeSort = (type: string) => {
    setSort(type);
    setSortedMovies((prev: Movie[]) => {
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

  const filterMovie = (text: string) => {
    setText(text);
    setSortedMovies(() => {
      const tempMovies = listOfMovies.filter((movie: Movie) => {
        if (movie.name.toLowerCase().includes(text, 0)) {
          return movie;
        }
      });
      return tempMovies;
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
        <title>Favorite Movie</title>
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
          title="Welcome to my Favorite Movies"
          backgroundImage="/static/images/movieBg.jpg"
        />
        <div
          className={`${styles["main-container"]} bg-${color.backgroundColor}`}
        >
          <Sort
            text={text}
            sort={sort}
            filterData={filterMovie}
            changeSort={changeSort}
            theme={color}
          />
          <div className={styles["add-container"]}>
            <Link href={"/form/Movie"}>
              <a className="btn btn-success w-50">Add Movie</a>
            </Link>
          </div>
          <div className={`${styles["cards-container"]}`}>
            {sortedMovies.map((movie: Movie) => {
              return (
                <Card
                  key={movie.id}
                  data={movie}
                  theme={color}
                  getClickedImage={getClickedImage}
                  source={"Movie"}
                />
              );
            })}
            {sortedMovies.length === 0 && (
              <span className={`display-5 m-10 text-${color.textColor}`}>
                No Movie Found
              </span>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Movie;
