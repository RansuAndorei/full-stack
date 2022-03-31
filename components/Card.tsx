import styles from "../styles/Card.module.css";
import Image from "next/image";
import Link from "next/link";
import { Food, Movie, Color } from "../types";
import { db } from "../utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CardProp = {
  data: Food | Movie;
  theme: Color;
  getClickedImage: (text: string) => void;
  source: string;
  signedIn: boolean;
};

const Card = ({ data, theme, getClickedImage, source, signedIn }: CardProp) => {
  const ratingsFill = (star: number) => {
    let rating = "";
    for (let i = 0; i < star; i++) {
      rating += "★";
    }
    return rating;
  };

  const ratingsNoFill = (star: number) => {
    let rating = "";
    for (let i = 0; i < 5 - star; i++) {
      rating += "★";
    }
    return rating;
  };

  const deleteItem = () => {
    // const docRef = doc(db, `${source.toLowerCase}s`, data.id);
    // deleteDoc(docRef).then(() => {
    //   toast.success("🗑 Succesfully Deleted", {
    //     position: "bottom-center",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // });

    const text = `Do you really want to delete ${data.name}?`;
    if (confirm(text) == true) {
      const docRef = doc(db, `${source.toLowerCase()}s`, data.id);
      deleteDoc(docRef)
        .then(() => {
          toast.success(`${data.name} Succesfully Deleted`, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((err) => {
          toast.error(err.message, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  return (
    <div
      key={data.id}
      className={`shadow-lg mb-5 bg-${theme.divBackgroundColor} ${styles["card-container"]}`}
    >
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className={`${styles["image-container"]}`}>
        <Image
          src={data.image}
          alt={data.name}
          layout="fill"
          priority
          onClick={() => {
            getClickedImage(data.image);
          }}
          className={styles["card-image"]}
        />
      </div>

      <div
        className={`display-4 ${styles["card-title-container"]} bg-${theme.divBackgroundColor}`}
      >
        <span
          className={`text-${theme.textColor}`}
          data-testid="test-card-name"
        >
          <span className={`${styles["card-title-text"]}`}>{data.name} </span>
          {data.releaseDate ? (
            <span
              className={`${styles["card-release-date-text"]} ${styles["card-release-date-text"]}`}
            >{`(${data.releaseDate})`}</span>
          ) : null}
        </span>
      </div>

      <div
        className={`${styles["ratings-container"]} bg-${theme.divBackgroundColor}`}
      >
        <span className={styles["ratings-fill"]}>
          {ratingsFill(data.rating)}
        </span>
        <span className={styles["ratings-no-fill"]}>
          {ratingsNoFill(data.rating)}
        </span>
      </div>

      <div
        className={`${styles["description-container"]} bg-${theme.divBackgroundColor}`}
      >
        <span className={`text-${theme.textColor}`}>{data.description}</span>
      </div>

      <div
        className={`${styles["phone-number-container"]} bg-${theme.divBackgroundColor}`}
      >
        <span className={`text-${theme.textColor} text-center`}>
          {data.phoneNumber}
        </span>
      </div>

      {signedIn && (
        <div
          className={`${styles["button-container"]} bg-${theme.divBackgroundColor}`}
        >
          <Link href={`${source}/edit/${data.id}`} passHref>
            <button
              type="button"
              className={`btn ${`btn-warning`} ${styles["sort-button"]} ${
                styles["button"]
              }`}
            >
              ✎
            </button>
          </Link>
          <button
            type="button"
            className={`btn ${`btn-danger`} ${styles["sort-button"]} ${
              styles["button"]
            }`}
            onClick={deleteItem}
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
