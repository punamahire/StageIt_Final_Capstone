import React, { useState } from 'react';
import { NavLink as RRNavLink } from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import { logout } from '../modules/authManager';
import './Header.css'

export default function Header({ isLoggedIn }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div id="nav">
            <Navbar color="dark" light expand="md">
                {/* <img
                    className="d-block w-100"
                    src="Images/Logo.jpg" width={10} height={50}
                    alt="First slide"
                /> */}
                <NavbarBrand tag={RRNavLink} to="/" className="nav-link" activeclassname="active">StageIt</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        { /* Home link should render irrespective of user login */}
                        <NavItem>
                            <NavLink tag={RRNavLink} to="/">Home</NavLink>
                        </NavItem>
                    </Nav>
                    <Nav navbar>
                        {isLoggedIn &&
                            <>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/myappointments">MyAppointments</NavLink>
                                </NavItem>

                                <NavItem>
                                    <a aria-current="page" className="nav-link"
                                        style={{ cursor: "pointer" }} onClick={logout}>Logout</a>
                                </NavItem>

                            </>
                        }
                        {!isLoggedIn &&
                            <>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/login">Login</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/register">Register</NavLink>
                                </NavItem>

                            </>
                        }
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}