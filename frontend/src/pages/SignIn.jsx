import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import { checkValidSignInFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleBackToHome = () => {
		navigate("/landing");
	};
	const logInUser = (e) => {
		// SignIn ---
		console.log("Attempting to connect to: http://localhost:9001/api/auth/signin");
		toast.loading("Wait until you SignIn");
		e.target.disabled = true;
		fetch(`http://localhost:9001/api/auth/signin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				if (json.token) {
					localStorage.setItem("token", json.token);
					dispatch(addAuth(json.data));
					navigate("/home");
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
	const handleLogin = (e) => {
		if (email && password) {
			const validError = checkValidSignInFrom(email, password);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			logInUser(e);
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
					SignIn BHULink
				</h2>
				<form className="w-full flex justify-between flex-col">
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
							e.preventDefault();
							handleLogin(e);
						}}
						className="disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold hover:bg-black rounded-full px-5 py-4 mt-5 text-lg border border-slate-400  text-slate-400 hover:text-white bg-slate-700 transition-all"
					>
						{load == "" ? "SignIn" : load}
					</button>
					<div className="w-full flex items-center mt-3">
						<div className="w-full h-[1px] bg-slate-600"></div>
						<Link to={"#"}>
							<div className="p-3 font-semibold text-md hover:text-white whitespace-nowrap">
								Forgot Password
							</div>
						</Link>
						<div className="w-full h-[1px] bg-slate-600"></div>
					</div>
					<div className="w-full flex items-center my-3">
						<div className="w-full h-[1px] bg-slate-600"></div>
						<Link to="/signup">
							<div className="p-3 font-semibold text-md hover:text-white">
								SignUp
							</div>
						</Link>
						<div className="w-full h-[1px] bg-slate-600"></div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
