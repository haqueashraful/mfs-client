import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUser = () => {
    const {user} = useAuth();
    const axiiosSecure = useAxiosSecure();

    const {data : userData , refetch, isPending} = useQuery({
        queryKey: ["user", user?.email],
        queryFn: async () => {
            const res = await axiiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    })
    return [userData, refetch, isPending]
};

export default useUser;