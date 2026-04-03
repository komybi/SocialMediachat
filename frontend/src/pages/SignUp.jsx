import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkValidSignUpFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignUp = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("user");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();

	const handleBackToHome = () => {
		navigate("/landing");
	};

	const signUpUser = (e) => {
		// Signup ---
		toast.loading("Wait until you SignUp");
		e.target.disabled = true;
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
				role: role,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				if (json.token) {
					navigate("/signin");
					toast.success(json?.message);
				} else {
					toast.error(json?.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setLoad("");
				toast.dismiss();
				toast.error("Network error or server not responding");
				e.target.disabled = false;
			});
	};
	const handleSignup = (e) => {
		if (firstName && lastName && email && password && role) {
			const validError = checkValidSignUpFrom(
				firstName,
				lastName,
				email,
				password,
				role
			);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			signUpUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};
	return (
		<div className="flex flex-col items-center my-6 text-slate-300 min-h-[80vh]">
			<div className="p-3 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px] border border-slate-400 bg-slate-800 rounded-lg h-fit  mt-5 transition-all">
				{/* Back Button */}
				<div className="flex items-center mb-4">
					<button 
						onClick={handleBackToHome}
						className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors duration-200"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Home
					</button>
				</div>
				
				<h2 className="text-2xl underline underline-offset-8 font-semibold text-slate-100 w-full text-center mb-4">
					SignUp BHULink
				</h2>
				<form className="w-full flex justify-between flex-col">
					<h3 className="text-xl font-semibold p-1">
						Enter First Name
					</h3>
					<input
						className="w-full border border-slate-700 my-3 py-4 px-8 rounded-full flex justify-between bg-white text-black "
						type="text"
						placeholder="Enter First Name"
						name="firstName"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
					<h3 className="text-xl font-semibold p-1">
						Enter Last Name
					</h3>
					<input
						className="w-full border border-slate-700 my-3 py-4 px-8 rounded-full flex justify-between bg-white text-black "
						type="text"
						placeholder="Enter Last Name"
						name="lastName"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
					<h3 className="text-xl font-semibold p-1">
						Select Role
					</h3>
					<select
						className="w-full border border-slate-700 my-3 py-4 px-8 rounded-full bg-white text-black"
						name="role"
						value={role}
						onChange={(e) => setRole(e.target.value)}
					>
						<option value="user">User</option>
						<option value="admin">Admin</option>
						<option value="moderator">Moderator</option>
					</select>
					<h3 className="text-xl font-semibold p-1">
						Enter Email Address
					</h3>
					<input
						className="w-full border border-slate-700 my-3 py-4 px-8 rounded-full flex justify-between bg-white text-black "
						type="email"
						placeholder="Enter Email Address"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<h3 className="text-xl font-semibold p-1">
						Enter Password
					</h3>
					<div className="relative">
						<input
							className="w-full border border-slate-700 my-3 py-4 px-8 rounded-full flex justify-between bg-white text-black "
							type={isShow ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span
							onClick={() => setIsShow(!isShow)}
							className="cursor-pointer text-black/80 absolute right-5 top-8"
						>
							{isShow ? (
								<PiEyeClosedLight fontSize={22} />
							) : (
								<PiEye fontSize={22} />
							)}
						</span>
					</div>
					<button
						onClick={(e) => {
							handleSignup(e);
							e.preventDefault();
						}}
						className="disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold hover:bg-black rounded-full px-5 py-4 mt-5 text-lg border border-slate-400  text-slate-400 hover:text-white bg-slate-700 transition-all"
					>
						{load == "" ? "SignUp" : load}
					</button>
					<div className="w-full flex items-center my-3">
						<div className="w-full h-[1px] bg-slate-600"></div>
						<Link to="/signin">
							<div className="p-3 font-semibold text-md hover:text-white">
								SignIn
							</div>
						</Link>
						<div className="w-full h-[1px] bg-slate-600"></div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
