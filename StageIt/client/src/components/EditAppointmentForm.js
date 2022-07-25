import { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { editAppointment, getAppointmentById } from '../modules/appointmentManager';
import { useNavigate, useParams } from 'react-router-dom';

export const EditAppointmentForm = () => {

    const [appointment, setAppointment] = useState({});
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const getAppointment = () => {
        getAppointmentById(appointmentId).then(apptFromAPI => setAppointment(apptFromAPI));
    }

    const handleCancel = (event) => {
        event.preventDefault();
        navigate("/myappointments")
    }

    const handleEditAppointment = (event) => {
        event.preventDefault();

        const editedAppointment = {
            id: appointmentId,
            userProfileId: appointment.userProfileId,
            stagerId: appointment.stagerId,
            appointmentTime: appointment.appointmentTime,
            address: appointment.address,
            notes: appointment.notes
        };

        editAppointment(editedAppointment)
            .then(r => navigate('/myappointments'));
    }

    const handleInputChange = (event) => {
        const apptCopy = { ...appointment }

        apptCopy[event.target.id] = event.target.value;
        setAppointment(apptCopy);
    }

    useEffect(() => {
        getAppointment();
    }, [])

    return (
        <div className="container col-sm-6">
            <h1>Update Appointment</h1>
            <Form>
                <FormGroup>
                    <Label for="appointmentTime">Appointment Time</Label>
                    <Input type="datetime-local" name="appointmentTime" id="appointmentTime" defaultValue={appointment.appointmentTime} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" id="address" placeholder="Staging Address" defaultValue={appointment.address} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input type="textarea" name="notes" id="notes" placeholder="Any Notes..." defaultValue={appointment.notes} onChange={handleInputChange} />
                </FormGroup>
                <Button className="mx-2" color="primary" onClick={handleEditAppointment}>Update</Button>
                <Button color="secondary" onClick={handleCancel}>Cancel</Button>
            </Form>
        </div>
    )
}