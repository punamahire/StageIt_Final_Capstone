import React, { useEffect, useState } from "react";
import { getAllStagers } from "../modules/stagerManager";

export const StagerList = () => {
    const [stagers, setStagers] = useState([]);

    const getStagers = () => {
        getAllStagers().then(stagersFromAPI => setStagers(stagersFromAPI));
    };

    useEffect(() => {
        getStagers();
    }, [])

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
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}