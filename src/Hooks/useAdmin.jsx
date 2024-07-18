import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth()
    const {data: isAdmin, isPending } = useQuery({
        queryKey: ['idAdmin', user?.email],
        queryFn: async () =>{
           const res = await axiosSecure.get(`/users/admin/${user?.email}`)
           return res.data.isAdmin
        }
    })
    return [isAdmin, isPending]

};

export default useAdmin;