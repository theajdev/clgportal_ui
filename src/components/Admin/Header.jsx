import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import "../../sidebar/sidebar.css";
import Footer from '../Footer';
import useBootstrapTheme from '../../hooks/useBootstrapTheme';
import { isLoggedIn, doLogout } from '../../services/auth';
import userContext from '../../context/userContext';
const Header = () => {
    const { storedTheme, resolvedTheme } = useBootstrapTheme();
    const [login, setLogin] = useState(false);
    const userContextData = useContext(userContext);
    const location = useLocation();
    const isAuth = isLoggedIn();
    const username = sessionStorage.getItem("authenticatedUser");
    const userRole = sessionStorage.getItem("userRole");
    const [isSidebarActive, setSidebarActive] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
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

    const toggleSidebar = () => {
        setSidebarActive(!isSidebarActive);
        setIsFlipped(!isFlipped); // toggle flip
    };

    return (
        <>
            {/* Icons */}
            <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
                <symbol id="check2" viewBox="0 0 16 16">
                    <path
                        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z">
                    </path>
                </symbol>
                <symbol id="circle-half" viewBox="0 0 16 16">
                    <path
                        d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5M12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25">
                    </path>
                </symbol>
                <symbol id="moon-stars-fill" viewBox="0 0 16 16">
                    <path
                        d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z">
                    </path>
                    <path
                        d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z">
                    </path>
                </symbol>
                <symbol id="sun-fill" viewBox="0 0 16 16">
                    <path
                        d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z">
                    </path>
                </symbol>
            </svg>
            {/* Icons */}

            {/* start of navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bd-navbar fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="##" onClick={(e) => { e.preventDefault(); toggleSidebar(); }}><i className={`bi bi-mortarboard-fill fs-3 me-3 ms-2 ${isFlipped ? 'flipped' : ''}`}></i><span className='fw-bold'>College Portal</span></a>

                    {/* Theme Switcher Dropdown */}
                    <div className="navbar navbar-expand-lg">
                        <div className='dropdown bd-mode-toggle ms-auto d-flex'>

                            <button className="btn py-2 dropdown-toggle d-flex align-items-center data-mdb-dropdown-init data-mdb-ripple-init btn-link" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (auto)" >
                                <svg className="bi my-1 theme-icon-active text-white" aria-hidden="true" fill='currentColor'>
                                    <use
                                        href={
                                            storedTheme === "light"
                                                ? "#sun-fill"
                                                : storedTheme === "dark"
                                                    ? "#moon-stars-fill"
                                                    : "#circle-half"
                                        }
                                    ></use>
                                </svg>
                                <span className="visually-hidden" id="bd-theme-text">Toggle theme</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
                                <li>
                                    <button type="button" className={`dropdown-item d-flex align-items-center  ${storedTheme === "light" ? 'text-bg-primary' : ''}`} data-mdb-theme-value="light" aria-pressed="false" >
                                        <svg className="bi me-2" aria-hidden="true" fill='currentColor'>
                                            <use href="#sun-fill"></use>
                                        </svg>
                                        Light

                                        <svg className={`bi ms-auto ${storedTheme === "light" ? '' : 'd-none'}`} aria-hidden="true">
                                            <use href="#check2"></use>
                                        </svg>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className={`dropdown-item d-flex align-items-center ${storedTheme === "dark" ? 'text-bg-primary' : ''}`} data-mdb-theme-value="dark" aria-pressed="false">
                                        <svg className="bi me-2" aria-hidden="true" fill='currentColor'>
                                            <use href="#moon-stars-fill"></use>
                                        </svg>
                                        Dark
                                        <svg className={`bi ms-auto ${storedTheme === "dark" ? '' : 'd-none'}`} aria-hidden="true">
                                            <use href="#check2"></use>
                                        </svg>
                                    </button>
                                </li>

                                <li>
                                    <button type="button" className={`dropdown-item d-flex align-items-center  ${storedTheme === "auto" ? 'text-bg-primary' : ''}`} data-mdb-theme-value="auto" aria-pressed="true">
                                        <svg className="bi me-2" aria-hidden="true" fill='currentColor'>
                                            <use href="#circle-half"></use>
                                        </svg>
                                        System
                                        <svg className={`bi ms-auto ${storedTheme === "auto" ? '' : 'd-none'}`} aria-hidden="true">
                                            <use href="#check2"></use>
                                        </svg>
                                    </button>
                                </li>

                            </ul>
                            <span className='nav-item py-2 py-lg-1 col-lg-auto'>
                                <div className="vr vr-blurry d-lg-flex h-100 mx-lg-2 text-white"></div>
                                <hr className="my-2 text-white-50" /></span>
                            <a className="btn dropdown-toggle data-mdb-dropdown-init data-mdb-ripple-init btn-link" href="##" role="button" id="logoutMenu" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="/default.png" alt="Avatar Logo" width='30px' className="rounded-pill" />
                            </a>

                            {isAuth && (
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="logoutMenu">
                                    <li><button type="button" className="dropdown-item d-flex align-items-center text-bg-primary" href="##" onClick={(e) => { e.preventDefault(); }}><i className="bi bi-person-circle ms-2 me-2 fs-6 fw-bold"></i> {username}</button></li>
                                    <li><button type="button" className="dropdown-item" href="##" onClick={handleLogout}> <i className="bi bi-box-arrow-right ms-2 me-2 fs-6 text-danger fw-bold"></i>Logout</button></li>

                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </nav >

            {/* end of navbar */}

            {/* -- start of Sidebar -- */}
            <aside className={`sidebar mt-2 ${isSidebarActive ? 'collapsed' : ''}`} id="sidebar">
                <div className="sidebar-heading">Menu</div>
                <ul className="list-unstyled components mb-5">
                    {/* Admin Sidebar */}
                    {userRole === 'ADMIN' && (
                        <>
                            <li>
                                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} ><i className="bi bi-house-door-fill fw-bold"></i><span>Dashboard</span></Link>
                            </li>

                            <li>
                                <Link to="/admin/usertype" className={`nav-link ${location.pathname === '/admin/usertype' ? 'active' : ''}`} ><i className="bi bi-person-circle fw-bold"></i><span>User Role</span></Link>
                            </li>
                            <li>
                                <Link to="/admin/courses" className={`nav-link ${location.pathname === '/admin/courses' ? 'active' : ''}`} ><i className="bi bi-book-half fw-bold"></i><span>Courses</span></Link>
                            </li>
                            <li>
                                <Link to="/admin/teachers" className={`nav-link ${location.pathname === '/admin/teachers' ? 'active' : ''}`} ><i className="bi bi-person-video3 fw-bold"></i><span>Teacher</span></Link>
                            </li>
                            <li>
                                <Link to="/admin/adminNotice" className={`nav-link ${location.pathname === '/admin/adminNotice' ? 'active' : ''}`} ><i className="bi bi-megaphone-fill fw-bold"></i><span>Admin Notice</span></Link>
                            </li>
                        </>
                    )}

                    {/* Teacher Sidebar */}
                    {userRole === 'TEACHER' && (
                        <>

                            <li>
                                <Link to="/teacher" className={`nav-link ${location.pathname === '/teacher' ? 'active' : ''}`}><i className="bi bi-person-square fw-bold"></i><span>Profile</span></Link>
                            </li>
                            <li>
                                <Link to="/teacher/managestudents" className={`nav-link ${location.pathname === '/teacher/managestudents' ? 'active' : ''}`}><i className="bi bi-person-fill-gear fw-bold"></i><span>Manage Students</span></Link>
                            </li>
                            <li>
                                <Link to="/teacher/deptnotice" className={`nav-link ${location.pathname === '/teacher/deptnotice' ? 'active' : ''}`}><i className="bi bi-buildings-fill fw-bold"></i><span>Department Notice</span></Link>
                            </li>
                            <li>
                                <Link to="/teacher/guardiannotice" className={`nav-link ${location.pathname === '/teacher/guardiannotice' ? 'active' : ''}`}><i className="bi bi-chat-left-text-fill fw-bold"></i><span>Guardian Notice</span></Link>
                            </li>
                        </>
                    )}

                    {/* Student Sidebar */}
                    {userRole === 'STUDENT' && (
                        <>
                            <li>
                                <Link to="/student/profile" className={`nav-link ${location.pathname === '/student/profile' ? 'active' : ''}`}><i className="bi bi-person-square fw-bold"></i><span>Profile</span></Link>
                            </li>
                            <li>
                                <Link to="/student/teachernotice" className={`nav-link ${location.pathname === '/student/teachernotice' ? 'active' : ''}`}><i className="bi bi-eye-fill fw-bold"></i><span>Teacher Notice</span></Link>
                            </li>
                            <li>
                                <Link to="/student/feedback" className={`nav-link ${location.pathname === '/student/feedback' ? 'active' : ''}`}><i className="bi bi-pen fw-bold"></i><span>Feedback</span></Link>
                            </li>

                        </>
                    )}
                </ul>

            </aside>
            {/* -- end of Sidebar -- */}

            {/* start of main content */}
            <main className={`main-content mt-5 tab-content ${isSidebarActive ? 'collapsed' : ''}`} id="mainContent">
                <div className="container-fluid ps-5">
                    <Outlet />
                </div>
            </main>
            {/* end of main content */}
            <Footer />
        </>
    )
}

export default Header