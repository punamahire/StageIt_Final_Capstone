import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import Moment from 'moment';
import { getMyAppointments, deleteAppointment } from "../modules/appointmentManager";
import { getUserByFirebaseId } from "../modules/authManager";
import "./AppointmentList.css";

export const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [apptToDelete, setApptToDelete] = useState(null);

    const navigate = useNavigate();

    const getCurrentUser = () => {
        // first, get the user and then his appointments
        getUserByFirebaseId().then(user => {
            setCurrentUser(user);

            if (user !== null) {
                getMyAppointments(user.id, user.roleId)
                    .then(apptsFromAPI => setAppointments(apptsFromAPI));
            }
        });
    }

    const getAppointments = () => {
        getMyAppointments(currentUser.id, currentUser.roleId)
            .then(apptsFromAPI => setAppointments(apptsFromAPI));
    };

    const handleEditAppt = (apptId) => {
        navigate(`/myappointments/edit/${apptId}`);
    }

    const handleDeleteAppt = (apptId) => {
        // delete the selected appt and then show the updated list
        deleteAppointment(apptId).then(resp => {
            getAppointments();
            // clear the component state as we already deleted this 
            // appointment from the database
            setApptToDelete(null);
            // we do not want to display the confirm dialog box for 
            // other appointments so, set it to false.
            setConfirmDialog(false);
        });
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <div className="appointment-container">
            <h1>Your Appointments</h1>
            {appointments.map(appointment => {
                return (
                    <div className="appointment-card card-color my-3" key={appointment.id}>
                        <div className="card-header card-header-footer-color p-2">
                            {/* display the name on the appointment based on the 
                                    role of the current logged in user */}
                            {(currentUser && currentUser.roleId == 1) ?
                                <h3 className="card-title">Stager: {appointment.stagerProfile?.name}</h3>
                                :
                                <h3 className="card-title">Client: {appointment.userProfile?.name}</h3>
                            }
                        </div>
                        <div className="appointment-content p-2">
                            <div className="title-content">
                                <p><strong>Appointment Date:</strong> {Moment(appointment.appointmentTime).format('MMMM Do, YYYY @ h:mma')}</p>
                                <p><strong>Address:</strong> {appointment.address}</p>
                                {appointment.isFurnished ?
                                    <p><strong>House Vacant or Furnished:</strong> Furnished</p>
                                    :
                                    <p><strong>House Vacant or Furnished:</strong> Vacant</p>
                                }
                                <p><strong>Number of Rooms:</strong> {appointment.rooms}</p>
                                <p><strong>Notes:</strong> {appointment.notes}</p>
                            </div>
                        </div>
                        <div className="card-footer card-header-footer-color p-2">
                            <Button className="footer-btns" color="primary" onClick={() => handleEditAppt(appointment.id)}>Edit</Button>&nbsp;
                            <Button color="danger" onClick={() => { setApptToDelete(appointment.id); setConfirmDialog(true) }}>Remove</Button>
                        </div>
                    </div>
                )
            })}
            <dialog className="dialog" style={{ borderRadius: '0.5rem', position: 'absolute', top: '50%' }} open={confirmDialog}>
                <div>Are you sure you want to remove this appointment?</div> <br></br>
                <Button color="primary" onClick={(e) => setConfirmDialog(false)}>Cancel</Button>&nbsp;
                <Button color="danger" onClick={() => handleDeleteAppt(apptToDelete)}>Confirm</Button>
            </dialog>
        </div>
    )
}
