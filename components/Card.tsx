import styles from "../styles/Card.module.css";
import Image from "next/image";
import { Food, Movie, Color } from "../types";

type CardProp = {
  data: Food | Movie;
  theme: Color;
  getClickedImage: (text: string) => void;
};

const Card = ({ data, theme, getClickedImage }: CardProp) => {
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

  return (
    <div
      key={data.id}
      className={`shadow-lg mb-5 bg-${theme.divBackgroundColor} ${styles["card-container"]}`}
    >
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
    </div>
  );
};

export default Card;
