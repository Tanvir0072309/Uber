import { createContext, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState({
        fullname: {
            firstname: "",
            lastname: "",
        },
        email: "",
    });

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;