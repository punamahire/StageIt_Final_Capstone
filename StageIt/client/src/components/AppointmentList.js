import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { getMyAppointments, deleteAppointment } from "../modules/appointmentManager";
import Moment from 'moment';
import { getUserByFirebaseId } from "../modules/authManager";

export const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [confirmDialog, setConfirmDialog] = useState(false);

    const navigate = useNavigate();

    const getCurrentUser = () => {
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
        deleteAppointment(apptId).then(r => {
            getAppointments();
        });
    }

    useEffect(() => {
        getCurrentUser();
    }, [])

    return (
        <div className="appointment-container mx-3 h-100">
            <h1>Appointments List</h1>
            {appointments.map(appointment => {
                return (
                    <div className="appointment-card mb-3" key={appointment.id}>
                        <div className="appointment-content">
                            <div className="title-content">
                                {(currentUser && currentUser.roleId == 1) ?
                                    <h3>Stager's Name: {appointment.stagerProfile?.name}</h3>
                                    :
                                    <h3>Client's Name: {appointment.userProfile?.name}</h3>
                                }
                                <p>Appointment Date: {Moment(appointment.appointmentTime).format('MMMM Do, YYYY H:mm a')}</p>
                                <p>Address: {appointment.address}</p>
                                <p>Notes: {appointment.notes}</p>
                            </div>
                        </div>
                        <dialog className="dialog" style={{ borderRadius: '0.5rem' }} open={confirmDialog}>
                            <div>Are you sure you want to remove this appointment?</div> <br></br>
                            <Button
                                color="primary"
                                onClick={(e) => setConfirmDialog(false)}
                            >
                                Cancel
                            </Button>&nbsp;
                            <Button type="button" color="danger" onClick={() => handleDeleteAppt(appointment.id)}>Confirm</Button>
                        </dialog>
                        <Button className="mx-2" color="primary" onClick={() => handleEditAppt(appointment.id)}>Edit</Button>
                        <Button color="danger" onClick={() => setConfirmDialog(true)}>Remove</Button>
                        <hr></hr>
                    </div>
                )
            })}
        </div>
    )
}
