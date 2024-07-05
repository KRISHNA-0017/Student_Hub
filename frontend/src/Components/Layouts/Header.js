import React, { useContext } from "react";
import { FaUniversity } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import { toast } from "react-toastify";

// The Header component is used at the top of the page for navigation and logout functionality.
const Header = () => {
  const { setUser, setCourseList } = useContext(UserContext);  // Access user and course list context and their update functions

  // Function to handle logout
  const logout = () => {
    setUser("");
    setCourseList([]);
    localStorage.clear();
    toast.info("Logged Out"); //// Show logout notification
  };
  return (
    <header className="absolute top-0 flex w-full justify-between bg-slate-950 text-slate-50 dark:bg-slate-950 ">
      <Link
        to="/dash"
        className="ml-4 flex items-center gap-2 px-3 py-1 text-2xl font-semibold sm:text-3xl"
      >
        <FaUniversity className="m-1" />
        <h1 className="m-0 pr-1 font-spectral text-slate-50 decoration-red-500 decoration-[3px] underline-offset-[3px] hover:underline">
          Northeastern University
        </h1>
      </Link>
      <Link
        to="./"
        className="text-md m-2 mr-4 flex items-center rounded-md p-[7px] font-semibold  hover:bg-red-700 hover:text-slate-100"
        onClick={() => logout()}
      >
        <p>&nbsp;Logout&nbsp;&nbsp;</p>
        <FiLogOut className="text-xl" />
      </Link>
    </header>
  );
};

export default Header;
