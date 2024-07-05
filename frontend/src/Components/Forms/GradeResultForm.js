import { useState, useContext } from "react";
import axios from "../../config/api/axios";
import UserContext from "../../Hooks/UserContext";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { TableHeader } from "../Table";
import ErrorStrip from "../ErrorStrip";

const GradeResultForm = () => {
  // State variables and context
  const { courseList } = useContext(UserContext);
  const [course, setCourse] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [grade, setGrade] = useState([]);
  const [id, setId] = useState([]);
  const [error, setError] = useState("");

  // Fetch grade marks for a course
  const fetchGrade = async (e) => {
    setGrade([]);
    setError("");
    e.preventDefault();
    try {
      // fetching grade record
      const response = await axios.get("/grade/" + course);
      // saving record id for updating/deleting record
      setId(response.data._id);
      setGrade(response.data.marks);
      setDisabled(true);
      setError("");
    } catch (err) {
      setError(err);
      // incase no record exists
      if (err.response.status === 404) {
        // fetching students list and mapping to add fields
        const response = await axios.get("course/" + course);
        const students = response.data.students;
        students.forEach((student) => {
          Object.assign(student, {
            test: 0,
            seminar: 0,
            assignment: 0,
            attendance: 0,
            total: 0,
          });
        });
        setGrade(students);
        setDisabled(false);
      }
    }
  };

  const addGradeMark = async (e) => {
    e.preventDefault();
    const marks = { id, course, marks: grade };
    try {
      // adding new grade mark record
      const response = await axios.post("grade/" + course, marks);
      toast.success(response.data.message);
      setDisabled(true);
      setError("");
      fetchGrade(e);
    } catch (err) {
      // conflict, record already exists
      if (err.response.status === 409) {
        try {
          // updating grade record
          const response = await axios.patch("grade/" + course, marks);
          toast.success(response.data.message);
          setDisabled(true);
          setError("");
        } catch (err) {
          setError(err);
        }
      } else setError(err);
    }
  };

  const deleteGradeMark = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete("grade/" + id);
      toast.success(response.data.message, {
        icon: ({ theme, type }) => <FaTrash />,
      });
      setGrade([]);
    } catch (err) {
      setError(err);
    }
  };

  // updating grade state on "onChange" event.
  const handleFormChange = (e) => {
    
    const index = parseInt(e.target.id);
    const value = e.target.value;
    const key = e.target.name;
    const newStudent = grade[index];
    newStudent[key] = value;
    const newGrade = grade.map((student, index) => {
      if (index === e.target.id) {
        return newStudent;
      } else return student;
    });
    setGrade(newGrade);
  };

  return (
    <main className="grade">
      <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-white dark:text-white md:text-6xl">
        Grades
      </h2>
      <section className="form__head">
        <form className="w-full gap-4 accent-violet-900 md:flex">
          <select
            className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-white p-1 pl-2 outline-none selection:border-white focus:border-white dark:border-white dark:caret-inherit dark:focus:border-white dark:active:border-white md:w-1/3"
            placeholder="select course"
            name="course"
            id="course"
            value={course}
            required
            onChange={(e) => setCourse(e.target.value)}
          >
            <option defaultValue hidden>
              Select Course
            </option>
            {courseList.map((course) => (
              <option key={course._id} value={course._id}>
                {course.course}
              </option>
            ))}
          </select>
          <button
            className="mb-4 h-10 w-auto rounded-md border-[1.5px] border-solid border-white bg-black px-8 py-2 font-semibold tracking-wide text-slate-200 hover:bg-white hover:text-black focus:bg-white focus:text-black disabled:cursor-not-allowed dark:border-white dark:bg-black dark:text-violet-100 dark:hover:bg-white dark:hover:text-black"
            type="submit"
            onClick={(e) => fetchGrade(e)}
          >
            Search
          </button>
        </form>
      </section>
      <div>{error ? <ErrorStrip error={error} /> : ""}</div>
      <section className="grade__body">
        <form className="grade__body__form">
          {grade.length ? (
            <div className="my-4 w-full overflow-auto rounded-md border-2 border-slate-900 dark:border-slate-500 dark:p-[1px]">
              <table className="w-full">
                <TableHeader
                  AdditionalHeaderClasses={"text-left"}
                  Headers={[
                    "Student",
                    "Test",
                    "Seminar",
                    "Assignment",
                    "Attendance",
                    "Total",
                  ]}
                />
                <tbody>
                  {grade?.map((student, index) => (
                    <tr
                      key={index}
                      className={
                        // checking whether the student passed (total mark is above 7), bgcolor to represent it.
                        parseInt(student?.test) +
                          parseInt(student?.seminar) +
                          parseInt(student?.assignment) +
                          parseInt(student?.attendance) >
                        7
                          ? "border-t-[1px] border-slate-400 bg-violet-900/50 first:border-none"
                          : "border-t-[1px] border-slate-400 first:border-none"
                      }
                    >
                      <td className="p-2 ">{student.name}</td>
                      <td className="p-2 ">
                        <input
                          className="w-full pl-3 "
                          type="number"
                          required
                          min="0"
                          max="3"
                          disabled={disabled}
                          id={index}
                          name="test"
                          value={student.test}
                          onChange={(e) => handleFormChange(e)}
                        />
                      </td>
                      <td className="p-2 ">
                        <input
                          className="w-full pl-3 "
                          type="number"
                          required
                          min="0"
                          max="3"
                          disabled={disabled}
                          id={index}
                          name="seminar"
                          value={student.seminar}
                          onChange={(e) => handleFormChange(e)}
                        />
                      </td>
                      <td className="p-2 ">
                        <input
                          className="w-full pl-3 "
                          type="number"
                          required
                          min="0"
                          max="3"
                          disabled={disabled}
                          id={index}
                          name="assignment"
                          value={student.assignment}
                          onChange={(e) => handleFormChange(e)}
                        />
                      </td>
                      <td className="p-2 ">
                        <input
                          className="w-full pl-3 "
                          type="number"
                          required
                          min="0"
                          max="3"
                          disabled={disabled}
                          id={index}
                          name="attendance"
                          value={student.attendance}
                          onChange={(e) => handleFormChange(e)}
                        />
                      </td>
                      <td className="p-2 ">
                        <input
                          className="w-full pl-3 "
                          type="number"
                          required
                          min="0"
                          max="3"
                          disabled
                          id={index}
                          name="total"
                          value={
                            parseInt(student?.test) +
                            parseInt(student?.seminar) +
                            parseInt(student?.assignment) +
                            parseInt(student?.attendance)
                          }
                          onChange={(e) => handleFormChange(e)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )}
          {grade.length && disabled ? (
            <div className="flex gap-4">
              <button
                type="submit"
                className="mb-4 flex h-10 w-auto items-center gap-2 rounded-md border-[1.5px] border-solid border-white-900 bg-white px-6 py-2 font-semibold tracking-wide text-black hover:bg-black hover:text-white focus:bg-black focus:text-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
                onClick={(e) => setDisabled(false)}
              >
                <FaEdit /> Edit
              </button>
              <button
                type="submit"
                className="mb-4 flex h-10 w-auto items-center gap-2 rounded-md border-[1.5px] border-solid border-white-900 bg-white px-6 py-2 font-semibold tracking-wide text-black hover:bg-black hover:text-white focus:bg-black focus:text-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
                onClick={(e) => deleteGradeMark(e)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          ) : (
            ""
          )}
          {grade.length && !disabled ? (
            <button
              type="submit"
              className="mb-4 flex h-10 w-auto items-center gap-2 rounded-md border-[1.5px] border-solid border-white-900 bg-white px-6 py-2 font-semibold tracking-wide text-black hover:bg-black hover:text-white focus:bg-black focus:text-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
              onClick={(e) => addGradeMark(e)}
            >
              <FaPlus /> Save
            </button>
          ) : (
            ""
          )}
        </form>
      </section>
    </main>
  );
};

export default GradeResultForm;
