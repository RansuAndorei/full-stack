import { render, screen } from "@testing-library/react";
import Title from "../components/Title";
import "@testing-library/jest-dom";

type props = {
  title: string;
  backgroundImage: string;
};

describe("Does it exist?", () => {
  const MyApp = ({ title, backgroundImage }: props) => {
    return <Title title={title} backgroundImage={backgroundImage} />;
  };

  beforeEach(() => {
    render(
      <MyApp
        title={"Welcome to my Favorite Dishes"}
        backgroundImage={"/static/images/foodBg.jpg"}
      />
    );
  });

  it("Renders the Title", () => {
    const title = screen.getByText(/Welcome to my Favorite Dishes/i);
    expect(title).toBeInTheDocument();
  });
  it("Renders the Background Image", () => {
    const backgroundImage = screen.getByAltText(/foodBg/i);
    expect(backgroundImage).toBeInTheDocument();
  });
});
