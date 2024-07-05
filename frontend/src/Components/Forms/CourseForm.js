import { useState, useEffect, useContext } from "react";
import axios from "../../config/api/axios";
import { useNavigate, Navigate } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import ErrorStrip from "../ErrorStrip";

const CourseForm = () => {
  const { user } = useContext(UserContext);
  const [newCourse, setNewCourse] = useState({
    department: "Information Systems",
    course: "",
    year: "2023",
    students: [],
    semester: "Select Semester",
    professor: "",
  });
  const [professors, setProfessors] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch professors
  useEffect(() => {
    const getProfessors = async () => {
      const list = await axios.get("/professor/list/Information Systems" );
      console.log(user.department);
      setProfessors(list.data);
    };
    getProfessors();
  }, [user]);

  // Function to add a new course
  const addCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("course", JSON.stringify(newCourse));
      navigate("./..");
      toast.success("Course Added");
    } catch (err) {
      setError(err);
    }
  };

  // Handle input changes in the form
  const handleFormChange = (e) => {
    setNewCourse({
      ...newCourse,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <>
      {user.role === "HOD" ? (
        <main className="course">
          <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:mt-0 dark:text-slate-400 md:text-6xl">
            Add Course
          </h2>
          <form className="w-full md:w-1/3">
            <label htmlFor="department">Department:</label>
            <input
              className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
              name="department"
              type="text"
              required
              id="department"
              value= "Information Systems"
              disabled
            />
            <label htmlFor="course">Course:</label>
            <input
              className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
              type="text"
              name="course"
              id="course"
              value={newCourse.course}
              required
              onChange={(e) => handleFormChange(e)}
            />
            <label htmlFor="semester">Semester:</label>
            <select
              className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
              id="semester"
              value={newCourse.semester}
              required
              onChange={(e) => handleFormChange(e)}
            >
              <option defaultValue hidden>
                Select Semester
              </option>
              <option value="I">Fall</option>
              <option value="II">Spring</option>
              <option value="III">Summer</option>
              <option value="IV">Winter</option>
              {/* <option value="V">V</option>
              <option value="VI">VI</option> */}
            </select>
            <label htmlFor="year">Year:</label>
            <input
              className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
              type="number"
              min="2000"
              max="2030"
              step="1"
              required
              id="year"
              value={newCourse.year}
              onChange={(e) => handleFormChange(e)}
            />
            <label htmlFor="professor">Professor:</label>
            <select
              className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
              required
              id="professor"
              name="professor"
              value={newCourse.professor}
              onChange={(e) => handleFormChange(e)}
            >
              <option defaultValue hidden>
                Select Professor
              </option>
              {professors?.map((professor) => (
                <option key={professor._id} value={professor._id}>
                  {professor.name}
                </option>
              ))}
            </select>
            <button
className="mb-4 flex h-10 w-auto items-center gap-2 rounded-md border-[1.5px] border-solid border-black bg-black px-6 py-2 font-semibold tracking-wide text-white hover:bg-gray-800 focus:bg-gray-800"
type="submit"
              onClick={(e) => addCourse(e)}
            >
              <FaPlus />
              Add
            </button>
          </form>
          {error ? <ErrorStrip error={error} /> : ""}
        </main>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
};

export default CourseForm;
