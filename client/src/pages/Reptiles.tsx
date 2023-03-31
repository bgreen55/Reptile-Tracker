import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

export const Reptiles = () => {

    const navigate = useNavigate();

    return (
        <div>
            <nav><ul>
                <li><button onClick={() => navigate("/dashboard", {replace: false})}>Dashboard</button></li>
            </ul></nav>
            <h1>Reptiles</h1>
            <div>
                <h3>IN CONSTRUCTIONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</h3>
            </div>

        </div>
    );
}