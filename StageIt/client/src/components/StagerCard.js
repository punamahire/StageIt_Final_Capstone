import React from "react";
import { Button } from "reactstrap";
import { BootstrapCarousel } from "./BootstrapCarousel";
import './StagerCard.css'

export const StagerCard = ({ singleStager, userProfile, handleBookAppt }) => {
    return (
        <div className="stager-card col-sm-6">
            <div>
                <BootstrapCarousel></BootstrapCarousel>
            </div>
            <div className="card-header card-header-footer-color">
            </div>
            <div className="card-body card-color">
                <div className="card-content">
                    <div className="image-div">
                        {singleStager.imageUrl ?
                            <img src={singleStager.imageUrl} alt="user image" width={150} height={150}></img>
                            :
                            ''
                        }
                    </div>
                    <div className="title-content content-div">
                        <h3>{singleStager.name}</h3>
                        <p><strong>Locations served:</strong> {singleStager.locationsServed}</p>
                        {/* <Link to={`/stagingimages/${singleStager.id}/images`} className="btn btn-primary">
                            See my work
                        </Link> */}
                        {userProfile.id !== singleStager.id &&
                            <Button color="primary" onClick={() => handleBookAppt(singleStager.id)}>Make Appointment</Button>
                        }
                    </div>
                </div>
            </div>
            <div className="card-footer card-header-footer-color">
            </div>
            <hr></hr>
        </div>
    )
}