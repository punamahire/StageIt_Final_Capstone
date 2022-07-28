import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import Moment from 'moment';
import { getMyAppointments, deleteAppointment } from "../modules/appointmentManager";
import { getUserByFirebaseId } from "../modules/authManager";

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
    }, [])

    return (
        <div className="appointment-container mx-3 h-100">
            <h1>Appointments</h1>
            {appointments.map(appointment => {
                return (
                    <div className="appointment-card mb-3" key={appointment.id}>
                        <div className="appointment-content">
                            <div className="title-content">
                                {/* display the name on the appointment based on the 
                                    role of the current logged in user */}
                                {(currentUser && currentUser.roleId == 1) ?
                                    <h3>Stager's Name: {appointment.stagerProfile?.name}</h3>
                                    :
                                    <h3>Client's Name: {appointment.userProfile?.name}</h3>
                                }
                                <p><strong>Appointment Date:</strong> {Moment(appointment.appointmentTime).format('MMMM Do, YYYY H:mm a')}</p>
                                <p><strong>Address:</strong> {appointment.address}</p>
                                <p><strong>Notes:</strong> {appointment.notes}</p>
                            </div>
                        </div>
                        <Button color="primary" onClick={() => handleEditAppt(appointment.id)}>Edit</Button>&nbsp;
                        <Button color="danger" onClick={() => { setApptToDelete(appointment.id); setConfirmDialog(true) }}>Remove</Button>
                        <hr></hr>
                    </div>
                )
            })}
            <dialog className="dialog" style={{ borderRadius: '0.5rem' }} open={confirmDialog}>
                <div>Are you sure you want to remove this appointment?</div> <br></br>
                <Button color="primary" onClick={(e) => setConfirmDialog(false)}>Cancel</Button>&nbsp;
                <Button color="danger" onClick={() => handleDeleteAppt(apptToDelete)}>Confirm</Button>
            </dialog>
        </div>
    )
}
