import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assests/avatar2.jpg";
import styles from "../styles/Username.module.css";
import { passwordValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { generateOTP, verifyPassword } from "../helper/helper";

// custom hook to fetch the backend data
import useFetch from "../hooks/fetch.hook";

// for accessing the username
import { useAuthStore } from "../store/store";

export default function Password() {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();

  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
      let loginPromise = verifyPassword({
        username,
        password: values.password,
      });
      toast.promise(loginPromise, {
        loading: "Verifying...",
        success: <b>Logged Successfully !</b>,
        error: <b>Password not matched !</b>,
      });

      loginPromise.then((res) => {
        let { token } = res.data;
        console.log(token);
        localStorage.setItem("token", token);
        navigate("/profile");
      });
    },
  });

  const initiateOtp = () => {
    console.log("finally..");
    let sendPromise = generateOTP(username);
    console.log(sendPromise);
    toast.promise(sendPromise, {
      loading: "Sending...",
      success: <b>OTP Sent Successfully!!</b>,
      error: <b>Could not send it..</b>,
    });

    sendPromise.then((OTP) => {
      console.log(OTP);
    });
  };

  if (isLoading) return <h1 className="text-2xl font-bold">{isLoading}</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      {/* to get the toaster message .. */}
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">
              Hello {apiData?.firstname || apiData?.username}
              {console.log(apiData)}
            </h4>
            {/* w-3/4 means that 3 parts of 4 parts */}
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            {" "}
            {/* formik submission */}
            <div className="profile flex justify-center py-4">
              <img
                src={apiData?.profile || avatar}
                alt="avatar"
                className={styles.profile_img}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                // formik will get the data from here ..
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="Password"
                className={styles.textbox}
              />
              <button type="submit" className={styles.btn}>
                Sign In
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot Password ?
                <Link
                  className="text-red-500 ml-1 font-bold"
                  to="/recovery"
                  onClick={initiateOtp}
                >
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// export default Password;
