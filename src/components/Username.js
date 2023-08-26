import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assests/avatar2.jpg";
import styles from "../styles/Username.module.css";
import { usernameValidate } from "../helper/validate";

// formik library for validation
// Toaster for error and success msgs..
// npm install formik react-hot-toast
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";

import { useAuthStore } from "../store/store";

const Username = () => {

  const navigate = useNavigate();

  const setUsername = useAuthStore((state) => state.setUsername);
  // const username = useAuthStore((state) => state.auth.username);

  // useEffect(()=>{
  //   console.log(username);
  // })

  // useformik is a hook..
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false, // validate only on submit button
    onSubmit: async (values) => {
      // console.log(values);
      setUsername(values.username);
      navigate('/password');
    },
  }); // specify this to below mentioned form

  // npm i @babel/plugin-proposal-private-property-in-object -D

  return (
    <div className="container mx-auto">
      {/* to get the toaster message .. */}
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello Again!</h4>
            {/* w-3/4 means that 3 parts of 4 parts */}
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            {" "}
            {/* formik submission */}
            <div className="profile flex justify-center py-4">
              <img src={avatar} alt="avatar" className={styles.profile_img} />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                // formik will get the data from here ..
                {...formik.getFieldProps("username")}
                type="text"
                placeholder="Username"
                className={styles.textbox}
              />
              <button type="submit" className={styles.btn}>
                Let's Go
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a Member ?
                <Link className="text-red-500 ml-1 font-bold" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Username;
