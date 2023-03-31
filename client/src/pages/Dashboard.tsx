import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

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

type ReptileBody = {
    id: number,
    userId: number,
    species: string,
    name: string,
    sex: string,
    createdAt: string,
    updatedAt: string,
}

const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
]
const dayOfWeek = daysOfWeek[new Date().getDay()];

export const Dashboard = () => {

    const [schedules, setSchedules] = useState<ScheduleBody[]>([]);
    const [reptiles, setReptiles] = useState<ReptileBody[]>([]);

    const navigate = useNavigate();
    
    // So typescript allows indexing schedule body with string variables
    function hasKey<O>(obj: ScheduleBody, key: PropertyKey): key is keyof O {
        return key in obj;
    }

    async function pullData() {
        fetch("/schedules/all/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `"Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.schedules) {
                setSchedules(json.schedules);
            }
        });

        fetch("/reptiles/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `"Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.reptiles.reptiles) {
                setReptiles(json.reptiles.reptiles);
            }
        });
    }

    function logout() {
        localStorage.setItem("token", "");
        localStorage.setItem("userId", "");
        navigate("/", {replace: false});
    }

    function deleteReptile(reptileId : number) {
        var data = {
            reptileId
        };
  
        var json = JSON.stringify(data);
        
        fetch("/reptiles/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `"Bearer ${localStorage.getItem("token")}`,
            },
            body: json,
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.reptile) {
                pullData();
            }
        });
    }

    useEffect(() => {
        pullData();
    }, []);

    return (
        <div>
            <nav><ul>
                <li><button onClick={logout}>Logout</button></li>
            </ul></nav>
            <h1>Dashboard</h1>
            <h2>Schedules for {dayOfWeek}: </h2>
            <div className="container">
                <div className="schedule attributes">
                    <span>ID</span>
                    <span>Reptile ID</span>
                    <span>Type</span>
                    <span>Description</span>
                </div>
                {schedules.filter((schedule) => {if (hasKey(schedule, dayOfWeek)) {return schedule[dayOfWeek] === true;}}).map((schedule) => (
                    <div key={schedule.id} className="schedule">
                        <span>{schedule.id}</span>
                        <span>{schedule.reptileId}</span>
                        <span>{schedule.type}</span>
                        <span>{schedule.description}</span>
                    </div>
                ))}
            </div>

            <h2>Reptiles: </h2>
            <div className="container">
                <div className="reptile attributes">
                    <span>ID</span>
                    <span>Name</span>
                    <span>Species</span>
                    <span>Sex</span>
                    <span></span>
                </div>
                {reptiles.map((reptile) => (
                    <div key={reptile.id} className="reptile">
                        <span>{reptile.id}</span>
                        <span>{reptile.name}</span>
                        <span>{reptile.species}</span>
                        <span>{reptile.sex}</span>
                        <button onClick={() => deleteReptile(reptile.id)}>Delete</button>
                        <button onClick={() => navigate(`/reptile/${reptile.id}`, {replace: false})}>View</button>
                    </div>
                ))}
                <button className="add-reptile" onClick={() => {navigate("/create", {replace: false})}}>Create</button>
            </div>

        </div>
    );
}