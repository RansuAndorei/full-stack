import styles from "../styles/Sort.module.css";
import { Color } from "../types";
type sortType = {
  text: string;
  sort: string;
  changeSort: (text: string) => void;
  filterData: (text: string) => void;
  theme: Color;
};

const Sort = ({ text, sort, changeSort, filterData, theme }: sortType) => {
  return (
    <div className={styles["sort-container"]}>
      <div className={`${styles["sort-text"]} text-${theme.textColor}`}>
        Sort by:
      </div>
      <div className={styles["sort-button-container"]}>
        <button
          type="button"
          className={`btn ${
            sort === "name"
              ? `btn-${theme.buttonColor}`
              : `btn-outline-${theme.buttonColor}`
          } ${styles["sort-button"]}`}
          onClick={() => changeSort("name")}
        >
          Name
        </button>
        <button
          type="button"
          className={`btn ${
            sort === "increasing"
              ? `btn-${theme.buttonColor}`
              : `btn-outline-${theme.buttonColor}`
          } ${styles["sort-button"]}`}
          onClick={() => changeSort("increasing")}
        >
          Ratings (Ascending)
        </button>
        <button
          type="button"
          className={`btn ${
            sort === "decreasing"
              ? `btn-${theme.buttonColor}`
              : `btn-outline-${theme.buttonColor}`
          } ${styles["sort-button"]}`}
          onClick={() => changeSort("decreasing")}
        >
          Ratings (Descending)
        </button>
      </div>
      <div className={styles["input-container"]}>
        <input
          id="name"
          type="text"
          value={text}
          onChange={(event) => filterData(event.target.value)}
          className="form-control"
          placeholder="Filter"
        />
      </div>
    </div>
  );
};

export default Sort;
