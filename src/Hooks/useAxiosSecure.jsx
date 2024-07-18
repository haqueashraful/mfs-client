import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const axiosSecure = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true,
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOutUser } = useAuth();

    axiosSecure.interceptors.response.use(
        (response) => response,
        async (error) => {
            const status = error.response?.status;

            if (status === 403 || status === 401) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Unauthorized or forbidden request",
                    showConfirmButton: false,
                    timer: 1500,
                })
                await logOutUser();
                navigate("/login"); 
            }

            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;
