import { useContext, useState, useEffect } from "react";
import UserContext from "../../Hooks/UserContext";
import { Navigate } from "react-router-dom";
import axios from "../../config/api/axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Layouts/Loading";
import ErrorStrip from "../ErrorStrip";

const ProfessorApproval = () => {
  const { user } = useContext(UserContext);
  const [newProfessors, setNewProfessors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getNewProfessors = async () => {
      try {
        const response = await axios.get("professor/approve/" + user.department);
        setNewProfessors(response.data);
      } catch (err) {
        setError(err);
      }
    };
    getNewProfessors();
  }, [user]);

  const handleApprove = async (id, index) => {
    const professor = newProfessors[index];
    professor.role = "professor";
    try {
      const response = await axios.patch("/professor/" + id, {
        id: id,
        roles: professor.role,
      });
      const updatedProfessors = newProfessors.filter((_, idx) => idx !== index);
      setNewProfessors(updatedProfessors);
      toast.success(response.data.message);
    } catch (err) {
      setError(err);
    }
  };

  const handleDelete = async (id, index) => {
    try {
      const response = await axios.delete("/professor/" + id);
      const updatedProfessors = newProfessors.filter((_, idx) => idx !== index);
      setNewProfessors(updatedProfessors);
      toast.success("Professor Rejected", {
        icon: ({ theme, type }) => <FaTrash />,
      });
    } catch (err) {
      setError(err);
      toast.error(err.message);
    }
  };

  return (
    <>
      {user.role === "HOD" ? (
        <main className="Professor__approval">
          <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:mt-0 dark:text-slate-400 md:text-6xl">
            Approve Professor
          </h2>
          <h3 className="text-2xl font-semibold">
            Department: {user.department}
          </h3>
          {newProfessors.length ? (
            <div className="my-4 w-full overflow-auto rounded-md border-2 border-slate-900 dark:border-slate-500 dark:p-[1px]">
              <table className="w-full">
                <thead>
                  <tr className="rounded-t-xl bg-slate-900 text-base text-slate-100">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Qualification</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">Approve</th>
                    <th className="p-2">Reject</th>
                  </tr>
                </thead>
                <tbody>
                  {newProfessors.map((professor, index) => (
                    <tr key={index}>
                      <td className="border-t-[1px] border-slate-400 p-2">
                        {professor.name}
                      </td>
                      <td className="border-t-[1px] border-slate-400 p-2">
                        {professor.email}
                      </td>
                      <td className="border-t-[1px] border-slate-400 p-2">
                        {professor.qualification}
                      </td>
                      <td className="border-t-[1px] border-slate-400 p-2">
                        {professor.username}
                      </td>
                      <td className="border-t-[1px] border-slate-400 p-0">
                        <button
                          type="button"
                          onClick={() => handleApprove(professor._id, index)}
                          className="m-0 flex h-auto w-full justify-center bg-transparent py-3 text-xl text-slate-100 hover:bg-violet-900"
                        >
                          <FaPlus />
                        </button>
                      </td>
                      <td className="border-t-[1px] border-slate-400 p-0">
                        <button
                          type="button"
                          onClick={() => handleDelete(professor._id, index)}
                          className="m-0 flex h-auto w-full justify-center bg-transparent py-3 text-xl text-slate-100 hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !error && <Loading />
          )}
          {error ? <ErrorStrip error={error} /> : ""}
        </main>
      ) : (
        <Navigate to="/dash" />
      )}
    </>
  );
};

export default ProfessorApproval;
