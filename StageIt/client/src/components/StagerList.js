import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { getAllStagers, searchByLocations } from "../modules/stagerManager";
import { getUserByFirebaseId } from '../modules/authManager';
import { StagerCard } from "./StagerCard";
import "./StagerList.css"

export const StagerList = () => {
    const [stagers, setStagers] = useState([]);
    const [locationsToSearch, setLocationsToSearch] = useState("");
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
        searchByLocations(locationsToSearch).then(stagersFound => setStagers(stagersFound));
    }

    useEffect(() => {
        getCurrentUser();
    }, [])

    const handleBookAppt = (stagerId) => {
        navigate(`/myappointments/add/${stagerId}`);
    }

    const handleClearSearchResult = () => {
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

            {/* StagerCard displays the search result with stagers found for the 
                locations searched. The search result replaces the default view 
                of all stagers. The Clear button re-renders the all stagers view.
              */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-2">
                {(stagers && stagers.length > 0) ?
                    stagers.map(stager => {
                        return (
                            <StagerCard
                                key={stager.id}
                                singleStager={stager}
                                userProfile={currentUser}
                                handleBookAppt={handleBookAppt} />
                        )
                    })
                    :
                    <div><p>Sorry, No Results Found. Try searching another location.</p></div>
                }
            </div>
        </div>
    )
}