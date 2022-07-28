import { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { addAppointment } from '../modules/appointmentManager';
import { getUserByFirebaseId } from '../modules/authManager';
import { useNavigate, useParams } from 'react-router-dom';

export const CreateAppointmentForm = () => {

    const [currentUser, setCurrentUser] = useState();
    const { stagerId } = useParams();
    const navigate = useNavigate();

    // initialize the appointment state with default values
    const [appointment, setAppointment] = useState({
        userProfileId: 0,
        stagerId: 0,
        appointmentTime: '',
        address: '',
        notes: '',
    })

    const getCurrentUser = () => {
        getUserByFirebaseId().then(user => setCurrentUser(user));
    }

    const handleCreateAppointment = (event) => {
        event.preventDefault();
        appointment.userProfileId = currentUser.id;
        addAppointment(appointment).then(r => navigate('/myappointments'));
    }

    const handleInputChange = (event) => {
        const apptCopy = { ...appointment }
        apptCopy.userProfileId = currentUser.Id;
        // assign the stagerId we got from the url
        apptCopy.stagerId = stagerId;

        apptCopy[event.target.id] = event.target.value;
        setAppointment(apptCopy);
    }

    const handleCancel = (event) => {
        event.preventDefault();
        // navigate the user to all stagers view
        navigate("/");
    }

    useEffect(() => {
        getCurrentUser();
    }, [])

    return (
        <div className="container col-sm-6">
            <h1>Create New Appointment</h1>
            <Form>
                <FormGroup>
                    <Label for="appointmentTime">Appointment Time</Label>
                    <Input type="datetime-local" name="appointmentTime" id="appointmentTime" onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" id="address" placeholder="Staging Address" onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input type="textarea" name="notes" id="notes" placeholder="Any Notes..." onChange={handleInputChange} />
                </FormGroup>
                <Button color="primary" onClick={handleCreateAppointment}>Create</Button> &nbsp;&nbsp;
                <Button color="secondary" onClick={handleCancel}>Cancel</Button>
            </Form>
        </div>
    )
}