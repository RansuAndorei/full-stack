import { render, screen } from "@testing-library/react";
import ImageView from "../components/ImageView";
import "@testing-library/jest-dom";

const mockCloseImage = jest.fn();
type ImageViewProp = {
  image: string;
  closeImage: () => void;
};

describe("Does it exist?", () => {
  const MyApp = ({ image, closeImage }: ImageViewProp) => {
    return <ImageView image={image} closeImage={closeImage} />;
  };

  beforeEach(() => {
    render(
      <MyApp image={"/static/images/adobo.jpg"} closeImage={mockCloseImage} />
    );
  });

  it("Renders the Image", () => {
    const image = screen.getByAltText("/static/images/adobo.jpg");
    expect(image).toBeInTheDocument();
  });
  it("Renders the Close Button", () => {
    const closeButton = screen.getByText("✘");
    expect(closeButton).toBeInTheDocument();
  });
});
