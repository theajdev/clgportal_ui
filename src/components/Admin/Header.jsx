import React, { useState } from 'react'
import { isUserLoggedIn, logout } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const Header = () => {

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

    return (

        <nav className="navbar navbar-expand-lg bg-purple" style={{ 'backgroundColor': '#0000' }}>
            <div className='dropdown ms-auto'>
                <a className="btn dropdown-toggle me-auto" href="##" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    {isLightTheme ? (
                        <i className="bi bi-moon-stars-fill"></i>
                    ) : (
                        <i className="text-primary bi bi-brightness-high"></i>
                    )}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
                    <li><a className={`dropdown-item d-flex align-items-center btn-dark ${activeTheme === "dark" ? "active" : ""
                        }`} href="###" onClick={getDarkTheme}><i className="bi bi-moon-stars-fill me-2 opacity-50"></i>Dark</a></li>
                    <li><a className={`dropdown-item d-flex align-items-center btn-light ${activeTheme === "light" ? "active" : ""
                        }`} href="###" onClick={getDarkTheme}><i className="bi bi-brightness-high me-2 opacity-50"></i>Light</a></li>
                </ul>
                <a className="btn dropdown-toggle me-auto" href="##" role="button" id="logoutMenu" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="/default.png" alt="Avatar Logo" width='30px;' className="rounded-pill" />
                </a>
                {
                    isAuth &&


                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="logoutMenu">
                        <li className='nav-item dropdown'>
                            <a href="###" className="dropdown-item d-flex align-items-center active">{username}</a>
                            <a href="##" className="dropdown-item  d-flex align-items-center" onClick={handleLogout}>Logout</a>
                        </li>
                    </ul>
                }

            </div>


        </nav>

    )
}

export default Header