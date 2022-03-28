import { render, screen } from "@testing-library/react";
import Sort from "../components/Sort";
import "@testing-library/jest-dom";
import { Color } from ".././types";

type sortType = {
  text: string;
  sort: string;
  changeSort: (text: string) => void;
  filterFood: (text: string) => void;
  theme: Color;
};

const theme = {
  backgroundColor: "white",
  divBackgroundColor: "light",
  textColor: "black",
  buttonColor: "dark",
};

const mockChangeSort = jest.fn();
const mockFilterFood = jest.fn();

describe("Does it exist?", () => {
  const MyApp = ({ text, sort, changeSort, filterFood, theme }: sortType) => {
    return (
      <Sort
        text={text}
        sort={sort}
        changeSort={changeSort}
        filterData={filterFood}
        theme={theme}
      />
    );
  };

  beforeEach(() => {
    render(
      <MyApp
        text={""}
        sort={"Name"}
        changeSort={mockChangeSort}
        filterFood={mockFilterFood}
        theme={theme}
      />
    );
  });

  const checkButton = (name: string) => {
    const nameButton = screen.getByRole("button", { name: name });
    expect(nameButton).toBeInTheDocument();
  };

  it("Renders the Name Button", () => {
    checkButton("Name");
  });
  it("Renders the Ascending Button", () => {
    checkButton("Ratings (Ascending)");
  });
  it("Renders the Descending Button", () => {
    checkButton("Ratings (Descending)");
  });
  it("Checks the filter input", () => {
    const filter = screen.getByPlaceholderText(/Filter/i);
    expect(filter).toBeInTheDocument();
  });
});
