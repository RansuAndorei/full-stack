import { render, screen } from "@testing-library/react";
import Card from "../components/Card";
import "@testing-library/jest-dom";
import { Food, Color } from ".././types";

type CardProp = {
  data: Food;
  theme: Color;
  getClickedImage: (text: string) => void;
};
const mockGetClickedImage = jest.fn();
const data = {
  id: 1,
  name: "Adobo",
  description:
    "It’s the Filipino dish everybody knows — the mighty adobo. It is made by stewing meat (usually chicken, pork, or a combination of both) in soy sauce and vinegar, adding peppercorns and bay leaves for that special flavour. Bonus leftovers tip: pull the meat from the bone and fry ’til crispy for some tasty adobo flakes.",
  rating: 5,
  image: "/static/images/adobo.jpg",
  phoneNumber: "09358171232",
  releaseDate: null,
};
const theme = {
  backgroundColor: "white",
  divBackgroundColor: "light",
  textColor: "black",
  buttonColor: "dark",
};

describe("Does it exist?", () => {
  const MyApp = ({ data, theme, getClickedImage }: CardProp) => {
    return <Card data={data} theme={theme} getClickedImage={getClickedImage} />;
  };

  beforeEach(() => {
    render(
      <MyApp data={data} theme={theme} getClickedImage={mockGetClickedImage} />
    );
  });

  const getText = (text: string) => {
    expect(screen.getByText(text)).toBeInTheDocument();
  };

  it("Renders the Title", () => {
    getText(data.name);
  });
  it("Renders the Description", () => {
    getText(data.description);
  });
  it("Renders the Image", () => {
    const image = screen.getByAltText(data.name);
    expect(image).toBeInTheDocument;
  });
});
