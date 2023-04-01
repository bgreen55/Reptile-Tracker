import { useState } from "react";
import { useNavigate } from "react-router-dom";

//signup page  
    // I should be able to create a user account
    // I should be able to navigate to the Login page
    // Upon creating an account I should be redirected to the dashboard page

export const Signup = () => {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    async function pullData() {
        var data = {
            firstName,
            lastName,
            email,
            password
        };
        
        //parse data into json
        var json = JSON.stringify(data);
    
        //send data to server
        let success = false;
        const response = await fetch("/users/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: json,
        })
        .then((response) => response.json())
        .then((json) => {
            //if login is successful, redirect to dashboard
            if (json.token) {
                success = true;
                localStorage.setItem("token", json.token);
                localStorage.setItem("userId", json.user.id);
            } else if (json.message) {
                success = false;
                alert(json.message);
            }
        }).finally(() => {
            if (success) {
                navigate("/dashboard", {replace: false});
            }
        });
      }

    return (
        <div>
            <nav><ul>
                <li><button onClick={() => navigate("/login", {replace: false})}>Login</button></li>
            </ul></nav>
            <h1>Signup</h1>
            <div className="input-container">
                <input type="text" id="fname" name="fname" onChange={(event) => {setFirstName(event.target.value)}} placeholder="First Name" />
                <input type="text" id="lname" name="lname" onChange={(event) => {setLastname(event.target.value)}} placeholder="Last Name" />
                <input type="text" id="email" name="email" onChange={(event) => {setEmail(event.target.value)}} placeholder="Email" />
                <input type="password" id="password" name="password" onChange={(event) => {setPassword(event.target.value)}} placeholder="Password" />
                <button onClick={pullData}>Confirm</button>
            </div>
        </div>
    );
}