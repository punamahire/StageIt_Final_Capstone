import { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { addAppointment } from '../modules/appointmentManager';
import { getUserByFirebaseId } from '../modules/authManager';
import { useNavigate, useParams } from 'react-router-dom';

export const CreateAppointmentForm = () => {

    const [currentUser, setCurrentUser] = useState();
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState({
        userProfileId: 0,
        stagerId: 0,
        appointmentTime: new Date(),
        address: '',
        notes: '',
    })

    const getCurrentUser = () => {
        console.log("setting current user");
        getUserByFirebaseId().then(user => {
            console.log(`user: ${user}`);
            setCurrentUser(user);
        });
    }

    const handleCreateAppointment = (event) => {
        event.preventDefault();
        appointment.userProfileId = currentUser.id;
        addAppointment(appointment).then(r => navigate('/myappointments'));
    }

    const handleInputChange = (event) => {
        const apptCopy = { ...appointment }
        apptCopy.userProfileId = currentUser.Id;
        apptCopy.stagerId = id;

        apptCopy[event.target.id] = event.target.value;
        setAppointment(apptCopy);
    }

    useEffect(() => {
        getCurrentUser();
    }, [])

    return (
        <div className="container">
            <h1>Create New Appointment</h1>
            <Form>
                <FormGroup>
                    <Label for="apptDateTime">Appointment Time</Label>
                    <Input type="date" name="apptDateTime" id="apptDateTime" onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" id="address" placeholder="Staging Address" onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input type="textarea" name="notes" id="notes" placeholder="Any Notes..." onChange={handleInputChange} />
                </FormGroup>
                <Button onClick={handleCreateAppointment}>Submit</Button>
            </Form>
        </div>
    )
}