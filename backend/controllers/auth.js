const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwtProvider");

// Allowed roles
const ALLOWED_ROLES = ["admin", "faculty", "student"];

const registerUser = async (req, res, next) => {
    let { firstName, lastName, email, password, role = "student" } = req.body;

    // Validate role
    if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ message: `Invalid role. Allowed: ${ALLOWED_ROLES.join(", ")}` });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const userData = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
    });

    const user = await userData.save();
    const token = generateToken(user._id);
    user.password = null;

    res.status(200).json({
        message: "Registration successful",
        data: user,
        token,
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id);
    user.password = null;

    console.log("=== LOGIN ATTEMPT ===");
    console.log("Email:", email);
    console.log("User role from DB:", user.role);
    console.log("User data:", JSON.stringify(user, null, 2));

    let redirectUrl;
    
    if (user.role === "admin") {
        redirectUrl = "/admin";
    } else if (user.role === "faculty") {
        redirectUrl = "/faculty";
    } else if (user.role === "student") {
        redirectUrl = "/home";
    }

    console.log("Calculated redirect URL:", redirectUrl);
    console.log("=== END LOGIN ATTEMPT ===");

    if (!redirectUrl) {
        return res.status(400).json({ 
            message: `Invalid role "${user.role}". Cannot determine redirect path.` 
        });
    }

    res.status(200).json({
        message: "Login successful",
        data: user,
        token,
        redirectUrl,
    });
};

module.exports = { registerUser, loginUser };