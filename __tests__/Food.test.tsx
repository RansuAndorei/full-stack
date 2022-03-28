import { fireEvent, render, screen } from "@testing-library/react";
import Food from "../pages/Food";
import "@testing-library/jest-dom";
import type { NextPage } from "next";
import data from "../data/favoriteFood";
import { Food as FoodType } from "../types";

type FormType = {
  Component: NextPage;
  pageProps: object;
};

const mockFoodGetStaticProps = () => {
  const FavoriteFoods: FoodType[] = [...data].sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );
  return FavoriteFoods;
};

describe("Does it exist?", () => {
  const MyApp = ({ Component, pageProps }: FormType) => {
    return <Component {...pageProps} />;
  };

  it("Renders the Add Food Button", () => {
    const favoriteFoods = mockFoodGetStaticProps();
    const props = { FavoriteFoods: favoriteFoods };
    render(<MyApp Component={Food} pageProps={props} />);
    expect(screen.getByText("Add Food")).toBeInTheDocument();
  });
});

const sortByName = (food: FoodType[]) => {
  const sorted: FoodType[] = [...food].sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );
  const names = sorted.map((food) => food.name);
  return names;
};

const sortAscending = (food: FoodType[]) => {
  const sorted = [...food].sort((a, b) => a.rating - b.rating);
  const names = sorted.map((food) => food.name);
  return names;
};

const sortDescending = (food: FoodType[]) => {
  const sorted = [...food].sort((a, b) => b.rating - a.rating);
  const names = sorted.map((food) => food.name);
  return names;
};

describe("Does it behave as expected", () => {
  const MyApp = ({ Component, pageProps }: FormType) => {
    return <Component {...pageProps} />;
  };

  beforeEach(() => {
    const favoriteFoods = mockFoodGetStaticProps();
    const props = { FavoriteFoods: favoriteFoods };
    render(<MyApp Component={Food} pageProps={props} />);
  });

  const buttonClick = (name: string) => {
    const buttonName = screen.getByRole("button", { name: name });
    fireEvent.click(buttonName);
    return screen.getAllByTestId("test-card-name");
  };

  it("Sort the Food Card by Name", () => {
    const cardList = buttonClick("Name");
    const cardListNames = cardList.map((card) => card.innerHTML);
    expect(cardListNames).toEqual(sortByName(data));
  });

  it("Sort the Food Card by Ratings (Ascending)", () => {
    const cardList = buttonClick("Ratings (Ascending)");
    const cardListNames = cardList.map((card) => card.innerHTML);
    expect(cardListNames).toEqual(sortAscending(mockFoodGetStaticProps()));
  });

  it("Sort the Food Card by Ratings (Descending)", () => {
    const cardList = buttonClick("Ratings (Descending)");
    const cardListNames = cardList.map((card) => card.innerHTML);
    expect(cardListNames).toEqual(sortDescending(mockFoodGetStaticProps()));
  });

  it("Filter Food", () => {
    const input = screen.getByPlaceholderText(/Filter/i);
    fireEvent.change(input, { target: { value: "ch" } });
    const cardList = screen.getAllByTestId("test-card-name");
    const cardListNames = cardList.map((card) => card.innerHTML);
    expect(cardListNames).toEqual([
      "Chicken Inasal",
      "Lechon",
      "Lechon Kawali",
    ]);
  });

  it("Empty List", () => {
    const input = screen.getByPlaceholderText(/Filter/i);
    fireEvent.change(input, { target: { value: "Salad" } });
    const emptyText = screen.getByText("No Food Found");
    expect(emptyText).toBeInTheDocument();
  });
});

it("Add Food", () => {
  const MyApp = ({ Component, pageProps }: FormType) => {
    return <Component {...pageProps} />;
  };
  const formData = {
    id: 11,
    description:
      "Frequently eaten at breakfast and merienda, arroz caldo is a rice porridge, taking its flavours from ginger, garlic, onions, and a tasty broth. Cuts of chicken and hard-boiled eggs are also added in and individual servings are finished off with fried garlic bits, chopped green onions, and a drizzle of kalamansi.",
    rating: "1",
    name: "Arroz Caldo",
    image:
      "https://images.unsplash.com/photo-1562967915-6ba607ff7d05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80",
  };
  const newFood = [];
  newFood.push(formData);
  sessionStorage.setItem("Food", JSON.stringify(newFood));

  const favoriteFoods = mockFoodGetStaticProps();
  const props = { FavoriteFoods: favoriteFoods };
  render(<MyApp Component={Food} pageProps={props} />);

  const cardList = screen.getAllByTestId("test-card-name");
  expect(cardList.length).toBe(11);
});
