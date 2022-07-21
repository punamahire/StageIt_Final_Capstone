import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { StagerList } from "./StagerList";
import { AppointmentList } from "./AppointmentList";
import { CreateAppointmentForm } from "./CreateAppointmentForm";

export default function ApplicationViews({ isLoggedIn }) {
    return (
        <main>
            <Routes>
                <Route path="/">
                    <Route
                        index
                        element={isLoggedIn ? <StagerList /> : <Navigate to="/login" />}
                    />
                    <Route path="/">
                        <Route index element={isLoggedIn ? <AppointmentList /> : <Navigate to="/login" />} />
                    </Route>

                    <Route path="myappointments">
                        <Route index element={isLoggedIn ? <AppointmentList /> : <Navigate to="/login" />} />
                        <Route path="add/:id" element={<CreateAppointmentForm />} />
                        {/* <Route path=":id" element={<AppointmentDetails />} />
                        <Route path="edit/:id" element={<EditAppointmentForm />} />
                        <Route path="delete/:id" element={<DeleteAppointment />} /> */}
                    </Route>

                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

                    <Route path="*" element={<p>Whoops, nothing here...</p>} />

                </Route>
            </Routes>
        </main >
    );
};