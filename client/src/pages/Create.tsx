import { useState } from "react";
import { useNavigate } from "react-router-dom";

//signup page  
    // I should be able to create a user account
    // I should be able to navigate to the Login page
    // Upon creating an account I should be redirected to the dashboard page

export const Create = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [sex, setSex] = useState("");
    
    async function createReptile() {
        var data = {
            name,
            species,
            sex,
        };

        var json = JSON.stringify(data);
    
        const response = await fetch("/reptiles/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `"Bearer ${localStorage.getItem("token")}`,
          },
          body: json,
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.message) {
                alert(json.message);
            }
        }).finally(() => {
            navigate("/dashboard", {replace: false});
        });

      }

    return (
        <div>
            <nav><ul>
                <li><button onClick={() => navigate("/dashboard", {replace: false})}>Dashboard</button></li>
            </ul></nav>
            <h1>Create</h1>
            <div className="input-container">
                <input type="text" onChange={(event) => {setName(event.target.value)}} value={name} placeholder="Name" />
                <input type="text" onChange={(event) => {setSex(event.target.value)}} value={sex} placeholder="Sex" />
                <input type="text" onChange={(event) => {setSpecies(event.target.value)}} value={species} placeholder="Species" />
                <button onClick={createReptile}>Confirm</button>
            </div>
        </div>
    );
}