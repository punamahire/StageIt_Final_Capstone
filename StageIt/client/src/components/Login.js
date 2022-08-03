import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate, Link } from "react-router-dom";
import { login } from "../modules/authManager";
import "./Form.css"

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const loginSubmit = (e) => {
        e.preventDefault();
        // upon login navigate the user to his appointments
        login(email, password)
            .then(() => navigate("/myappointments"))
            .catch(() => alert("Invalid email or password"));
    };

    return (
        <section className="vh-100 bg-image" >
            <div className="mask d-flex align-items-center h-100 gradient-custom">
                <div className="container py-5">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-10 col-md-8 col-lg-6">
                            <h1>Login</h1>
                            <Form onSubmit={loginSubmit}>
                                <fieldset>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="text"
                                            autoFocus
                                            placeholder="Enter email"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button color="primary">Login</Button>
                                    </FormGroup>
                                    <em>
                                        Not registered? <Link to="/register">Register</Link>
                                    </em>
                                </fieldset>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}