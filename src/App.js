import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Register from './components/Register';
import Login from './components/Login';
import Footer from './components/Footer';
import { isUserLoggedIn } from './services/AuthService';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import UserType from './components/Admin/UserType';
import Cousres from './components/Admin/Courses';
import ManageCourses from './components/Admin/ManageCourses';
import Subjects from './components/Admin/Subjects';
import Teachers from './components/Admin/Teachers';
import AdminNotice from './components/Admin/AdminNotice';
import TeacherProfile from './components/Teacher/TeacherProfile';
import DepartmentNotice from './components/Teacher/DepartmentNotice';
import ManageStudents from './components/Teacher/ManageStudents';
import GuardianNotice from './components/Teacher/GuardianNotice';
import StudentProfile from './components/Student/StudentProfile';
import TeacherNotice from './components/Student/TeacherNotice';
import FeedBack from './components/Student/FeedBack';
import Dashboard from './components/Admin/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {

  function AuthenticatedRoute({ children }) {
    const isAuth = isUserLoggedIn();
    if (isAuth) {
      return children;
    }
    return <Navigate to="/" />

  }

  return (

    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} ></Route>
        </Routes>

        <Routes>

          <Route path="/admin" element={
            <AuthenticatedRoute>
              <Header />
              <div className='mt-5'>
                <AdminDashboard />
              </div>
              <Footer />
            </AuthenticatedRoute>
          }>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/usertype" element={<UserType />} />
            <Route path="/admin/courses" element={<Cousres />} />
            <Route path="/admin/manageCourses" element={<ManageCourses />} />
            <Route path="/admin/subjects" element={<Subjects />} />
            <Route path="/admin/teachers" element={<Teachers />} />
            <Route path="/admin/adminNotice" element={<AdminNotice />} />

          </Route>

          <Route path="/teacher" element={
            <AuthenticatedRoute>
              <Header />
              <TeacherDashboard />
            </AuthenticatedRoute>
          }>
            <Route path="/teacher/profile" element={<TeacherProfile />} />
            <Route path="/teacher/deptNotice" element={<DepartmentNotice />} />
            <Route path="/teacher/students" element={<ManageStudents />} />
            <Route path="/teacher/guardianNotice" element={<GuardianNotice />} />
          </Route>
          <Route path="/student" element={
            <AuthenticatedRoute>
              <StudentDashboard />
            </AuthenticatedRoute>
          }>
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/deptNotice" element={<DepartmentNotice />} />
            <Route path="/student/teacherNotice" element={<TeacherNotice />} />
            <Route path="/student/feedback" element={<FeedBack />} />
          </Route>
          <Route path="/register" element={<Register />}></Route>

        </Routes>

      </BrowserRouter>

    </>

  );
}

export default App;
