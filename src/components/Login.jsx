import React, { useContext, useState } from 'react'
import { loginUser } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import './signin.css';
import useBootstrapTheme from '../hooks/useBootstrapTheme';
import { doLogin, isLoggedIn } from '../services/auth';
import userContext from '../context/userContext';
import { ToastContainer, toast } from 'react-toastify';
const Login = () => {
    useBootstrapTheme();

    const userContextData = useContext(userContext);
    const [loginDetails, setLoginDetails] = useState({
        usernameOrEmail: "",
        password: "",
    });

    const [validation, setValidation] = useState({
        usernameOrEmail: false,
        password: false,
    });

    const validateFields = () => {
        const errors = {};

        if (!loginDetails.usernameOrEmail.trim()) { errors.usernameOrEmail = true; }
        if (!loginDetails.password.trim()) { errors.password = true; }


        setValidation(prev => ({ ...prev, ...errors }));

        return Object.keys(errors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;


        setLoginDetails({ ...loginDetails, [event.target.name]: event.target.value });

        setLoginDetails(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when the user starts typing
        setValidation(prev => ({
            ...prev,
            [name]: false
        }));
    };


    const [isLoading, setIsLoading] = useState(false);  // State htmlFor loading
    const navigator = useNavigate();

    const handleLoginForm = (e) => {
        e.preventDefault();
        if (!validateFields()) return;
        //console.log("Hey: " + JSON.stringify(loginDetails));

        setIsLoading(true); // Start loading

        loginUser(loginDetails).then((data) => {
            doLogin(data, () => {

                const auth = data.user.type;
                sessionStorage.setItem("authenticatedUser", data.user.name);
                sessionStorage.setItem("userRole", auth);
                userContextData.setUser({
                    data: JSON.stringify(data.user),
                    login: true
                });

                const isAuth = isLoggedIn();
                if (isAuth) {
                    toast.success("Login Success.", {
                        position: 'bottom-center',
                        autoClose: 1200,
                    });
                }
                setTimeout(() => {
                    if (auth === "ADMIN") {
                        sessionStorage.setItem("homeURL", "/admin");
                        navigator("/admin");
                        window.location.reload(false);
                    } else if (auth === "TEACHER") {
                        sessionStorage.setItem("homeURL", "/teacher");
                        navigator("/teacher");
                        window.location.reload(false);
                    } else if (auth === "STUDENT") {
                        sessionStorage.setItem("homeURL", "/student");
                        navigator("/student");
                        window.location.reload(false);
                    }
                }, 1300);
            }); // Adjust delay as needed


        }).catch((error) => {
            console.log(error);
            toast.error("Login Failed! Please check your credentials.", {
                position: "bottom-center",
                autoClose: 1400,
            })
        }).finally(() => {
            setIsLoading(false); // Stop loading
        });
    }

    // Handle ripple effect on button click
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
        <div className='container-fluid'>
            <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
                <symbol id="check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"></path>
                </symbol>
                <symbol id="circle-half" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"></path>
                </symbol>
                <symbol id="moon-stars-fill" viewBox="0 0 16 16">
                    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
                    <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
                </symbol>
                <symbol id="sun-fill" viewBox="0 0 16 16">
                    <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"></path>
                </symbol>
            </svg>
            <div className='row'>
                <ToastContainer />
                <div className='col-md-6 mx-auto mt-5'>
                    <div className='App-login' disabled={isLoading}>

                        <div className="dropdown position-fixed mb-3 me-3 bd-mode-toggle">
                            <button className="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (auto)" onClick={e => { handleRipple(e); }}>
                                <svg className="bi my-1 theme-icon-active" aria-hidden="true">
                                    <use href="#circle-half"></use>
                                </svg>
                                <span className="visually-hidden" id="bd-theme-text">Toggle theme</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
                                <li>
                                    <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
                                        <svg className="bi me-2 opacity-50" aria-hidden="true">
                                            <use href="#sun-fill"></use>
                                        </svg>
                                        Light

                                        <svg className="bi ms-auto d-none" aria-hidden="true">
                                            <use href="#check2"></use>
                                        </svg>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
                                        <svg className="bi me-2 opacity-50" aria-hidden="true">
                                            <use href="#moon-stars-fill"></use>
                                        </svg>
                                        Dark

                                        <svg className="bi ms-auto d-none" aria-hidden="true">
                                            <use href="#check2"></use>
                                        </svg>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto" aria-pressed="true">
                                        <svg className="bi me-2 opacity-50" aria-hidden="true">
                                            <use href="#circle-half"></use>
                                        </svg>
                                        Auto

                                        <svg className="bi ms-auto d-none" aria-hidden="true">
                                            <use href="#check2"></use>
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className='my-3 p-3 bg-body rounded shadow-sm'>
                            <main className='form-signin w-100 mx-auto'>
                                <form className='login-form'>
                                    <img src="./cap.png" alt="login" width="72" height="57" className='mb-4'></img>
                                    <h1 className="h3 mb-3 fw-normal">Please Sign In</h1>
                                    <div className="form-floating position-relative">
                                        <input type="email" className={`form-control mb-3 ${validation.usernameOrEmail ? 'ripple-invalid' : ''}`} name="usernameOrEmail" id="usernameOrEmail" aria-describedby="emailHelp" value={loginDetails.usernameOrEmail} onChange={handleChange} disabled={isLoading} placeholder="name@example.com" />
                                        <label htmlFor="usernameOrEmail">Email Or Username</label>
                                    </div>
                                    <div className="form-floating position-relative">
                                        <input type="password" className={`form-control mb-3 ${validation.password ? 'ripple-invalid' : ''}`} name="password" id="password" value={loginDetails.password} onChange={handleChange} disabled={isLoading} placeholder='Password' />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                    <div className="form-check text-start my-3"> <input className="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
                                        <label className="form-check-label" htmlFor="checkDefault" >
                                            Remember me
                                        </label> </div>
                                    <div className="ripple-container">
                                        <button type="submit" className="btn btn-bd-primary w-100 py-2" onClick={e => { handleRipple(e); handleLoginForm(e); }} disabled={isLoading} style={{ 'width': '100%' }}> {isLoading ? "Loggin In..." : "Sign In"}</button>
                                    </div>
                                </form>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Login;