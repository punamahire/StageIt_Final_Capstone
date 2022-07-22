import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { getMyAppointments, deleteAppointment } from "../modules/appointmentManager";
import Moment from 'moment';

export const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    const getAppointments = () => {
        getMyAppointments().then(apptsFromAPI => setAppointments(apptsFromAPI));
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
        getAppointments();
    }, [])

    return (
        <div className="appointment-container mx-3">
            <h1>Appointments List</h1>
            {appointments.map(appointment => {
                return (
                    <div className="appointment-card mb-3" key={appointment.id}>
                        <div className="appointment-content">
                            <div className="title-content">
                                <h3>Stager's Name: {appointment.stagerProfile?.name}</h3>
                                <p>Appointment Date: {Moment(appointment.appointmentTime).format('MMMM do, yyyy H:mm a')}</p>
                                <p>Address: {appointment.address}</p>
                                <p>Notes: {appointment.notes}</p>
                            </div>
                        </div>
                        <Button className="mx-2" color="primary" onClick={() => handleEditAppt(appointment.id)}>Edit</Button>
                        <Button color="danger" onClick={() => handleDeleteAppt(appointment.id)}>Remove</Button>
                        <hr></hr>
                    </div>
                )
            })}
        </div>
    )
}