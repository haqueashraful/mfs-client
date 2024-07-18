import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SocialLogin from "../Components/SocialLogin";
import { Select, Button } from "antd";
import img from "../assets/register.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../Components/Loading";

const Register = () => {
  const { registerUser, profileUpdate, loader, setLoader } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const photo = watch("photo");

  const handleRegister = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imgBBResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_KEY}`,
        formData
      );
      const imageUrl = imgBBResponse.data.data.url;
      await registerUser(data.email, data.password).then((result) => {
        setLoader(false);
      });
      await profileUpdate(data.name, imageUrl);

      await axiosPublic
        .post("/users", {
          name: data.name,
          email: data.email,
          bank_account_no: data.bankAccountNo,
          salary: data.salary,
          role: data.role,
          designation: data.designation,
          photo: imageUrl,
        })
        .then((res) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "User created successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/");
        });
    } catch (error) {
      console.error("Error registering user:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error creating user",
        showConfirmButton: true,
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full min-h-screen p-5 lg:p-28 overflow-hidden">
      <div className="border-2 border-black shadow-2xl w-full h-full overflow-hidden py-8 px-5 lg:px-20 grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-8">
        <div>
          <img className="" src={img} alt="" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-center">Register</h1>
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-lg" htmlFor="name">
                Name
              </label>
              <input
                {...register("name", { required: true })}
                id="name"
                placeholder="Name"
                className="w-full p-2 border rounded-md"
              />
              {errors.name && (
                <span className="text-red-600">Name is required</span>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block text-lg" htmlFor="photo">
                Photo
              </label>
              <input
                {...register("photo", { required: true })}
                type="file"
                id="photo"
                className="w-full p-2 border rounded-md"
              />
              {errors.photo && (
                <span className="text-red-600">Photo is required</span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg" htmlFor="email">
                Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                id="email"
                placeholder="Email"
                className="w-full p-2 border rounded-md"
              />
              {errors.email && (
                <span className="text-red-600">Email is required</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-lg" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                      message:
                        "Password must include a capital letter and a special character",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  className="w-full p-2 border rounded-md"
                />
                <span
                  onClick={toggleShowPassword}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
              )}
            </div>

            {/* Bank Account Number */}
            <div>
              <label className="block text-lg" htmlFor="bankAccountNo">
                Bank Account Number
              </label>
              <input
                {...register("bankAccountNo", { required: true })}
                id="bankAccountNo"
                placeholder="Bank Account Number"
                className="w-full p-2 border rounded-md"
              />
              {errors.bankAccountNo && (
                <span className="text-red-600">
                  Bank Account Number is required
                </span>
              )}
            </div>

            {/* salary */}
            <div>
              <label className="block text-lg" htmlFor="salary">
                Salary
              </label>
              <input
                type="number"
                {...register("salary", {
                  required: "Salary is required",
                  min: { value: 99, message: "Salary must be at least 99" },
                  max: {
                    value: 999,
                    message: "Salary cannot be greater than 999",
                  },
                })}
                id="salary"
                placeholder="Salary"
                className="w-full p-2 border rounded-md"
              />
              {errors.salary && (
                <span className="text-red-600">{errors.salary.message}</span>
              )}
            </div>

            {/* role */}
            <div>
              <label className="block text-lg" htmlFor="role">
                Role
              </label>
              <select
                value={watch("role")}
                onChange={(value) => setValue("role", value)}
                id="role"
                placeholder="Select Role"
                className="w-full p-2 border rounded-md"
                {...register("role", { required: true })}
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
              </select>
              {errors.role && (
                <span className="text-red-600">Role is required</span>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-lg" htmlFor="designation">
                Designation
              </label>
              <select
                value={watch("designation")}
                onChange={(value) => setValue("designation", value)}
                id="designation"
                placeholder="Select Designation"
                className="w-full p-2 border rounded-md"
                {...register("designation", { required: true })}
              >
                <option value="Sales Assistant">Sales Assistant</option>
                <option value="Social Media Executive">
                  Social Media Executive
                </option>
                <option value="Digital Marketer">Digital Marketer</option>
                {/* Add more options as necessary */}
              </select>
              {errors.designation && (
                <span className="text-red-600">Designation is required</span>
              )}
            </div>

            <div className="text-center">
              <Button
                className="!bg-blue-700/50 !text-white"
                type="primary"
                htmlType="submit"
              >
                {/* Register */}
                {loader ? <Loading /> : "Register"}
              </Button>
            </div>
          </form>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 underline">
              Login
            </Link>
          </p>

          <div className="text-center my-4 space-y-4">
            <p>Or sign in with</p>
            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
