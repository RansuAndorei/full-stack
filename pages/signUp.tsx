import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/SignUp.module.css";
import Layout from "../components/Layout";
import { lightTheme, darkTheme } from "../data/colors";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { db, auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";

const SignUp: NextPage = () => {
  const [color, setColors] = useState(lightTheme);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const changeTheme = () => {
    setColors((prev) => {
      if (prev === lightTheme) {
        return darkTheme;
      } else {
        return lightTheme;
      }
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const schema = Yup.object({
    fullName: Yup.string().required("* Full Name is required"),
    email: Yup.string()
      .required("* Email is required")
      .email("* Enter a valid email"),
    password: Yup.string()
      .required("* Password is required")
      .min(6, "* Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("* Confirm Password is required")
      .test(
        "checkPassword",
        "* Password doesn't Match",
        (confirmPassword = "") => {
          if (password === confirmPassword) {
            return true;
          } else {
            return false;
          }
        }
      ),
    terms: Yup.boolean().oneOf([true], "Message"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur", resolver: yupResolver(schema) });

  const router = useRouter();
  const onSubmit = (data: { [x: string]: object }) => {
    createUserWithEmailAndPassword(auth, `${data.email}`, `${data.password}`)
      .then((cred) => {
        setDoc(doc(db, "Viewer", cred.user.uid), {
          name: `${data.fullName}`,
          email: `${data.email}`,
        });
        router.push(`/`);
      })
      .catch((error) => {
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          notify("Email is already in use");
        }
        reset({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });
      });
  };

  const notify = (message: string) => {
    toast.warning(message, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  if (loading) {
    return (
      <div className={`${styles["loading-container"]}`}>
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Hell Week Activities"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout theme={color}>
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
        <div className={styles["toggle-button-container"]}>
          <button
            className={`btn btn-${color.buttonColor} ${styles["toggle-button"]}`}
            onClick={changeTheme}
          >
            {color === lightTheme ? "???" : "???"}
          </button>
        </div>

        <div
          className={`${styles["main-container"]} bg-${color.divBackgroundColor}`}
        >
          <section className={`h-100 ${styles["sign-up-container"]}`}>
            <div className={`container ${styles["test"]}`}>
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-lg-12 col-xl-11">
                  <div className={`card text-black ${styles["border-radius"]}`}>
                    <div className="card-body p-md-5">
                      <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                          <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                            Sign up
                          </p>
                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mx-1 mx-md-4"
                          >
                            <div className="d-flex flex-row align-items-center mb-4">
                              <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input
                                  type="text"
                                  id="form3Example1c"
                                  className={`form-control ${
                                    errors.fullName?.message && "is-invalid"
                                  }`}
                                  placeholder="Full Name"
                                  {...register("fullName")}
                                />
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-4">
                              <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input
                                  type="email"
                                  id="form3Example3c"
                                  className={`form-control ${
                                    errors.email?.message && "is-invalid"
                                  }`}
                                  placeholder="Email"
                                  {...register("email")}
                                />
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-4">
                              <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input
                                  type="password"
                                  id="form3Example4c"
                                  className={`form-control ${
                                    errors.password?.message && "is-invalid"
                                  }`}
                                  placeholder="Password"
                                  {...register("password")}
                                  onChange={(event) => {
                                    setPassword(event.target.value);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-4">
                              <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                              <div className="form-outline flex-fill mb-0">
                                <input
                                  type="password"
                                  id="form3Example4cd"
                                  className={`form-control ${
                                    errors.confirmPassword?.message &&
                                    "is-invalid"
                                  }`}
                                  placeholder="Confirm Password"
                                  {...register("confirmPassword")}
                                />
                              </div>
                            </div>

                            <div className="form-check d-flex justify-content-center mb-5">
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                value=""
                                id="form2Example3c"
                                {...register("terms")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="form2Example3"
                              >
                                I agree all statements in{" "}
                                <a href="#!">Terms of service</a>
                              </label>
                            </div>

                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                              <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                              >
                                Register
                              </button>
                            </div>

                            <div className="form-check d-flex justify-content-center mb-5">
                              <label
                                className="form-check-label"
                                htmlFor="form2Example3"
                              >
                                Already a member?{" "}
                                <Link href={"/login"}>
                                  <a href="#!" className="text-primary fw-bold">
                                    Login
                                  </a>
                                </Link>
                              </label>
                            </div>
                          </form>
                        </div>
                        <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                          <Image
                            src={"/static/images/signUpBg.webp"}
                            className="img-fluid"
                            alt="Sign Up Image"
                            objectFit="contain"
                            width={700}
                            height={500}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </div>
  );
};

export default SignUp;
