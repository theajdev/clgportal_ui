import React, { useEffect, useState } from 'react'
import { loginAPICall, saveLoggedInUsers, storeToken } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    let [showLable, setShowLable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);  // State for loading
    const navigator = useNavigate();

    useEffect(() => {
        setShowLable(true);
        loadFunction(setShowLable);
    }, []);


    function loadFunction(data) {
        let element = document.getElementById("hideSpan");

        if (data === true) {
            element.setAttribute("hidden", "hidden");
        } else {
            element.removeAttribute("hidden");
        }
    }


    const handleLoginForm = (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        loginAPICall(username, password).then(response => {

            const token = "Bearer " + response.data.accessToken;
            storeToken(token);
            saveLoggedInUsers(username);
            const auth = response.data.authority;

            if (auth === "ROLE_ADMIN") {
                navigator("/admin");
                window.location.reload(false);
            } else if (auth === "ROLE_TEACHER") {
                navigator("/teacher");
                window.location.reload(false);
            } else {
                navigator("/student");
                window.location.reload(false);
            }



        }).catch((error) => {
            setShowLable(true);
            loadFunction(setShowLable);
        }).finally(() => {
            setIsLoading(false); // Stop loading
        });

    }
    return (
        <div className='container-fluid'>
            <div className='row'>
                <span id="hideSpan" className="text-white w-100" style={{ 'backgroundColor': '#f63d4d', 'textAlign': 'center', 'height': '50px' }} hidden={showLable}>Login failed, please try again</span>
                <div className='col-md-6 mx-auto mt-5'>
                    <div className="card">
                        <div className="card-body">
                            <div className='App-login' disabled={isLoading}>
                                <div><img src="./cap.png" alt="login"></img></div>
                                <form className='login-form' style={{ 'width': '75%' }}>
                                    <div className="mb-3 form-group">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" id="username" aria-describedby="emailHelp" value={username} onChange={e => setUserName(e.target.value)} disabled={isLoading} />

                                    </div>
                                    <div className="mb-3 form-group">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
                                    </div>
                                    <div className="mb-3 form-group mt-4">
                                        <button type="submit" className="btn btn-primary" onClick={e => handleLoginForm(e)} disabled={isLoading} style={{ 'width': '100%', 'backgroundColor': '#2105c6bd' }}> {isLoading ? "Logging in..." : "Sign In"}</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;