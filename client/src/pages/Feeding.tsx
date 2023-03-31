import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//signup page  
    // I should be able to create a user account
    // I should be able to navigate to the Login page
    // Upon creating an account I should be redirected to the dashboard page

export const Feeding = () => {

    const navigate = useNavigate();

    const [food, setFood] = useState("");
    const { id }  = useParams();
    
    async function createFood() {
        var data = {
            reptileId: Number(id),
            foodItem: food,
        };

        var json = JSON.stringify(data);
    
        const response = await fetch("/feedings/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `"Bearer ${localStorage.getItem("token")}`,
          },
          body: json,
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.feeding) {
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
            <h1>Create</h1>
            <div className="input-container">
                <input type="text" onChange={(event) => {setFood(event.target.value)}} value={food} placeholder="Food" />
                <button onClick={createFood}>Confirm</button>
            </div>
        </div>
    );
}