import React from "react";
import styles from "../styles/Username.module.css";
import { resetPasswordValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPassword } from "../helper/helper";
import { useAuthStore } from "../store/store";
import { Navigate, useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";

const Reset = () => {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] =
    useFetch("createResetSession");

  // useEffect(() => {
  //   console.log(apiData);
  // },[]);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
      let resetPromise = resetPassword({ username, password: values.password });

      toast.promise(resetPromise, {
        loading: "Resetting Password...",
        success: <b>Reset Successfully!!</b>,
        error: <b>Could not reset the password !!</b>,
      });

      resetPromise.then(function () {
        return navigate("/password");
      });
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">{isLoading}</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  // if (status && (status !== 200 || status !== 201)) {
  //   return <Navigate to={"/password"} replace={true}></Navigate>;
  // }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} styles={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">
              Enter new Password here ..
            </span>
          </div>
          <form className="py-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="Password"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("confirm_password")}
                type="password"
                placeholder="Confirm Password"
                className={styles.textbox}
              />
              <button type="submit" className={styles.btn}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
