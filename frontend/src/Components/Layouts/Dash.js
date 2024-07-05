import { Link } from "react-router-dom";
import { GiBookshelf } from "react-icons/gi";

import { HiOutlineDocumentReport } from "react-icons/hi";

import { BiBookAdd } from "react-icons/bi";
import { RiUserAddLine } from "react-icons/ri";
import { PiBooks, PiUser, PiStudent } from "react-icons/pi";
import { useContext, useEffect } from "react";
import UserContext from "../../Hooks/UserContext";
import axios from "../../config/api/axios";

const Dash = () => {
  const { user, setCourseList } = useContext(UserContext);

  // Fetch courses when the component mounts or when user changes
  useEffect(() => {
    const getCourses = async () => {
      const response = await axios.get(`course/${user.userType}/${user._id}`);
      setCourseList(response.data);
    };
    getCourses();
  }, [setCourseList, user]);

  // Main dashboard layout
  return (
    <main className="self-center">
      <h2 className="m-6 mx-auto text-center text-6xl font-bold text-white dark:text-white">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 place-content-center gap-3 px-1 py-4 lg:grid-cols-2 lg:gap-4 lg:px-8 xl:grid-cols-3">
        <Link
          className="flex gap-2 rounded-lg bg-gradient-to-r from-red-500 to-black p-6 text-base text-white hover:bg-gradient-to-l hover:from-black hover:to-red-500 hover:text-white dark:bg-gradient-to-r dark:from-red-500 dark:to-black lg:text-lg"
          to={"./course"}
        >
          <GiBookshelf className="text-[2.5rem] lg:text-[4rem] " />
          <div className="font-semibold">
            Courses
            <p className="text-sm font-normal lg:text-base ">
              View Courses and Notes
            </p>
          </div>
        </Link>

        <Link
          className="flex gap-2 rounded-lg bg-gradient-to-r from-red-500 to-black p-6 text-base text-white hover:bg-gradient-to-l hover:from-black hover:to-red-500 hover:text-white dark:bg-gradient-to-r dark:from-red-500 dark:to-black lg:text-lg"
          to={"./grade"}
        >
          <HiOutlineDocumentReport className="text-[2.5rem] lg:text-[4rem] " />
          <div className="font-semibold">
            Grades
            <p className="text-sm font-normal lg:text-base ">
              View or Edit Grades
            </p>
          </div>
        </Link>

        {user.role === "HOD" && (
          <>
            <Link
              className="flex gap-2 rounded-lg bg-gradient-to-r from-red-500 to-black p-6 text-base text-white hover:bg-gradient-to-l hover:from-black hover:to-red-500 hover:text-white dark:bg-gradient-to-r dark:from-red-500 dark:to-black lg:text-lg"
              to={"./add_course"}
            >
              <BiBookAdd className="text-[2.5rem] lg:text-[4rem] " />
              <div className="font-semibold">
                Add Course
                <p className="text-sm font-normal lg:text-base ">
                  Add a New Course
                </p>
              </div>
            </Link>

            <Link
              className="flex gap-2 rounded-lg bg-gradient-to-r from-red-500 to-black p-6 text-base text-white hover:bg-gradient-to-l hover:from-black hover:to-red-500 hover:text-white dark:bg-gradient-to-r dark:from-red-500 dark:to-black lg:text-lg"
              to={"./approve_professor"}
            >
              <RiUserAddLine className="text-[2.5rem] lg:text-[4rem] " />
              <div className="font-semibold">
                Approve Professor
                <p className="text-sm font-normal lg:text-base ">
                  Approve registered Professor(s)
                </p>
              </div>
            </Link>
          </>
        )}



        {user.role === "student" && (
          <Link
            className="flex gap-2 rounded-lg bg-gradient-to-r from-red-500 to-black p-6 text-base text-white hover:bg-gradient-to-l hover:from-black hover:to-red-500 hover:text-white dark:bg-gradient-to-r dark:from-red-500 dark:to-black lg:text-lg"
            to={"./join_course"}
          >
            <PiBooks className="text-[2.5rem] lg:text-[4rem] " />
            <div className="font-semibold">
              Manage Course
              <p className="text-sm font-normal lg:text-base ">
                Register or Drop Course
              </p>
            </div>
          </Link>
        )}
        <Link
          className="flex gap-2 rounded-lg bg-gradient-to-r from-red-500 to-black p-6 text-base text-white hover:bg-gradient-to-l hover:from-black hover:to-red-500 hover:text-white dark:bg-gradient-to-r dark:from-red-500 dark:to-black lg:text-lg"
          to={"./profile"}
        >
          {user.role === "student" ? (
            <PiStudent className="text-[2.5rem] lg:text-[4rem] " />
          ) : (
            <PiUser className="text-[2.5rem] lg:text-[4rem] " />
          )}
          <div className="font-semibold">
            Profile
            <p className="text-sm font-normal lg:text-base ">
              View or Edit Profile
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default Dash;
