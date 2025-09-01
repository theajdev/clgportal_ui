import { useEffect, useState } from "react";
import { getCurrentUserDetail, isLoggedIn } from "../services/auth";
import userContext from "./userContext";
const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        data: {},
        login: false,
    });

    useEffect(() => {
        setUser({
            data: getCurrentUserDetail(),
            login: isLoggedIn(),
        });
    }, []);

    return (
        <userContext.Provider value={{ user, setUser }}>
            {children}
        </userContext.Provider>
    );
}
export default UserProvider;