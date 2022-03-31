import type {
  NextPage,
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "../../../styles/Form.module.css";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../utils/firebase";
import { useRouter } from "next/router";

const FoodEdit: NextPage = ({
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

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

  const router = useRouter();
  const onSubmit = (data: { [x: string]: object }) => {
    const docRef = doc(db, `foods`, params.foodId);

    updateDoc(docRef, {
      description: data.description,
      rating: data.rating,
      name: data.name,
      image: data.image,
      phoneNumber: data.phoneNumber,
      releaseDate: null,
    })
      .then(() => {
        router.push(`/Food`);
        notify();
      })
      .catch((err) => {
        toast.error(err.message, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const notify = () => {
    toast.success("🍽️ Edited on your Food List", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const [name, setName] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });

    if (params !== undefined) {
      const docRef = doc(db, "foods", params.foodId);
      getDoc(docRef).then((doc) => {
        reset({
          name: doc?.data()?.name,
          releaseDate: undefined,
          image: doc?.data()?.image,
          description: doc?.data()?.description,
          rating: doc?.data()?.rating,
          phoneNumber: doc?.data()?.phoneNumber,
        });
        setName(doc?.data()?.name);
      });
      setLoading(false);
    }
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isSignedIn) {
    return (
      <div className={styles["invalid-page-container"]}>
        <div className="jumbotron ">
          <h1 className="display-4">Uh oh...</h1>
          <p className="lead">
            You need to login in order to access this page.
          </p>
          <hr className="my-4" />
          <p>
            Only the admin can perform Create, Update, and Delete operations.
          </p>
          <p className="lead mt-5 ">
            <Link href={"/login"} passHref>
              <a className="btn btn-primary btn-lg" href="#" role="button">
                Login
              </a>
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${styles["loading-container"]}`}>
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <h1 className="display-1 text-center mb-5">Form for {name}</h1>
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

          {/* {params.foodId === "Movie" ? (
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
          ) : null} */}

          <div className="form-group form-container mb-3">
            <label htmlFor="image" className="mb-1">
              Image Url
            </label>
            <input
              data-testid="input-image"
              type="url"
              className={`form-control ${
                errors.image?.message && "is-invalid"
              }`}
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
              className={`form-control ${
                errors.rating?.message && "is-invalid"
              }`}
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

          <div
            className={`d-flex justify-content-center ${styles["button-container"]}`}
          >
            <button type="submit" className="btn btn-primary w-25 mt-3">
              Submit
            </button>

            <Link href={"/Food"} passHref>
              <button className="btn btn-secondary w-25 mt-3">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
};

export default FoodEdit;

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;

  return {
    props: {
      params,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  //   const colRef = collection(db, "foods");

  //   let paths: Array<object> = [];
  //   await getDocs(colRef).then((snapshot) => {
  //     paths = snapshot.docs.map((doc) => {
  //       return {
  //         params: {
  //           foodId: doc.id,
  //         },
  //       };
  //     });
  //     console.log(paths);
  //   });

  const paths = [
    {
      params: { foodId: "00xAQphOsWkaYrSPQL3G" },
    },
  ];

  return {
    paths,
    fallback: true,
  };
};
