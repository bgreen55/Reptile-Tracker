import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//signup page  
    // I should be able to create a user account
    // I should be able to navigate to the Login page
    // Upon creating an account I should be redirected to the dashboard page

export const Update = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [sex, setSex] = useState("");
    const { id }  = useParams();
    
    async function createFood() {
        var data = {
            reptileId: Number(id),
            species,
            name,
            sex,
        };

        var json = JSON.stringify(data);
    
        const response = await fetch("/reptiles/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `"Bearer ${localStorage.getItem("token")}`,
          },
          body: json,
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.reptile) {
                navigate(`/reptile/${id}`, {replace: false});
            } else if (json.message) {
                alert(json.message);
            }
        });

      }

    return (
        <div>
            <nav><ul>
                <li><button onClick={() => navigate(`/reptile/${id}`, {replace: false})}>Reptile</button></li>
            </ul></nav>
            <h1>Update</h1>
            <div className="input-container">
                <input type="text" onChange={(event) => {setName(event.target.value)}} value={name} placeholder="Name" />
                <input type="text" onChange={(event) => {setSpecies(event.target.value)}} value={species} placeholder="Species" />
                <input type="text" onChange={(event) => {setSex(event.target.value)}} value={sex} placeholder="Sex" />
                <button onClick={createFood}>Confirm</button>
            </div>
        </div>
    );
}