import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/AuthService';

const AdminDashboard = () => {
  const navigate = useNavigate();  // Hook to navigate programmatically

  function handleLogout() {
    logout();
    navigate("/");  // Correct usage of navigate
  }

  return (
    <div>
      <div className="wrapper d-flex align-items-stretch">
        <nav id="sidebar" className="nav">
          <div className="custom-menu">
            <button type="button" id="sidebarCollapse" className="btn btn-primary">
              <i className="bi bi-justify"></i>
              <span className="sr-only">Toggle Menu</span>
            </button>
          </div>
          <div className="p-4 pt-5">
            <h1><a href="/admin" className="logo">College Portal</a></h1>
            <ul className="list-unstyled components mb-5">
              <li>
                <Link to={"/admin/usertype"} className="nav-link active" aria-current="page">User Type</Link>
              </li>
              <li>
                <Link to="/admin/courses" className="nav-link" aria-current="page">Department</Link>
              </li>
              <li>
                <Link to={'/admin/subjects'} className="nav-link" aria-current="page">Subject</Link>
              </li>
              <li>
                <Link to={'/admin/teachers'} className="nav-link" aria-current="page">Teacher</Link>
              </li>
              <li>
                <Link to={'/admin/adminNotice'} className="nav-link" aria-current="page">Admin Notice</Link>
              </li>
              <li>
                <a href='**' onClick={handleLogout} className="nav-link" aria-current="page">Logout</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
