import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { getAllStagers } from "../modules/stagerManager";
import { getUserByFirebaseId } from '../modules/authManager';
import { StagerCard } from "./StagerCard";
import "./StagerList.css"
import { SearchResult } from "./SearchResult";

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
        getUserByFirebaseId().then(user => {
            setCurrentUser(user);
            // now get all the stagers here 
            getStagers();
        });

    }

    // update state with the search input user entered
    const handleInputChange = (event) => {

        let locations = event.target.value;
        setLocationsToSearch(locations);
    }

    // search the stagers in the locations entered
    const handleSearchLocations = () => {

        let searchResult = [];
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
        getCurrentUser();
    }, [])

    const handleBookAppt = (stagerId) => {
        navigate(`/myappointments/add/${stagerId}`);
    }

    const handleClearSearchResult = () => {
        // set the state to null so tha a list 
        // of all stagers will be rendered
        setFoundStagers(null);
        // clear the input search field
        setLocationsToSearch("");
        // list the stagers on the page
        getStagers();
    }

    return (
        <div className="stager-container">
            <div className="title-search-div">
                <h1>List of Stagers</h1>
                <div className="search-div">
                    <input className="search-input mr-sm-2" type="search" placeholder="Search locations" aria-label="Search"
                        id="locations" onChange={(e) => handleInputChange(e)} required autoFocus value={locationsToSearch} />
                    <Button className="btn btn-success my-2 my-sm-0" type="submit"
                        onClick={() => handleSearchLocations()}>Search</Button> &nbsp;
                    <Button color="danger" className="my-2 my-sm-0" type="submit"
                        onClick={() => handleClearSearchResult()}>Clear</Button>
                </div>
            </div>

            {/* display stagers who serve the locations searched */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-2">
                {foundStagers && foundStagers.length > 0 ?
                    foundStagers.map(stager => {
                        return (
                            <SearchResult
                                key={stager.id}
                                singleStager={stager}
                                userProfile={currentUser}
                                handleBookAppt={handleBookAppt} />
                        )
                    })
                    :
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
        </div>
    )
}