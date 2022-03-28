import styles from "../styles/Title.module.css";
import Image from "next/image";

type props = {
  title: string;
  backgroundImage: string;
};

const Title = (props: props) => {
  return (
    <div className={styles["welcome-container"]}>
      <Image
        src={props.backgroundImage}
        alt={"foodBg"}
        layout="fill"
        priority
      />
      <div className={styles["title-container"]}>
        <h1 className={`display-1 ${styles.title}`}>{props.title}</h1>
      </div>
    </div>
  );
};

export default Title;
