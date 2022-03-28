import type { NextPage, InferGetStaticPropsType, GetStaticProps } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/MainTabs.module.css";
import Title from "../components/Title";
import Card from "../components/Card";
import Sort from "../components/Sort";
import Layout from "../components/Layout";
import ImageView from "../components/ImageView";
import { Movie } from "../types";
import { lightTheme, darkTheme } from "../data/colors";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Movie: NextPage = ({
  FavoriteMovies,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [listOfMovies, setListOfMovies] = useState(FavoriteMovies);
  const [sortedMovies, setSortedMovies] = useState(FavoriteMovies);
  const [text, setText] = useState("");
  const [sort, setSort] = useState("name");
  const [color, setColors] = useState(lightTheme);
  const [showImage, setShowImage] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    const newMovie = sessionStorage.getItem("Movie");
    if (newMovie !== null) {
      const parsedNewMovie = JSON.parse(newMovie).reverse();
      parsedNewMovie.forEach((movie: Movie, index: number) => {
        parsedNewMovie[index].phoneNumber = `(${movie.phoneNumber.slice(
          0,
          4
        )}) ${movie.phoneNumber.slice(4, 7)} - ${movie.phoneNumber.slice(
          7,
          12
        )}`;
        parsedNewMovie[index].releaseDate = `${movie.releaseDate
          .toString()
          .slice(0, 10)}`;
      });
      const newSorted = [...parsedNewMovie, ...sortedMovies];
      setSortedMovies(newSorted);
      setListOfMovies(newSorted);
      notify();
    }
  }, []);

  const notify = () =>
    toast.success("🎥 Movie added to your Movie list", {
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
          return 0;
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

export const getStaticProps: GetStaticProps = async () => {
  // const page = Math.floor(Math.random() * 500) + 1;
  const page = 1;
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.movieAPIKey}&language=en-US&page=${page}&adult=false`
  );
  const posts = await res.json();

  const FavoriteMovies = [];
  let max = 10;
  for (let i = 0; i < max; i++) {
    if (
      posts.results[i].backdrop_path !== null &&
      posts.results[i].overview !== ""
    ) {
      const phoneNumber = `0${
        Math.floor(Math.random() * 99999999) + 900000000
      }`;
      const formattedPhoneNumber = `(${phoneNumber.slice(
        0,
        4
      )}) ${phoneNumber.slice(4, 7)} - ${phoneNumber.slice(7, 12)}`;
      FavoriteMovies.push({
        id: posts.results[i].id,
        name: posts.results[i].title,
        description: posts.results[i].overview,
        rating: Math.round(posts.results[i].vote_average / 2),
        image: `https://image.tmdb.org/t/p/original${posts.results[i].backdrop_path}`,
        phoneNumber: formattedPhoneNumber,
        releaseDate: posts.results[i].release_date,
      });
    } else {
      max += 1;
    }
  }

  const sortedFavoriteMovies = FavoriteMovies.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );

  return {
    props: {
      FavoriteMovies: sortedFavoriteMovies,
    },
  };
};

export default Movie;
