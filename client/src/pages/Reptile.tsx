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

export const Reptile = () => {

    const navigate = useNavigate();
    const [feedings, setFeedings] = useState<FeedingBody[]>([]);
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
            <h2>Feedings: </h2>
            <div className="container">
                <div className="feeding attributes">
                    <span>ID</span>
                    <span>Reptile ID</span>
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

        </div>
    );
}