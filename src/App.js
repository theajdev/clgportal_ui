import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Footer from './components/Footer';
import { isUserLoggedIn } from './services/AuthService';
import UserType from './components/Admin/UserType';
import Courses from './components/Admin/Courses';  // Typo fixed here (Cousres to Courses)
import ManageCourses from './components/Admin/ManageCourses';
import Subjects from './components/Admin/Subjects';
import Teachers from './components/Admin/Teachers';
import AdminNotice from './components/Admin/AdminNotice';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {

  function AuthenticatedRoute({ children }) {
    const isAuth = isUserLoggedIn();
    if (isAuth) {
      return children;
    }
    return <Navigate to="/" />;
  }

  return (
    <div className='container-fluid'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/admin" element={
            <AuthenticatedRoute>

              <AdminDashboard />
              <Footer />
            </AuthenticatedRoute>
          }>

            <Route path="usertype" element={<UserType />} />
            <Route path="courses" element={<Courses />} />
            <Route path="manageCourses" element={<ManageCourses />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="adminNotice" element={<AdminNotice />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
