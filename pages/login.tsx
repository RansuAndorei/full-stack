import type { NextPage } from "next";
import { useState } from "react";
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
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const [color, setColors] = useState(lightTheme);

  const changeTheme = () => {
    setColors((prev) => {
      if (prev === lightTheme) {
        return darkTheme;
      } else {
        return lightTheme;
      }
    });
  };

  const schema = Yup.object({
    email: Yup.string()
      .required("* Email is required")
      .email("* Enter a valid email"),
    password: Yup.string()
      .required("* Password is required")
      .min(6, "* Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur", resolver: yupResolver(schema) });

  const router = useRouter();
  const onSubmit = (data: { [x: string]: object }) => {
    signInWithEmailAndPassword(auth, `${data.email}`, `${data.password}`)
      .then(() => {
        router.push(`/`);
      })
      .catch((err) => {
        if (err.message === "Firebase: Error (auth/user-not-found).") {
          notify("User not Found");
          reset({
            email: "",
            password: "",
          });
        } else if (err.message === "Firebase: Error (auth/wrong-password).") {
          notify("Invalid Password");
          reset({
            email: "",
            password: "",
          });
        } else {
          notify(err.message);
          reset({
            email: "",
            password: "",
          });
        }
      });
  };

  const notify = (message: string) => {
    toast.error(message, {
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
      <Head>
        <title>Login</title>
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
            {color === lightTheme ? "☾" : "☼"}
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
                            Login
                          </p>
                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mx-1 mx-md-4"
                          >
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
                                <small className="form-text text-danger">
                                  {errors.email?.message}
                                </small>
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
                                />
                                <small className="form-text text-danger">
                                  {errors.password?.message}
                                </small>
                              </div>
                            </div>

                            <div className="form-check d-flex justify-content-center mb-5">
                              <label
                                className="form-check-label"
                                htmlFor="form2Example3"
                              >
                                By logging in you agree on all statements in{" "}
                                <a href="#!">Terms of service</a>
                              </label>
                            </div>

                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                              <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                              >
                                Login
                              </button>
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

export default Login;
