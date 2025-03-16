import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from '../Footer';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    
    <div className="wrapper d-flex align-items-stretch">
      <nav id="sidebar" className="nav-sidebar">
        <div className="custom-menu">
          <button type="button" id="sidebarCollapse" className="btn btn-sideBtn">
            <i className="bi bi-justify"></i>
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
        <div className="p-4">
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
          </ul>
        </div>
      </nav>
      <main className="flex-grow-1">
      {location.pathname !== '/admin' && <Outlet />}

      {location.pathname === '/admin' && 
      
      <div className='ms-4'>
      <Header />
      <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3 mt-4'>
          <div className="card border-primary mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-primary">
              <h5 className="card-title">Primary card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
        <div className='col-md-3 mt-4'>
          <div className="card border-secondary mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-secondary">
              <h5 className="card-title">Secondary card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
        <div className='col-md-3 mt-4'>
          <div className="card border-success mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-success">
              <h5 className="card-title">Success card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
        <div className='col-md-3 mt-4'>
          <div className="card border-danger mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-danger">
              <h5 className="card-title">Danger card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
      </div >
      </div>
    </div>
      
      }
      <Footer />
      </main>
      
    </div >
    
  );
};

export default AdminDashboard;
