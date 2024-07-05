import React from "react";
import UserContext from "../../Hooks/UserContext";
import Loading from "./Loading";

// The GradeLayout component is responsible for conditionally rendering different components
// based on the user type (student or other roles).
const GradeLayout = () => {
  const GradeResultForm = React.lazy(() =>
    // Lazy loading components for performance optimization.
    // These components are loaded only when they are needed.
    import("../Forms/GradeResultForm")
  );
  const GradeStudent = React.lazy(() =>
    import("../Queries/GradeStudent")
  );

  // Accessing the user context to determine the user type.
  const { user } = React.useContext(UserContext);
  return (
    <>
      {user.userType === "student" ? (
        <React.Suspense fallback={<Loading />}>
          <GradeStudent />
        </React.Suspense>
      ) : (
        <React.Suspense fallback={<Loading />}>
          <GradeResultForm />
        </React.Suspense>
      )}
    </>
  );
};

export default GradeLayout;
