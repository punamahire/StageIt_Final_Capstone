import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { getAllStagers } from "../modules/stagerManager";
import { getUserByFirebaseId } from '../modules/authManager';
import { StagerCard } from "./StagerCard";
import "./StagerList.css"

export const StagerList = () => {
    const [stagers, setStagers] = useState([]);
    const [locationsToSearch, setLocationsToSearch] = useState("");
    const [foundStagers, setFoundStagers] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const navigate = useNavigate();

    const getStagers = () => {
        getAllStagers().then(stagersFromAPI => setStagers(stagersFromAPI));
    };

    const getCurrentUser = () => {
        getUserByFirebaseId().then(user => setCurrentUser(user));
    }

    // update state with the search input user entered
    const handleInputChange = (event) => {

        let locations = event.target.value;
        setLocationsToSearch(locations);
    }

    // search the stagers in the locations entered
    const handleSearchLocations = () => {

        let searchResult = []
        stagers.map(stager => {

            if (stager.locationsServed?.match(new RegExp(locationsToSearch.replace(', ', '|').replace(',', '|'), 'gi'))) {
                searchResult.push(stager);
            }
        })
        setFoundStagers(searchResult);

        // no need to update the state here for locationsToSearch as it will clear 
        // the search input field. The user should see what locations he searched for.
    }

    useEffect(() => {
        getStagers();
        getCurrentUser();
    }, [])

    const handleBookAppt = (stagerId) => {
        navigate(`/myappointments/add/${stagerId}`);
    }

    return (
        <div className="stager-container">
            <div className="title-search-div">
                <h1>List of Stagers</h1>
                <div className="search-div">
                    <input className="search-input mr-sm-2" type="search" placeholder="Search locations" aria-label="Search"
                        id="locations" onChange={(e) => handleInputChange(e)} required autoFocus value={locationsToSearch} />
                    <button className="btn btn-success my-2 my-sm-0" type="submit"
                        onClick={() => handleSearchLocations()}>Search</button>
                </div>
            </div>

            {/* display stagers who serve the locations searched */}
            {foundStagers.length > 0 ?
                foundStagers.map(stager => {
                    return (
                        <div className="stager-card" key={stager.id}>
                            {stager.imageUrl ?
                                <img src={stager.imageUrl} alt="user image" width={50}></img>
                                :
                                ''
                            }
                            <div className="stager-content">
                                <div className="title-content">
                                    <h3>{stager.name}</h3>
                                    <p><strong>Locations served:</strong> {stager.locationsServed}</p>
                                    <Button color="primary" onClick={() => handleBookAppt(stager.id)}>Book this Stager</Button>
                                </div>
                            </div>
                            <hr></hr>
                        </div>
                    )
                })
                :
                // A client should see a list of all stagers.
                // A stager should see rest of the stagers
                stagers.map(stager => {
                    return (
                        <StagerCard
                            key={stager.id}
                            singleStager={stager}
                            userProfile={currentUser}
                            handleBookAppt={handleBookAppt} />
                    )
                })
            }
        </div>
    )
}