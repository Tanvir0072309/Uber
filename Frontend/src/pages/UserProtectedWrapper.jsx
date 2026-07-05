import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const UserProtectedWrapper = ({ children }) => {

    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    useEffect(() => {

        const verifyUser = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/UserLogin");
                return;
            }

            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setUser(response.data);
                }

            } catch (error) {

                localStorage.removeItem("token");
                navigate("/UserLogin");

            }
        };

        verifyUser();

    }, [navigate, setUser]);

    return children;
};

export default UserProtectedWrapper;