import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { register } from "../modules/authManager";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [roleId, setRoleId] = useState();
    const [locationsServed, setLocationsServed] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const registerClick = (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            alert("Passwords don't match. Do better.");
        } else {
            // When a user registers, add a new userProfile
            // object to the DB and navigate the user to 
            // the stagers-list view 
            const userProfile = {
                name,
                imageUrl,
                email,
                roleId,
                locationsServed
            };
            register(userProfile, password).then(() => navigate("/"));
        }
    };

    return (
        <Form onSubmit={registerClick}>
            <fieldset>
                <FormGroup>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="imageUrl">Profile Image URL</Label>
                    <Input
                        id="imageUrl"
                        type="text"
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="roleId">Are you a Client or Stager?</Label>
                    <Input
                        id="roleId"
                        type="select"
                        onChange={(e) => setRoleId(e.target.value)}>
                        <option value="">Select Your Role</option>
                        <option value="1">Client</option>
                        <option value="2">Stager</option>
                    </Input>
                </FormGroup>
                {roleId == 2 &&
                    <FormGroup>
                        <Label htmlFor="locationsServed">Locations Served</Label>
                        <Input
                            id="locationsServed"
                            type="text"
                            onChange={(e) => setLocationsServed(e.target.value)}
                        />
                    </FormGroup>
                }
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Button>Register</Button>
                </FormGroup>
            </fieldset>
        </Form>
    );
}