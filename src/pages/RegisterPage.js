import { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.passwordConfirm) {
            setError("Passwords do not match!");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await axios.post("https://localhost:7217/api/Auth/register", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            setSuccess(response.data || "Registration successful!");
            setFormData({ username: "", email: "", password: "", passwordConfirm: "" });
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="password" name="passwordConfirm" placeholder="Confirm Password" value={formData.passwordConfirm} onChange={handleChange} required />
                <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
            </form>
        </div>
    );
};

export default Register;
