import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainContext } from "../context/CaptainContext";

const CaptainProtectedWrapper = ({ children }) => {
    const navigate = useNavigate();
    const { setCaptain } = useContext(CaptainContext);

    useEffect(() => {
        const verifyCaptain = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/CaptainLogin");
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/captains/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setCaptain(response.data);
                }
            } catch (error) {
                console.error("Captain Protection Error:", error);
                localStorage.removeItem("token");
                navigate("/CaptainLogin");
            }
        };

        verifyCaptain();
    }, [navigate, setCaptain]);

    return children;
};

export default CaptainProtectedWrapper;