import React, { useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../assests/avatar2.jpg";
import styles from "../styles/Username.module.css";
import { registerFormValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import convertToBase64 from "../helper/convert";
import { registerUser } from "../helper/helper";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [file, setFile] = useState("");

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerFormValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // when we are hitting the submit button so we are adding the one more property to the formik values above ..
      values = await Object.assign(values, { profile: file || "" });
      console.log(values);
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "registering...",
        success: <b>Registration Successfully..!</b>,
        error: (
          <b>
            Register failed have smaller pic profile..
            {console.log("Register failed have smaller pic profile")}
          </b>
        ),
      });

      registerPromise.then(function () {
        navigate("/");
      });
    },
  });

  // formik does not supprt for the file upload so we need to create this handle ..

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    const object_url = URL.createObjectURL(e.target.files[0]);
    console.log(`Object Url- ${object_url}`);
    console.log(e.target.files[0]?.type);
    // const object_u = ()=>URL.revokeObjectURL(object_url);
    // console.log(`Roveoke Url - ${object_u}`);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register here !</h4>
            <span className="py-1 text-xl w-3/4 text-center text-gray-500">
              Happy to join you!
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  alt="avatar"
                  className={styles.profile_img}
                />
              </label>
              <input
                type="file"
                id="profile"
                name="profile"
                onChange={onUpload}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-2">
              <input
                {...formik.getFieldProps("email")}
                type="email"
                placeholder="abc@xyz.com*"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("username")}
                type="text"
                placeholder="Username*"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="Password*"
                className={styles.textbox}
              />
              <button type="submit" className={styles.btn}>
                Register
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered ?
                <Link className="text-red-500 ml-1 font-bold" to="/">
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
