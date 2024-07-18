import { useContext } from "react";
import { Context } from "../Context/MyContext";

const useAuth = () => {
  return useContext(Context);  // Ensure the context is correctly referenced
};

export default useAuth;
