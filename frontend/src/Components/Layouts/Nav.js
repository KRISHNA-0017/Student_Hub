import { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import { GiBookshelf } from "react-icons/gi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BiBookAdd } from "react-icons/bi";
import { RiUserAddLine } from "react-icons/ri";
import { PiStudent, PiUser, PiBooks } from "react-icons/pi";

// Navigation component for the application
const Nav = () => {
  const { user } = useContext(UserContext);
  return (
    // Navigation bar styling
    <nav
      id="nav"
      className="z-0 hidden h-full flex-col justify-stretch bg-black px-4 py-4 text-slate-100 dark:bg-gradient-to-b dark:from-black lg:flex"
    >
      <ul className="m-auto flex flex-grow flex-col items-center justify-start gap-[6px]">
        <NavLink to={"./course"} className="w-full font-medium">
          <li className="flex gap-2 rounded-md px-4 py-2 hover:bg-red-300">
            <GiBookshelf className="pt-[0.1rem] text-2xl  " />
            Course
          </li>
        </NavLink>
        
        <NavLink to={"./grade"} className="w-full font-medium">
          <li className="flex gap-2 rounded-md px-4 py-2 hover:bg-red-200">
            <HiOutlineDocumentReport className="pt-[0.1rem] text-2xl  " />
            Grades
          </li>
        </NavLink>
        
        {user.role === "HOD" && (
          <>
            <NavLink to={"./add_course"} className="w-full font-medium">
              <li className="flex gap-2 rounded-md px-4 py-2 hover:bg-red-200">
                <BiBookAdd className="pt-[0.1rem] text-2xl  " />
                Add Course
              </li>
            </NavLink>
            <NavLink to={"./approve_professor"} className="w-full font-medium">
              <li className="flex gap-2 rounded-md px-4 py-2 hover:bg-red-200">
                <RiUserAddLine className="pt-[0.1rem] text-2xl  " />
                Approve Professor
              </li>
            </NavLink>
          </>
        )}
        {user.role === "student" && (
          <NavLink to={"./join_course"} className="w-full font-medium">
            <li className="flex gap-2 rounded-md px-4 py-2 hover:bg-red-200">
              <PiBooks className="pt-[0.1rem] text-2xl  " />
              Manage Course
            </li>
          </NavLink>
        )}
      </ul>
      <ul className="flex flex-grow flex-col items-start justify-end gap-[6px]">
        <NavLink to={"./profile"} className="w-full font-medium">
          <li className="flex gap-2 rounded-md px-4 py-2 hover:bg-red-200">
            {user.role === "student" ? (
              <PiStudent className="pt-[0.1rem] text-2xl" />
            ) : (
              <PiUser className="pt-[0.1rem] text-2xl" />
            )}
            {user.name}
          </li>
        </NavLink>
      </ul>
    </nav>
  );
};

export default Nav;
