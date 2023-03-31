import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//signup page  
    // I should be able to create a user account
    // I should be able to navigate to the Login page
    // Upon creating an account I should be redirected to the dashboard page

export const Husbandry = () => {

    const navigate = useNavigate();

    const [length, setLength] = useState<number>();
    const [weight, setWeight] = useState<number>();
    const [temperature, setTemperature] = useState<number>();
    const [humidity, setHumidity] = useState<number>();
    const { id }  = useParams();
    
    async function createHusbandry() {
        var data = {
            reptileId: Number(id),
            length,
            weight,
            temperature,
            humidity,
        };

        var json = JSON.stringify(data);
    
        const response = await fetch("/husbandry/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `"Bearer ${localStorage.getItem("token")}`,
          },
          body: json,
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.husbandry) {
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
                <input type="number" onChange={(event) => {setLength(Number(event.target.value))}} value={length} placeholder="Length" />
                <input type="number" onChange={(event) => {setWeight(Number(event.target.value))}} value={weight} placeholder="Weight" />
                <input type="number" onChange={(event) => {setTemperature(Number(event.target.value))}} value={temperature} placeholder="Temperature" />
                <input type="number" onChange={(event) => {setHumidity(Number(event.target.value))}} value={humidity} placeholder="Humidity" />
                <button onClick={createHusbandry}>Confirm</button>
            </div>
        </div>
    );
}