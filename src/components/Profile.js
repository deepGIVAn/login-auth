import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assests/avatar2.jpg";

import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";

import { profileValidation } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import convertToBase64 from "../helper/convert";
import { useAuthStore } from "../store/store";
import useFetch from "../hooks/fetch.hook";
import { updateUser } from "../helper/helper";

const Profile = () => {
  const { username } = useAuthStore((state) => state.auth);
  const [file, setFile] = useState("");

  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] = useFetch(
    `/user/${username}`
  );
  // 

  const formik = useFormik({
    initialValues: {
      firstname: apiData?.firstname || "",
      lastname: apiData?.lastname || "",
      mobile: apiData?.mobile || "",
      email: apiData?.email || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // when we are hitting the submit button so we are adding the one more property to the formik values above ..
      values = await Object.assign(values, {
        profile: file || apiData?.profile || "",
      }); // when we update our profile so its gets removed if we don't pass here api data value ..
      let updatePromise = updateUser(values);
      console.log(values);

      toast.promise(updatePromise, {
        loading: "Updating...",
        success: <b>Updated Successfully</b>,
        error: <b>Could not Update it..</b>,
      });
    },
  });

  // formik does not supprt for the file upload so we need to create this handle ..

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  // logout handler function ..
  const userLogout = () => {
    // localStorage.setItem("token", "");
    localStorage.removeItem('token');
    navigate("/");
  };

  if (isLoading) return <h1 className="text-2xl font-bold">{isLoading}</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-1 text-xl w-3/4 text-center text-gray-500">
              you can update the details
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-2">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file || avatar}
                  alt="avatar"
                  className={styles.profile_img}
                />
                {/* {console.log(apiData?.email)} */}
              </label>
              <input
                type="file"
                id="profile"
                name="profile"
                onChange={onUpload}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-4">
              <div className="name flex w-3/4 gap-8">
                <input
                  {...formik.getFieldProps("firstname")}
                  type="text"
                  placeholder="FirstName*"
                  // to extend with 2 classnames here .. and you can additionally add some inline classes name also here ..
                  className={`${styles.textbox} ${extend.textbox}`}
                />
                <input
                  {...formik.getFieldProps("lastname")}
                  type="text"
                  placeholder="LastName*"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>
              <div className="name flex w-3/4 gap-8">
                <input
                  {...formik.getFieldProps("mobile")}
                  type="text"
                  placeholder="Mobile No.*"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
                <input
                  {...formik.getFieldProps("email")}
                  type="email"
                  placeholder="abc@xyz.com*"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>

              <input
                {...formik.getFieldProps("address")}
                type="text"
                placeholder="Address*"
                className={`${styles.textbox} ${extend.textbox}`}
              />

              <button type="submit" className={styles.btn}>
                Save Changes
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Seems all Okay ?
                <button
                  className="text-red-500 ml-1 font-bold"
                  onClick={userLogout}
                >
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
