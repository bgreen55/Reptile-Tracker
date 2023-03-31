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
        console.log(data);
        
        //parse data into json
        var json = JSON.stringify(data);
        //console.log(json);
    
        //send data to server
        const response = await fetch("/users/create", {
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
        }
    
        alert("Account created successfully, please login using those same credentials");
      }

    return (
        <div>
            <input type="text" id="fname" name="fname" onChange={(event) => {setFirstName(event.target.value)}} placeholder="First Name" />
            <input type="text" id="lname" name="lname" onChange={(event) => {setLastname(event.target.value)}} placeholder="Last Name" />
            <input type="text" id="email" name="email" onChange={(event) => {setEmail(event.target.value)}} placeholder="Email" />
            <input type="password" id="password" name="password" onChange={(event) => {setPassword(event.target.value)}} placeholder="Password" />
            <button onClick={pullData}>Signup</button>
            
            <button onClick={() => navigate("/login", {replace: false})}>Login Bro</button>
            <button onClick={() => navigate("/", {replace: false})}>Home</button>
        </div>
    );
}