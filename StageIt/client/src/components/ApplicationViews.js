import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { StagerList } from "./StagerList";
import { AppointmentList } from "./AppointmentList";
import { CreateAppointmentForm } from "./CreateAppointmentForm";
import { EditAppointmentForm } from "./EditAppointmentForm";

export default function ApplicationViews({ isLoggedIn }) {
    return (
        <main>
            <Routes>
                <Route path="/">
                    <Route
                        index
                        element={isLoggedIn ? <StagerList /> : <Navigate to="/login" />}
                    />

                    <Route path="myappointments">
                        <Route index element={isLoggedIn ? <AppointmentList /> : <Navigate to="/login" />} />
                        <Route path="add/:id" element={<CreateAppointmentForm />} />
                        <Route path="edit/:appointmentId" element={<EditAppointmentForm />} />
                        {/* <Route path=":id" element={<AppointmentDetails />} />
                        <Route path="delete/:id" element={<DeleteAppointment />} /> */}
                    </Route>

                    {/* <Route path="stagingimages">
                        <Route exact path="/stagingimages/:stagerId/images" element={<StagingImages />} />
                    </Route> */}

                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

                    <Route path="*" element={<p>Whoops, nothing here...</p>} />

                </Route>
            </Routes>
        </main >
    );
};