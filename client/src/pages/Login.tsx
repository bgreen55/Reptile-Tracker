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
        console.log(json);

        //send data to server
        const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: json,
        });
        const result = await response.json();
        console.log(result);

        //if login is successful, redirect to dashboard
        if (result.token) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("userId", result.user.id);
            navigate("/dashboard", {replace: false});
        //if login is unsuccessful, alert user
        } else {
            alert("Invalid email or password");
        }
    }

    return (
        <div>
            <input type="text" id="email" name="email" onChange={(event) => {setEmail(event.target.value)}} placeholder="Email" />
            <input type="password" id="password" name="password" onChange={(event) => {setPassword(event.target.value)}} placeholder="Password" />
            <button onClick={pullData}>Login</button>
            <button onClick={() => navigate("/signup", {replace: false})}>Signup</button>
        </div>
    );
}