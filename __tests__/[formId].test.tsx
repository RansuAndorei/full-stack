import { fireEvent, render, screen } from "@testing-library/react";
import Form from "../pages/form/[formId]";
import "@testing-library/jest-dom";
import type { NextPage } from "next";
import { act } from "react-dom/test-utils";

type FormType = {
  Component: NextPage;
  pageProps: object;
};

describe("Does it exist?", () => {
  const MyApp = ({ Component, pageProps }: FormType) => {
    return <Component {...pageProps} />;
  };

  beforeEach(() => {
    const props = { params: { formId: "Food" } };
    render(<MyApp Component={Form} pageProps={props} />);
  });

  const getText = (text: string) => {
    expect(screen.getByText(text)).toBeInTheDocument();
  };

  it("Renders the Title", () => {
    getText("Form for Food");
  });
  it("Renders the Name", () => {
    getText("Name");
  });
  it("Renders the Image Url", () => {
    getText("Image Url");
  });
  it("Renders the Description", () => {
    getText("Description");
  });
  it("Renders the Rating", () => {
    getText("Rating (1-5)");
  });
});

describe("Does it behave as expected", () => {
  const MyApp = ({ Component, pageProps }: FormType) => {
    return <Component {...pageProps} />;
  };

  const props = { params: { formId: "Food" } };

  const changeInput = (name: HTMLElement, text: string) => {
    fireEvent.change(name, { target: { value: text } });
    fireEvent.blur(name);
  };

  it("Check required error", async () => {
    const { container, getByTestId } = render(
      <MyApp Component={Form} pageProps={props} />
    );

    await act(async () => {
      const nameInput = getByTestId("input-name");
      const imageInput = getByTestId("input-image");
      const descriptionInput = getByTestId("input-description");
      const ratingInput = getByTestId("input-rating");

      changeInput(nameInput, "");
      changeInput(imageInput, "");
      changeInput(descriptionInput, "");
      changeInput(ratingInput, "");
    });
    expect(container.innerHTML).toMatch("* Name is required");
    expect(container.innerHTML).toMatch("* Image URL is required");
    expect(container.innerHTML).toMatch("* Description is required");
    expect(container.innerHTML).toMatch("* Rating is required");
  });

  it("Check Valid Image URL Error", async () => {
    const { container, getByTestId } = render(
      <MyApp Component={Form} pageProps={props} />
    );

    await act(async () => {
      const imageInput = getByTestId("input-image");
      changeInput(imageInput, "Invalid URL");
    });
    expect(container.innerHTML).toMatch("* Enter a valid URL");
  });

  it("Check URL is not from Unsplash Error", async () => {
    const { container, getByTestId } = render(
      <MyApp Component={Form} pageProps={props} />
    );

    await act(async () => {
      const imageInput = getByTestId("input-image");
      changeInput(
        imageInput,
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png"
      );
    });
    expect(container.innerHTML).toMatch("* Only Unsplash Images are available");
  });

  it("Check Rating beyond Range", async () => {
    const { container, getByTestId } = render(
      <MyApp Component={Form} pageProps={props} />
    );

    await act(async () => {
      const ratingInput = getByTestId("input-rating");
      changeInput(ratingInput, "0");
    });
    expect(container.innerHTML).toMatch("* Rating must be in range of 1-5");

    await act(async () => {
      const ratingInput = getByTestId("input-rating");
      changeInput(ratingInput, "6");
    });
    expect(container.innerHTML).toMatch("* Rating must be in range of 1-5");
  });

  it("Check Valid Input on Add Food", async () => {
    const { container, getByTestId } = render(
      <MyApp Component={Form} pageProps={props} />
    );

    await act(async () => {
      const nameInput = getByTestId("input-name");
      const imageInput = getByTestId("input-image");
      const descriptionInput = getByTestId("input-description");
      const ratingInput = getByTestId("input-rating");

      changeInput(nameInput, "Arroz Caldo");
      changeInput(
        imageInput,
        "https://images.unsplash.com/photo-1562967915-6ba607ff7d05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80"
      );
      changeInput(
        descriptionInput,
        "Frequently eaten at breakfast and merienda, arroz caldo is a rice porridge, taking its flavours from ginger, garlic, onions, and a tasty broth. Cuts of chicken and hard-boiled eggs are also added in and individual servings are finished off with fried garlic bits, chopped green onions, and a drizzle of kalamansi."
      );
      changeInput(ratingInput, "1");

      expect(container.innerHTML).not.toMatch("* Name is required");
      expect(container.innerHTML).not.toMatch("* Image URL is required");
      expect(container.innerHTML).not.toMatch("* Enter a valid URL");
      expect(container.innerHTML).not.toMatch(
        "* Only Unsplash Images are available"
      );
      expect(container.innerHTML).not.toMatch("* Description is required");
      expect(container.innerHTML).not.toMatch("* Rating is required");
      expect(container.innerHTML).not.toMatch(
        "* Rating must be in range of 1-5"
      );
    });
  });
});
