import React, { useEffect, useState } from "react";
import { getMyAppointments } from "../modules/appointmentManager";

export const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = () => {
        getMyAppointments().then(apptsFromAPI => setAppointments(apptsFromAPI));
    };

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
                                <h3>{appointment.userProfile?.name}</h3>
                                <p>{appointment.bookingTime}</p>
                                <p>{appointment.address}</p>
                                <p>{appointment.notes}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}