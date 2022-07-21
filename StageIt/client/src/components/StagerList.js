import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { getAllStagers } from "../modules/stagerManager";

export const StagerList = () => {
    const [stagers, setStagers] = useState([]);
    const navigate = useNavigate();

    const getStagers = () => {
        getAllStagers().then(stagersFromAPI => setStagers(stagersFromAPI));
    };

    useEffect(() => {
        getStagers();
    }, [])

    const handleBookAppt = (stagerId) => {
        navigate(`/myappointments/add/${stagerId}`);
    }

    return (
        <div className="stager-container">
            <h1>Stagers List</h1>
            {stagers.map(stager => {
                return (
                    <div className="stager-card" key={stager.id}>
                        {stager.imageUrl &&
                            <img src={stager.imageUrl}></img>
                        }
                        <div className="stager-content">
                            <div className="title-content">
                                <h3>{stager.name}</h3>
                                <Button color="primary" onClick={() => handleBookAppt(stager.id)}>Book this Stager</Button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}