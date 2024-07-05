import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../config/api/axios";
import UserContext from "../../Hooks/UserContext";
import { TableHeader } from "../Table";
import Loading from "../Layouts/Loading";
import ErrorStrip from "../ErrorStrip";

const JoinCourse = () => {
  // Utilizing React context and state hooks
  const { user, setCourseList } = useContext(UserContext);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getallCourses = async () => {
      try {
        const response = await axios.get("course/manage/" + user._id);
        setCourses(response.data);
      } catch (err) {
        setError(err);
      }
    };
    getallCourses();

    const updateCourses = async () => {
      const response = await axios.get(`course/student/${user._id}`);
      setCourseList(response.data);
    };
    // updating courseList while component unmounts
    return () => updateCourses();
  }, [user, setCourseList]);

  // Handle join action
  const handleJoin = async (e) => {
    const courseId = e.currentTarget.id;
    const index = e.target.name;
    const students = courses[index].students;
    students.push(user._id);
    updateStudents(courseId, students, index);

  };

  // Handle leave action

  const handleLeave = async (e) => {
    const courseId = e.currentTarget.id;
    const index = e.target.name;
    const students = courses[index].students;
    const updatedStudents = students.filter((student) => student !== user._id);
    updateStudents(courseId, updatedStudents, index);
  };

  // Update student list 
  const updateStudents = async (courseId, studentsObj, courseIndex) => {
    setError("");
    try {
      const response = await axios.patch("/course/" + courseId, {
        students: studentsObj,
        id: courseId,
      });
      toast.success(response.data.message);
      const updatedCourse = courses.map((course, index) => {
        if (index === parseInt(courseIndex)) {
          course.joined = !course.joined;
          return course;
        } else return course;
      });
      setCourses(updatedCourse);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      {user.role === "student" ? (
        <main>
          <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-white md:text-6xl">
            Manage Course
          </h2>
          <form>
            {courses.length ? (
              <>
                <div className="my-4 w-full overflow-auto rounded-md border-2 border-black-900 dark:border-slate-500 dark:p-[1px]">
                  <table className="w-full text-left">
                    <TableHeader
                      AdditionalRowClasses={"rounded-t-xl text-left"}
                      Headers={[
                        "Course",
                        "Department",
                        "Year",
                        "Semester",
                        "Professor",
                        "Manage",
                      ]}
                    />
                    <tbody>
                      {courses?.map((course, index) => (
                        <tr key={index}>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {course.course}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {course.department}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {course.year}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {course.semester}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {course.professor.name}
                          </td>
                          <td className="border-t-[1px] border-slate-400 p-0">
                            {!course.joined ? (
                              <button
                                type="button"
                                id={course._id}
                                name={index}
                                onClick={(e) => handleJoin(e)}
                                className="m-0 flex h-auto w-full justify-center bg-transparent py-3  text-lg  hover:bg-violet-900 hover:text-slate-100 dark:text-slate-100 "
                              >
                                Register
                              </button>
                            ) : (
                              <button
                                className="m-0 flex h-auto w-full justify-center bg-transparent py-3  text-lg  hover:bg-red-600 hover:text-slate-100 dark:text-slate-100 "
                                type="button"
                                id={course._id}
                                name={index}
                                onClick={(e) => handleLeave(e)}
                              >
                                Drop Course
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <Loading />
            )}
          </form>
          {error ? <ErrorStrip error={error} /> : ""}
        </main>
      ) : (
        <Navigate to="/dash" />
      )}
    </>
  );
};

export default JoinCourse;
