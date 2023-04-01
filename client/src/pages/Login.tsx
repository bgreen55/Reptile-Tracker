import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

//login page
    // I should be able to sign into a user account
    // I should be able to navigate to the signup page
    // Upon signing in, I should be redirected to the dashboard page
    //login is a get request, headers are content type json, body is email and password
  

  //on button click run the pullData function

export const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function pullData() {

        var data = {
          email,
          password,
        };

        var json = JSON.stringify(data);

        //send data to server
        let success = false;
        const response = await fetch("/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: json,
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.token) {
                success = true;
                localStorage.setItem("token", json.token);
                localStorage.setItem("userId", json.user.id);
            } else {
                //if login is unsuccessful, alert user
                success = false;
                alert("Invalid email or password");
            }
        })
        .finally(() => {
            if (success) {
                navigate("/dashboard", {replace: false});
            }
        });
    }

    return (
        <div>
            <nav><ul>
                <li><button onClick={() => navigate("/signup", {replace: false})}>Signup</button></li>
            </ul></nav>
            <h1>Login</h1>
            <div className="input-container">
                <input type="text" id="email" name="email" onChange={(event) => {setEmail(event.target.value)}} placeholder="Email" />
                <input type="password" id="password" name="password" onChange={(event) => {setPassword(event.target.value)}} placeholder="Password" />
            </div>

            <button onClick={pullData}>Confirm</button>
        </div>
    );
}