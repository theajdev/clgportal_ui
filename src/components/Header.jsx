import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { isUserLoggedIn, logout } from '../services/AuthService';
function Header() {
  const isAuth = isUserLoggedIn();
  const username = sessionStorage.getItem("authenticatedUser");
  console.log(username);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [activeTheme, setActiveTheme] = useState("light");
  const navigator = useNavigate();
  function handleLogout() {
    logout();
    navigator("/");
  }

  const getDarkTheme = (event) => {

    const clickedClass = event.target.className; // Get class name of the clicked element

    if (clickedClass.includes("btn-dark")) {
      setActiveTheme("dark");
      setIsLightTheme(true);
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem("theme", "dark"); // Save theme to localStorage
    } else {
      setActiveTheme("light");
      setIsLightTheme(false);
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem("theme", "light"); // Save theme to localStorage
    }
  };

  const navbarToggle = (e) => {
    alert("Hello: " + e._reactName);
    console.log(e);
  }



  return (
    <nav className="navbar navbar-expand-lg bg-purple" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999 }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="">College Portal</Link>
        {
          isAuth &&
          <button type="button" className="btn btn-outline-dark btn-sm ms-5" onClick={(e) => navbarToggle(e)}><i className="bi bi-list"></i></button>
        }

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {
              !isAuth &&
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? 'fw-bold' : ''}`
                  }
                  to="/register"
                >
                  Register
                </NavLink>

              </li>
            }


            <li className="nav-item py-2 py-lg-1 col-12 col-lg-auto">
              <div className="vr d-none d-lg-flex h-100 mx-lg-2 text-white"></div>
              <hr className="d-lg-none my-2 text-white-50" />
            </li>
            <li className="nav-item dropdown">
              <NavLink className="nav-link dropdown-toggle text-white" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-popper="static">
                {isLightTheme ? (
                  <i className="bi bi-moon-stars-fill"></i>
                ) : (
                  <i className="bi bi-brightness-high"></i>
                )}
              </NavLink>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className={`dropdown-item d-flex align-items-center btn-dark ${activeTheme === "dark" ? "active" : ""
                  }`} href="###" onClick={getDarkTheme}><i className="bi bi-moon-stars-fill me-2 opacity-50"></i>Dark</a></li>
                <li><a className={`dropdown-item d-flex align-items-center btn-light ${activeTheme === "light" ? "active" : ""
                  }`} href="###" onClick={getDarkTheme}><i className="bi bi-brightness-high me-2 opacity-50"></i>Light</a></li>

              </ul>

            </li>
            <li className="nav-item py-2 py-lg-1 col-12 col-lg-auto">
              <div className="vr d-none d-lg-flex h-100 mx-lg-2 text-white"></div>
              <hr className="d-lg-none my-2 text-white-50" />
            </li>
            {
              isAuth &&


              <li className='nav-item dropdown'>
                <NavLink to="##" className="nav-link text-white dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ height: '20px;' }}>
                  <img src="/default.png" alt="Avatar Logo" width='40px;' className="rounded-pill" />
                </NavLink>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li className='nav-item dropdown'>
                    <a href="###" className="dropdown-item d-flex align-items-center active">{username}</a>
                    <a href="##" className="dropdown-item  d-flex align-items-center" onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
              </li>
            }
          </ul>

        </div>
      </div>
    </nav>
  )
}

export default Header;  