import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import "./App.css";
import Login from "./components/Login";
import UserType from "./components/Admin/UserType";
import Courses from "./components/Admin/Courses"; // Typo fixed here (Cousres to Courses)
import ManageCourses from "./components/Admin/ManageCourses";
import Subjects from "./components/Admin/Subjects";
import Teachers from "./components/Admin/Teachers";
import AdminNotice from "./components/Admin/AdminNotice";
import Header from "./components/Admin/Header";
import "./sidebar/sidebar.css";
import "./sidebar/sidebar";
import TeacherDashboard from "./components/Teacher/TeacherDashboard";
import TeacherProfile from "./components/Teacher/TeacherProfile";
import ManageStudents from "./components/Teacher/ManageStudents";
import DepartmentNotice from "./components/Teacher/DepartmentNotice";
import GuardianNotice from "./components/Teacher/GuardianNotice";
import StudentDashboard from "./components/Student/StudentDashboard";
import StudentProfile from "./components/Student/StudentProfile";
import TeacherNotice from "./components/Student/TeacherNotice";
import FeedBack from "./components/Student/FeedBack";
import AdminDashboard from "./components/Admin/AdminDashboard";
import { isLoggedIn } from "./services/auth";
import UserProvider from "./context/UserProvider";
import { ToastContainer } from "react-toastify";

function App() {
  function AuthenticatedRoute({ children, allowedRoles }) {
    const isAuth = isLoggedIn();
    const userRole = sessionStorage.getItem("userRole");
    if (isAuth && allowedRoles.includes(userRole)) {
      return children;
    }
    return <Navigate to="/" />;
  }

  return (
    <UserProvider>
      <BrowserRouter>
        <ToastContainer position="bottom-center" />
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <AuthenticatedRoute allowedRoles={["ADMIN"]}>
                <Header />
              </AuthenticatedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="usertype" element={<UserType />} />
            <Route path="courses" element={<Courses />} />
            <Route path="manageCourses" element={<ManageCourses />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="adminNotice" element={<AdminNotice />} />
          </Route>

          <Route
            path="/teacher"
            element={
              <AuthenticatedRoute allowedRoles={["TEACHER"]}>
                <Header />
              </AuthenticatedRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="managestudents" element={<ManageStudents />} />
            <Route path="deptnotice" element={<DepartmentNotice />} />
            <Route path="guardiannotice" element={<GuardianNotice />} />
          </Route>

          <Route
            path="/student"
            element={
              <AuthenticatedRoute allowedRoles={["STUDENT"]}>
                <Header />
              </AuthenticatedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="teachernotice" element={<TeacherNotice />} />
            <Route path="feedback" element={<FeedBack />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
