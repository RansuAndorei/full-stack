import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import "@testing-library/jest-dom";

const theme = {
  backgroundColor: "white",
  divBackgroundColor: "light",
  textColor: "black",
  buttonColor: "dark",
};

describe("Does it exist?", () => {
  beforeEach(() => {
    render(<Header theme={theme} />);
  });

  const getText = (text: string) => {
    expect(screen.getByText(text)).toBeInTheDocument();
  };

  it("Renders the Logo", () => {
    getText("Hell Week");
  });
  it("Renders the Food Tab", () => {
    getText("Foods");
  });
  it("Renders the Movie Tab", () => {
    getText("Movies");
  });
});

describe("Does it behave as expected?", () => {
  beforeEach(() => {
    render(<Header theme={theme} />);
  });

  it("Hell Week links to /", () => {
    expect(screen.getByText("Hell Week").closest("div")).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("Food Tab links to /Food", () => {
    expect(screen.getByText("Foods").closest("div")).toHaveAttribute(
      "href",
      "/Food"
    );
  });
  it("Movie Tab links to /Movie", () => {
    expect(screen.getByText("Movies").closest("div")).toHaveAttribute(
      "href",
      "/Movie"
    );
  });
});
