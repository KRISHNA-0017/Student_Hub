import React from "react";
import UserContext from "../../Hooks/UserContext";
import { TableHeader } from "../Table";
import axios from "../../config/api/axios";
import Loading from "../Layouts/Loading";
import ErrorStrip from "../ErrorStrip";

const GradeStudent = () => {
  // Access user context
  const { user } = React.useContext(UserContext);

  // Initialize state variables
  const [grade, setGrade] = React.useState([]);
  const [error, setError] = React.useState("");

  // Fetch grade grades data when the component mounts
  React.useEffect(() => {
    const fetchGrade = async () => {
      try {
        const response = await axios.get("/grade/student/" + user._id);
        setGrade(response.data);
      } catch (err) {
        setError(err);
      }
    };
    fetchGrade();
  }, [user]); // Only fetch data when the user context changes

  // grdding....
  return (
    <main className="grade">
      <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:mt-0 dark:text-slate-400 md:text-6xl">
        Grades
      </h2>
      <div>{error ? <ErrorStrip error={error} /> : ""}</div>
      {grade.length ? (
        <section className="my-4 w-full overflow-auto rounded-md border-2 border-slate-900 dark:border-slate-500 dark:p-[1px]">
          <table className="w-full">
            <TableHeader
              AdditionalHeaderClasses={"text-left"}
              Headers={[
                "Course",
                "Assignment",
                "MidTerm",
                "Final",
                "Project",
                "Total",
              ]}
            />
            <tbody>
              {grade?.map((course, index) => (
                <tr
                  key={index}
                  className={
                    parseInt(course?.marks.test) +
                      parseInt(course?.marks.seminar) +
                      parseInt(course?.marks.assignment) +
                      parseInt(course?.marks.attendance) >
                    7
                      ? "border-t-[1px] border-slate-400 bg-violet-900/50 first:border-none"
                      : "border-t-[1px] border-slate-400 first:border-none"
                  }
                >
                  <td className="p-2 ">{course.course.course}</td>
                  <td className="p-2 ">{course.marks.test}</td>
                  <td className="p-2 ">{course.marks.seminar}</td>
                  <td className="p-2 ">{course.marks.assignment}</td>
                  <td className="p-2 ">{course.marks.attendance}</td>
                  <td className="p-2 ">
                    {course.marks.test +
                      course.marks.seminar +
                      course.marks.assignment +
                      course.marks.attendance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <Loading />
      )}
    </main>
  );
};

export default GradeStudent;
