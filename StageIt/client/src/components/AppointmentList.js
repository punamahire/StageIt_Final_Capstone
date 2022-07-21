import React, { useEffect, useState } from "react";
import { getMyAppointments } from "../modules/appointmentManager";

export const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = () => {
        getMyAppointments().then(apptsFromAPI => setAppointments(apptsFromAPI));
    };

    const formatDate = (apptDate) => {
        const dt = new Date(apptDate);
        const date = dt.getDate();
        const year = dt.getFullYear();
        const hours = dt.getHours();
        const mins = dt.getMinutes();

        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let monthName = month[dt.getMonth()];
        return (`${monthName} ${date}, ${year}  ${hours}:${mins}`);
    }

    useEffect(() => {
        getAppointments();
    }, [])

    return (
        <div className="appointment-container">
            <h1>Appointments List</h1>
            {appointments.map(appointment => {
                return (
                    <div className="appointment-card" key={appointment.id}>
                        <div className="appointment-content">
                            <div className="title-content">
                                <h3>Stager's Name: {appointment.stagerProfile?.name}</h3>
                                <p>Appointment Date: {formatDate(appointment.appointmentTime)}</p>
                                <p>Address: {appointment.address}</p>
                                <p>Notes: {appointment.notes}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}