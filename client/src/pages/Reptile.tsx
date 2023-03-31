import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Reptile.css';

type FeedingBody = {
    id : number,
    reptileId : number,
    foodItem : string,
    createdAt : string,
    updatedAt : string,
}

type HusbandryBody = {
    id : number,
    reptileId : number,
    length: number,
    weight: number,
    temperature: number,
    humidity: number,
    createdAt : string,
    updatedAt : string,
}

type ScheduleBody = {
    id : number,
    reptileId : number,
    userId : number,
    type : string,
    description : string,
    monday : boolean,
    tuesday : boolean,
    wednesday : boolean,
    thursday : boolean,
    friday : boolean,
    saturday : boolean,
    sunday : boolean,
    createdAt : string,
    updatedAt : string,
}

export const Reptile = () => {

    const navigate = useNavigate();
    const [feedings, setFeedings] = useState<FeedingBody[]>([]);
    const [husbandry, setHusbandry] = useState<HusbandryBody[]>([]);
    const [schedules, setSchedules] = useState<ScheduleBody[]>([]);
    const { id }  = useParams();

    
    async function pullData() {
        fetch(`/feedings/all/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `"Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.feedings) {
                setFeedings(json.feedings);
            }
        });

        fetch(`/husbandry/all/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `"Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.husbandry) {
                setHusbandry(json.husbandry);
            }
        });

        fetch(`/schedules/all/reptile/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `"Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.schedules) {
                setSchedules(json.schedules);
            }
        });
    }

    useEffect(() => {
        pullData();
    }, []);

    return (
        <div>

            <nav><ul>
                <li><button onClick={() => navigate("/dashboard", {replace: false})}>Dashboard</button></li>
            </ul></nav>
            <h1>Reptile</h1>
            <button onClick={() => {navigate(`/reptile/${id}/update`, {replace: false})}}>Update</button>

            <h2>Feedings: </h2>
            <div className="container">
                <div className="feeding attributes">
                    <span>ID</span>
                    <span>Food</span>
                </div>
                {feedings.map((feeding) => (
                    <div key={feeding.id} className="feeding">
                        <span>{feeding.id}</span>
                        <span>{feeding.reptileId}</span>
                        <span>{feeding.foodItem}</span>
                    </div>
                ))}
                <button className="add-button" onClick={() => {navigate(`/reptile/${id}/feeding`, {replace: false})}}>Create</button>
            </div>

            <h2>Husbandry: </h2>
            <div className="container">
                <div className="husbandry attributes">
                    <span>ID</span>
                    <span>Length</span>
                    <span>Weight</span>
                    <span>Temperature</span>
                    <span>Humidity</span>
                </div>
                {husbandry.map((husbandry) => (
                    <div key={husbandry.id} className="husbandry">
                        <span>{husbandry.id}</span>
                        <span>{husbandry.length}</span>
                        <span>{husbandry.weight}</span>
                        <span>{husbandry.temperature}</span>
                        <span>{husbandry.humidity}</span>
                    </div>
                ))}
                <button className="add-button" onClick={() => {navigate(`/reptile/${id}/husbandry`, {replace: false})}}>Create</button>
            </div>

            <h2>Schedules: </h2>
            <div className="container">
                <div className="schedule attributes">
                    <span>ID</span>
                    <span>Type</span>
                    <span>Description</span>
                    <span>Monday</span>
                    <span>Tuesday</span>
                    <span>Wednesday</span>
                    <span>Thursday</span>
                    <span>Friday</span>
                    <span>Saturday</span>
                    <span>Sunday</span>
                </div>
                {schedules.map((schedule) => (
                    <div key={schedule.id} className="schedule">
                        <span>{schedule.id}</span>
                        <span>{schedule.type}</span>
                        <span>{schedule.description}</span>
                        <span>{schedule.monday && "X"}</span>
                        <span>{schedule.tuesday && "X"}</span>
                        <span>{schedule.wednesday && "X"}</span>
                        <span>{schedule.thursday && "X"}</span>
                        <span>{schedule.friday && "X"}</span>
                        <span>{schedule.saturday && "X"}</span>
                        <span>{schedule.sunday && "X"}</span>
                    </div>
                ))}
                <button className="add-button" onClick={() => {navigate(`/reptile/${id}/schedule`, {replace: false})}}>Create</button>
            </div>
        </div>
    );
}