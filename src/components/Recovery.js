import React, {  useState } from "react";
import styles from "../styles/Username.module.css";
import { useAuthStore } from "../store/store";
import toast, { Toaster } from "react-hot-toast";
import { generateOTP, verifyOTP } from "../helper/helper";
import {  useNavigate } from "react-router-dom";

const Recovery = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setotp] = useState();

  // useeffect  -  it was executing two times ...

  // useEffect(() => {
  //   setTimeout(function(){
  //     console.log("OKkkkkkkk");
  //   }, 1000);
  //   generateOTP(username).then((OTP) => {
  //     console.log(OTP);
  //     if (OTP)
  //       return toast.success("OTP sent Successfully!! check browser console");
  //     return toast.error("There is some problem while generating the OTP ..");
  //   });
  // }, [username]);

  const resendotp = () => {
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

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201 || status === 200) {
        toast.success("Verified Successfully..!!");
        return navigate("/reset");
      }
    } catch (error) {
      return toast.error("Wrong! OTP check email again..!");
    }
  }


  return (
    <div className="container mx-auto">
      {/* to get the toaster message .. */}
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            {/* w-3/4 means that 3 parts of 4 parts */}
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">
              Enter OTP to recover password..
            </span>
          </div>
          <form className="py-1" onSubmit={onSubmit}>
            <div className="input text-center">
              <div className="textbox flex flex-col items-center gap-6 my-8">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className={styles.textbox}
                  onChange={(e) => setotp(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.btn}>
                Recover
              </button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP ?
              <button
                className="text-red-500 ml-1 font-bold"
                onClick={resendotp}
              >
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
