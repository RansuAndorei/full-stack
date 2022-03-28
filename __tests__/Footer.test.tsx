import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";
import "@testing-library/jest-dom";

const theme = {
  backgroundColor: "white",
  divBackgroundColor: "light",
  textColor: "black",
  buttonColor: "dark",
};

describe("Does it exist?", () => {
  it("Renders the Image", () => {
    render(<Footer theme={theme} />);
    const footer = screen.getByText(/All rights reserved 2022/i);
    expect(footer).toBeInTheDocument();
  });
});
