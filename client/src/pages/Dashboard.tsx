import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

type ScheduleBody = {
    id: number,
    reptileId: number,
    userId: number,
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

    useEffect(() => {
        pullData();
    }, []);

    return (
        <div>
            <button onClick={logout}>Logout</button>

            <h2>Schedules for {dayOfWeek}: </h2>
            <div className="container">
                <div className="schedule attributes">
                    <span>ID</span>
                    <span>Reptile ID</span>
                    <span>Type</span>
                    <span>Description</span>
                </div>
                {schedules.map((schedule) => (
                    <div className="schedule">
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
                    <div className="reptile">
                        <span>{reptile.id}</span>
                        <span>{reptile.name}</span>
                        <span>{reptile.species}</span>
                        <span>{reptile.sex}</span>
                        <button>Delete</button>
                    </div>
                ))}
            </div>

        </div>
    );
}