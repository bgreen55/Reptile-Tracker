import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Schedule.css";

//signup page  
    // I should be able to create a user account
    // I should be able to navigate to the Login page
    // Upon creating an account I should be redirected to the dashboard page

export const Schedule = () => {

    const navigate = useNavigate();

    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [monday, setMonday] = useState(false);
    const [tuesday, setTuesday] = useState(false);
    const [wednesday, setWednesday] = useState(false);
    const [thursday, setThursday] = useState(false);
    const [friday, setFriday] = useState(false);
    const [saturday, setSaturday] = useState(false);
    const [sunday, setSunday] = useState(false);
    const { id }  = useParams();
    
    async function createSchedule() {
        var data = {
            reptileId: Number(id),
            type,
            description,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
        };

        var json = JSON.stringify(data);
    
        const response = await fetch("/schedules/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `"Bearer ${localStorage.getItem("token")}`,
          },
          body: json,
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.schedule) {
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
                <input type="text" onChange={(event) => {setType(event.target.value)}} value={type} placeholder="Type" />
                <input type="text" onChange={(event) => {setDescription(event.target.value)}} value={description} placeholder="Description" />
                <div><span className="day">Monday</span><input className="check" type="checkbox" onChange={(event) => {setMonday(event.target.checked)}} checked={monday} /></div>
                <div><span className="day">Tuesday</span><input className="check" type="checkbox" onChange={(event) => {setTuesday(event.target.checked)}} checked={tuesday} /></div>
                <div><span className="day">Wednesday</span><input className="check" type="checkbox" onChange={(event) => {setWednesday(event.target.checked)}} checked={wednesday} /></div>
                <div><span className="day">Thursday</span><input className="check" type="checkbox" onChange={(event) => {setThursday(event.target.checked)}} checked={thursday} /></div>
                <div><span className="day">Friday</span><input className="check" type="checkbox" onChange={(event) => {setFriday(event.target.checked)}} checked={friday} /></div>
                <div><span className="day">Saturday</span><input className="check" type="checkbox" onChange={(event) => {setSaturday(event.target.checked)}} checked={saturday} /></div>
                <div><span className="day">Sunday</span><input className="check" type="checkbox" onChange={(event) => {setSunday(event.target.checked)}} checked={sunday} /></div>
                <button onClick={createSchedule}>Confirm</button>
            </div>
        </div>
    );
}