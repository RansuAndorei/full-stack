import type {
  NextPage,
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import React from "react";
import { useForm } from "react-hook-form";
import styles from "../../styles/Form.module.css";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../utils/firebase";

const FormPage: NextPage = ({
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const schema = Yup.object({
    name: Yup.string().required("* Name is required"),
    releaseDate: Yup.date().typeError("* Enter a valid Date"),
    image: Yup.string()
      .required("* Image URL is required")
      .url("* Enter a valid URL")
      .test(
        "checkURL",
        "* Only Unsplash, TMDB, and Firebase Images are available",
        (image = "") => {
          if (
            image.toLowerCase().includes("unsplash.com", 0) ||
            image.toLowerCase().includes("image.tmdb.org", 0) ||
            image.toLowerCase().includes("firebasestorage.googleapis.com", 0)
          ) {
            return true;
          } else {
            return false;
          }
        }
      ),
    description: Yup.string().required("* Description is required"),
    rating: Yup.number()
      .typeError("* Rating is required")
      .min(1, "* Rating must be in range of 1-5")
      .max(5, "* Rating must be in range of 1-5")
      .required("* Rating is required"),
    phoneNumber: Yup.string()
      .typeError("* Phone Number is required")
      .required("* Phone Number is required")
      .length(11, "* Enter a valid phone number")
      .test(
        "checkPhoneNumber",
        "* Enter a valid phone number",
        (phoneNumber = "") => {
          if (phoneNumber[0] === "0" && phoneNumber[1] === "9") {
            return true;
          } else {
            return false;
          }
        }
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur", resolver: yupResolver(schema) });

  const monthConverter = (date: string) => {
    switch (date) {
      case "Jan":
        return "01";
      case "Feb":
        return "02";
      case "Mar":
        return "03";
      case "Apr":
        return "04";
      case "May":
        return "05";
      case "Jun":
        return "06";
      case "Jul":
        return "07";
      case "Aug":
        return "08";
      case "Sep":
        return "09";
      case "Oct":
        return "10";
      case "Nov":
        return "11";
      case "Dec":
        return "12";
    }
  };

  const dateConverter = (date: string) => {
    return `${date.slice(11, 15)}-${monthConverter(
      date.slice(4, 7)
    )}-${date.slice(8, 10)}`;
  };

  const onSubmit = (data: { [x: string]: object }) => {
    const colRef = collection(db, `${params.formId.toLowerCase()}s`);

    addDoc(colRef, {
      description: data.description,
      rating: data.rating,
      name: data.name,
      image: data.image,
      phoneNumber: data.phoneNumber,
      releaseDate:
        params.formId === "Movie" ? dateConverter(`${data.releaseDate}`) : null,
      createdAt: serverTimestamp(),
    });

    reset({
      name: "",
      releaseDate: params.formId === "Food" ? undefined : null,
      image: "",
      description: "",
      rating: null,
      phoneNumber: "",
    });
    notify();
  };

  const notify = () => {
    const toastText = `${params.formId === "Movie" ? "🎥" : "🍽️"} ${
      params.formId
    } added to your ${params.formId} list`;
    toast.success(toastText, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className="display-1 text-center mb-5">Form for {params.formId}</h1>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group form-container mb-3">
          <label htmlFor="name" className="mb-1">
            Name
          </label>
          <input
            data-testid="input-name"
            className={`form-control ${errors.name?.message && "is-invalid"}`}
            {...register("name")}
          />
          <small className="form-text text-danger">
            {errors.name?.message}
          </small>
        </div>

        {params.formId === "Movie" ? (
          <div className="form-group form-container mb-3">
            <label htmlFor="name" className="mb-1">
              Release Date
            </label>
            <input
              type={"date"}
              data-testid="input-releaseDate"
              className={`form-control ${
                errors.releaseDate?.message && "is-invalid"
              }`}
              {...register("releaseDate")}
            />
            <small className="form-text text-danger">
              {errors.releaseDate?.message}
            </small>
          </div>
        ) : null}

        <div className="form-group form-container mb-3">
          <label htmlFor="image" className="mb-1">
            Image Url
          </label>
          <input
            data-testid="input-image"
            type="url"
            className={`form-control ${errors.image?.message && "is-invalid"}`}
            {...register("image")}
          />
          <small className="form-text text-danger">
            {errors.image?.message}
          </small>
        </div>

        <div className="form-group form-container mb-3">
          <label htmlFor="description" className="mb-1">
            Description
          </label>
          <input
            data-testid="input-description"
            className={`form-control ${
              errors.description?.message && "is-invalid"
            }`}
            {...register("description")}
          />
          <small className="form-text text-danger">
            {errors.description?.message}
          </small>
        </div>

        <div className="form-group form-container mb-3">
          <label htmlFor="rating" className="mb-1">
            Rating (1-5)
          </label>
          <input
            data-testid="input-rating"
            type="number"
            className={`form-control ${errors.rating?.message && "is-invalid"}`}
            {...register("rating")}
          />
          <small className="form-text text-danger">
            {errors.rating?.message}
          </small>
        </div>

        <div className="form-group form-container mb-3">
          <label htmlFor="rating" className="mb-1">
            Phone Number
          </label>
          <input
            data-testid="input-rating"
            type="text"
            className={`form-control ${
              errors.phoneNumber?.message && "is-invalid"
            }`}
            {...register("phoneNumber")}
          />
          <small className="form-text text-danger">
            {errors.phoneNumber?.message}
          </small>
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary w-25 mt-3">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;

  return {
    props: {
      params,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { formId: "Food" },
      },
      {
        params: { formId: "Movie" },
      },
    ],
    fallback: false,
  };
};
