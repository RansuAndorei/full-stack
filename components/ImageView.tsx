import styles from "../styles/ImageView.module.css";
import Image from "next/image";

type Param = {
  closeImage: () => void;
  image: string;
};

const ImageView = ({ closeImage, image }: Param) => {
  return (
    <>
      <div className={styles.container}>
        <div className={`${styles["image-container"]}`}>
          <Image src={image} layout="fill" alt={image} />
        </div>
      </div>
      <div className={styles["close-button-container"]}>
        <button
          className={`btn btn-light ${styles["close-button"]}`}
          onClick={closeImage}
        >
          ✘
        </button>
      </div>
    </>
  );
};

export default ImageView;
