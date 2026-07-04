import { createContext, useState } from "react";

export const CaptainContext = createContext();

const CaptainContextProvider = ({ children }) => {

    const [captain, setCaptain] = useState({
        fullname: {
            firstname: "",
            lastname: "",
        },
        email: "",
        vehicle: {
            color: "",
            plate: "",
            capacity: "",
            vehicleType: "",
        },
    });

    return (
        <CaptainContext.Provider
            value={{
                captain,
                setCaptain,
            }}
        >
            {children}
        </CaptainContext.Provider>
    );
};

export default CaptainContextProvider;