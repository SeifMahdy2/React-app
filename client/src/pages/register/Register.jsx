import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  //register file with encripted password for more secure login
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      //axios used to post to the backend server
      await axios.post("http://localhost:3001/api/auth/register", inputs);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err)

  return (
    <div className="register">
      <div className="card">
        <div className="right">
          <h1>Welcome to LinkUp</h1>
          <div className = "layout">
            <h5>Already have an account?</h5>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
        </div>
        <div className="left">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleClick}>
              <Link to="/login" style={{ textDecoration: "none" , color: "white" }}>
                Register
              </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
