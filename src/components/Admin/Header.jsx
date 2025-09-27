import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import Footer from '../Footer';
import useBootstrapTheme from '../../hooks/useBootstrapTheme';
import { isLoggedIn, doLogout } from '../../services/auth';
import userContext from '../../context/userContext';
const Header = () => {
    useBootstrapTheme();
    const [login, setLogin] = useState(false);
    const userContextData = useContext(userContext);
    const location = useLocation();
    const isAuth = isLoggedIn();
    const username = sessionStorage.getItem("authenticatedUser");
    const userRole = sessionStorage.getItem("userRole");
    const homeURL = sessionStorage.getItem("homeURL");
    const [isSidebarActive, setSidebarActive] = useState(false);
    const navigator = useNavigate();

    useEffect(() => {

        setLogin(isLoggedIn());

    }, []);

    const handleLogout = () => {
        doLogout(() => {
            //logged out
            setLogin(false);
            localStorage.clear();
            sessionStorage.clear();
            navigator("/");
            userContextData.setUser({
                data: null,
                login: false,
            });
        });
    };

    const handleRipple = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();

        // Remove any old ripple
        document.querySelectorAll('.global-ripple').forEach(el => el.remove());

        const circle = document.createElement('span');
        circle.classList.add('global-ripple');

        const size = Math.max(rect.width, rect.height);
        circle.style.width = circle.style.height = `${size}px`;
        circle.style.left = `${e.clientX - size / 2}px`;
        circle.style.top = `${e.clientY - size / 2}px`;

        document.body.appendChild(circle);

        circle.addEventListener('animationend', () => {
            circle.remove();
        });
    };

    return (
        <div className="wrapper d-flex align-items-stretch">
            <nav id="sidebar" className={`nav-sidebar navbar-brand ${isSidebarActive ? "active" : ""}`}>
                <div className="custom-menu">
                    <button
                        type="button"
                        id="sidebarCollapse"
                        className="btns btns-sideBtn"
                        onClick={() => setSidebarActive(!isSidebarActive)}
                    >
                        <i className="bi bi-justify" style={{ color: "white" }}></i>
                        <span className="sr-only">Toggle Menu</span>
                    </button>
                </div>

                <div className="p-4">
                    <h1>
                        <a href={`${homeURL}`} className="logo">College Portal</a>
                    </h1>

                    <ul className="list-unstyled components mb-5">
                        {/* Admin Sidebar */}
                        {userRole === 'ADMIN' && (
                            <>

                                <li>
                                    <Link to="/admin/usertype" id="sidebarCollapse" className={`btns-sideBtn nav-link ${location.pathname === '/admin/usertype' ? 'active' : ''}`} >User Type</Link>
                                </li>
                                <li>
                                    <Link to="/admin/courses" className={`nav-link ${location.pathname === '/admin/courses' ? 'active' : ''}`} >Department</Link>
                                </li>
                                <li>
                                    <Link to="/admin/teachers" className={`nav-link ${location.pathname === '/admin/teachers' ? 'active' : ''}`} >Teacher</Link>
                                </li>
                                <li>
                                    <Link to="/admin/adminNotice" className={`nav-link ${location.pathname === '/admin/adminNotice' ? 'active' : ''}`} >Admin Notice</Link>
                                </li>
                            </>
                        )}

                        {/* Teacher Sidebar */}
                        {userRole === 'TEACHER' && (
                            <>
                                <li>
                                    <Link to="/teacher/profile" className={`nav-link ${location.pathname === '/teacher/TeacherProfile' ? 'active' : ''}`}>Profile</Link>
                                </li>
                                <li>
                                    <Link to="/teacher/managestudents" className={`nav-link ${location.pathname === '/teacher/ManageCourses' ? 'active' : ''}`}>Manage Students</Link>
                                </li>
                                <li>
                                    <Link to="/teacher/deptnotice" className={`nav-link ${location.pathname === '/teacher/DepartmentNotice' ? 'active' : ''}`}>Department Notice</Link>
                                </li>
                                <li>
                                    <Link to="/teacher/guardiannotice" className={`nav-link ${location.pathname === '/teacher/GuardianNotice' ? 'active' : ''}`}>Guardian Notice</Link>
                                </li>
                            </>
                        )}

                        {/* Student Sidebar */}
                        {userRole === 'STUDENT' && (
                            <>
                                <li>
                                    <Link to="/student/profile" className={`nav-link ${location.pathname === '/student/StudentProfile' ? 'active' : ''}`}>Profile</Link>
                                </li>
                                <li>
                                    <Link to="/student/teachernotice" className={`nav-link ${location.pathname === '/student/TeacherNotice' ? 'active' : ''}`}>Teacher Notice</Link>
                                </li>
                                <li>
                                    <Link to="/student/feedback" className={`nav-link ${location.pathname === '/student/FeedBack' ? 'active' : ''}`}>Feedback</Link>
                                </li>

                            </>
                        )}
                    </ul>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow-1">
                {/* Top Navbar */}
                <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
                    <symbol id="check2" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"></path>
                    </symbol>
                    <symbol id="circle-half" viewBox="0 0 16 16">
                        <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5M12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25"></path>
                    </symbol>
                    <symbol id="moon-stars-fill" viewBox="0 0 16 16">
                        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
                        <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
                    </symbol>
                    <symbol id="sun-fill" viewBox="0 0 16 16">
                        <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"></path>
                    </symbol>
                </svg>
                <div className="navbar navbar-expand-lg bg-purple">
                    <div className='dropdown bd-mode-toggle ms-auto d-flex'>

                        <button className="btn py-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (auto)" onClick={e => handleRipple(e)}>
                            <svg className="bi my-1 theme-icon-active text-white" aria-hidden="true" fill='currentColor'>
                                <use href="#circle-half"></use>
                            </svg>
                            <span className="visually-hidden" id="bd-theme-text">Toggle theme</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
                            <li>
                                <button type="button" className="dropdown-item d-flex align-items-center" data-mdb-theme-value="light" aria-pressed="false">
                                    <svg className="bi me-2" aria-hidden="true" fill='currentColor'>
                                        <use href="#sun-fill"></use>
                                    </svg>
                                    Light

                                    <svg className="bi ms-auto d-none" aria-hidden="true">
                                        <use href="#check2"></use>
                                    </svg>
                                </button>
                            </li>
                            <li>
                                <button type="button" className="dropdown-item d-flex align-items-center" data-mdb-theme-value="dark" aria-pressed="false">
                                    <svg className="bi me-2" aria-hidden="true" fill='currentColor'>
                                        <use href="#moon-stars-fill"></use>
                                    </svg>
                                    Dark
                                    <svg className="bi ms-auto d-none" aria-hidden="true">
                                        <use href="#check2"></use>
                                    </svg>
                                </button>
                            </li>

                            <li>
                                <button type="button" className="dropdown-item d-flex align-items-center active" data-mdb-theme-value="auto" aria-pressed="true">
                                    <svg className="bi me-2" aria-hidden="true" fill='currentColor'>
                                        <use href="#circle-half"></use>
                                    </svg>
                                    System
                                    <svg className="bi ms-auto d-none" aria-hidden="true">
                                        <use href="#check2"></use>
                                    </svg>
                                </button>
                            </li>
                        </ul>

                        <a className="btn dropdown-toggle" href="##" role="button" id="logoutMenu" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="/default.png" alt="Avatar Logo" width='30px' className="rounded-pill" />
                        </a>

                        {isAuth && (
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="logoutMenu">
                                <li className='nav-item dropdown'>
                                    <button type="button" className="dropdown-item active">{username}</button>
                                    <button type="button" className="dropdown-item" onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="container-fluid ps-5">
                    <Outlet />
                </div>

                <Footer />
            </main >
        </div >
    )
}

export default Header