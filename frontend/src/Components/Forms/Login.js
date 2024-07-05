import { useContext, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import axios from "../../config/api/axios";
import { FaUniversity } from "react-icons/fa";
import { PiStudentThin, PiUserThin, PiSpinnerGapBold } from "react-icons/pi";

import ErrorStrip from "../ErrorStrip";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [buttonText, setButtonText] = useState("Login");
  const [message, setMessage] = useState("");

  // Displays a message if the server takes time to respond
  const slowLoadingIndicator = () => {
    setTimeout(() => {
      setMessage(
        "NOTE:Web Services on the free instance type are automatically spun down after 15 minutes of inactivity. When a new request for a free service comes in, Render spins it up again so it can process the request. This will cause a delay in the response of the first request after a period of inactivity while the instance spins up."
      );
    }, 4000);
  };

  // Handles the login process
  const handleLogin = async (e) => {
    e.preventDefault();
    if (userType === "") {
      setError({
        response: {
          data: "Select User Type",
        },
      });
    } else {
      setButtonText("Loading...");
      slowLoadingIndicator();
      try {
        const response = await axios.post("/auth/login/" + userType, {
          username,
          password,
        });
        await setUser({ ...response.data, userType });
        localStorage.setItem(
          "userDetails",
          JSON.stringify({ ...response.data, userType })
        );
      } catch (err) {
        setError(err);
        setButtonText("Login");
      }
    }
  };


  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setButtonText("Loading...");
  //   slowLoadingIndicator();
  //   try {
  //     // Call to a generic login endpoint
  //     const response = await axios.post("/login", {
  //       username,
  //       password,
  //     });
  
  //     // Backend should return the user's role
  //     const role = response.data.role;
  //     console.log(role);
  
  //     // Set user context with the returned data
  //     await setUser({ ...response.data, userType: role });
  
  //     // Store user details in localStorage
  //     localStorage.setItem("userDetails", JSON.stringify({ ...response.data, userType: role }));
  
  //     // Navigate to dashboard based on role
  //     navigate(role === "professor" ? "/professor-dashboard" : "/student-dashboard");
  
  //   } catch (err) {
  //     setError(err);
  //     setButtonText("Login");
  //   }
  // };
  
  // Initializing user state on component mount
  
  useEffect(() => {
    if ("userDetails" in localStorage) {
      setUser(JSON.parse(localStorage.getItem("userDetails")));
    }
    setUserType("");
    setMessage("");
  }, [setUserType, setMessage, setUser]);

  return (
    <>
      {!user?._id ? (
        <main className="relative z-0 flex h-screen flex-col items-center justify-center bg-gradient-to-b from-red-500 to-black text-slate-950 dark:text-slate-300">
          {message && !error && (
            <header className="absolute top-0 w-full bg-gradient-to-r from-red-500 to-black p-2 text-xs lg:text-base">
              {message}
            </header>
          )}
          
          <section className="z-0 mb-4 flex items-center gap-2 whitespace-nowrap text-6xl md:text-8xl lg:gap-4">
            <FaUniversity />
            <h1 style={{ fontSize: '50px' }} className="font-spectral font-semibold  text-slate-500  dark:text-slate-300 ">
              
              Northeastern University
              
            </h1>
          </section>
          <section className="z-0 w-[65%] justify-self-center rounded-lg bg-gradient-to-r from-red-500 to-black opacity-80 hover:opacity-100 focus:opacity-100 sm:w-[min(50%,360px)] md:w-[min(40%,360px)] xl:w-[min(23%,360px)]">
            <form
              className="tracking-wide placeholder:text-slate-200 dark:placeholder:text-violet-200 "
              onSubmit={(e) => handleLogin(e)}  
            >
              <section className="flex flex-col items-center justify-start ">
                <div className="flex w-full text-lg ">
                  <label
                    className={`radio relative flex w-1/2 cursor-pointer flex-col items-center rounded-tl-lg p-4 ${userType === 'professor' ? 'text-yellow-500' : ''} dark:border-l-[1.5px] dark:border-t-[1.5px] dark:border-solid dark:border-white`}
                    htmlFor="professor"
                  >
                    Professor
                    <input
                      className="absolute opacity-0"
                      type="radio"
                      value="professor"
                      id="professor"
                      name="userType"
                      onClick={() => setUserType("professor")}
                    />
                  </label>
                  <label
                    className={`radio relative flex w-1/2 cursor-pointer flex-col items-center rounded-tr-lg p-4 ${userType === 'student' ? 'text-yellow-500' : ''} dark:border-r-[1.5px] dark:border-t-[1.5px] dark:border-solid dark:border-white`}
                    htmlFor="student"
                  >
                    Student
                    <input
                      className="absolute opacity-0"
                      type="radio"
                      value="student"
                      id="student"
                      name="userType"
                      onClick={() => setUserType("student")}
                    />
                  </label>
                </div>
                <div className="flex w-full justify-center p-1 pt-0 text-8xl dark:border-x-[1.5px] dark:border-solid dark:border-white-900 md:p-3 md:pt-0">
                  {userType === "student" ? (
                    <PiStudentThin className="animate-slide rounded-full border-2 border-slate-900 p-1 font-light dark:border-slate-300 md:p-2" />
                  ) : userType === "professor" ? (
                    <PiUserThin className="animate-slide rounded-full border-2 border-slate-900 p-1 font-light dark:border-slate-300 md:p-2" />
                  ) : (
                    <FaUniversity className="animate-fadeIn rounded-full border-2 border-slate-900 p-1 font-light dark:border-slate-300 md:p-2" />
                  )}
                </div>
              </section>
              <section className="rounded-b-lg px-4 pb-4 dark:border-x-[1.5px] dark:border-b-[1.5px] dark:border-solid dark:border-white-900">
                <input
                  className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-white p-1 pl-2 outline-none"
                  placeholder="username"
                  id="username"
                  type="text"
                  required
                  autoComplete="off"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-white p-1 pl-2 outline-none"
                  placeholder="password"
                  id="password"
                  type="password"
                  required
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="mb-1 flex h-10 w-full items-center justify-center gap-1 rounded-md border-[1.5px] border-solid bg-black p-1 font-bold tracking-wide text-white hover:bg-white hover:text-black focus:bg-white focus:text-black disabled:cursor-wait lg:mb-2"
                  type="submit"
                  value="Login"
                  disabled={buttonText !== "Login"}
                  onClick={(e) => handleLogin(e)}
                >
                  {!(buttonText === "Login") && (
                    <PiSpinnerGapBold className="animate-spin" />
                  )}
                  {buttonText}
                </button>
                {error ? <ErrorStrip error={error} /> : ""}
                <p className="inline text-white dark:text-white">
                  Click to{" "}
                </p>
                <button
                  type="button"
                  className="font-semibold text-white decoration-2 hover:text-black focus:underline dark:text-white dark:hover:text-black"
                  onClick={() => navigate("./register/reg_student")}
                >
                  Register
                </button>
              </section>
            </form>
          </section>
        </main>
      ) : (
        <Navigate to="./dash" />
      )}
    </>
  );
};

export default Login;
