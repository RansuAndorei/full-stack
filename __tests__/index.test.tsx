import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";

describe("Home", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("Renders the Welcome Text", () => {
    const welcomeText = screen.getByRole("heading", {
      name: "Welcome to Hell Week",
    });
    expect(welcomeText).toBeInTheDocument();
  });
  it("Renders description", () => {
    const description = screen.getByText(
      /A 7 day period to help familiarize with the tools used internally./i
    );
    expect(description).toBeInTheDocument();
  });
});
