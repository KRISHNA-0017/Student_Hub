import { Outlet, Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Nav from "./Nav";
import { useContext } from "react";
import UserContext from "../../Hooks/UserContext";

// layout of the entire dash/ route
const Layout = () => {
  // Accessing user context to determine if the user is logged in.
  const { user } = useContext(UserContext);
  // Getting the current location (route) to conditionally render components.
  const location = useLocation().pathname;

  //  dashboard
  return (
    <div className="relative flex flex-col bg-slate-950">
      <Header />
      <main className="mt-[3.15rem] flex h-[calc(100vh-3.15rem)] whitespace-nowrap bg-gradient-to-b from-red-500 to-gray-900 dark:bg-gradient-to-b dark:from-red-500 dark:to-gray-900">
        {location === "/dash" ? "" : <Nav />}
        {user ? (
          <div className="outlet-border z-[1] mt-1 w-full overflow-y-auto bg-gradient-to-b from-red-500 to-gray-900 p-4 text-slate-900 dark:bg-gradient-to-b dark:from-red-500 dark:to-gray-900 dark:text-slate-400 lg:p-10">
            <Outlet />
          </div>
        ) : (
          <Navigate to="/" replace={true} />
        )}
      </main>
    </div>
  );
};

export default Layout;
