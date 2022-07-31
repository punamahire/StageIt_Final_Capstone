import { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { editAppointment, getAppointmentById } from '../modules/appointmentManager';
import { getUserProfileById, getUserByFirebaseId } from '../modules/authManager';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

export const EditAppointmentForm = () => {

    const [appointment, setAppointment] = useState({});
    const [userProfile, setUserProfile] = useState();
    const [invalidInput, setInvalidInput] = useState(false);
    // get the appointment id from the url
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const getAppointment = () => {
        getAppointmentById(appointmentId).then(apptFromAPI => {
            setAppointment(apptFromAPI);
            getUserByFirebaseId().then(user => {
                // get the appropriate userprofile to display his/her name on top of the edit form.
                // if current user is client - get stager's profile to display name on the form
                // if current user is stager - get client's profile to display name on the form
                if (apptFromAPI.userProfileId === user.id) {
                    getUserProfileById(apptFromAPI.stagerId).then(stager => setUserProfile(stager));
                }
                else {
                    getUserProfileById(apptFromAPI.userProfileId).then(client => setUserProfile(client));
                }
            });
        });
    }

    const handleCancel = (event) => {
        event.preventDefault();
        navigate("/myappointments")
    }

    const handleEditAppointment = (event) => {
        event.preventDefault();
        if (appointment.address === "" || appointment.appointmentTime === "") {
            setInvalidInput(true);
        }
        else {
            // assign the values from the react state to a new object.
            // some properties won't change (like the ids),
            // some are fetched from the edit form.
            const editedAppointment = {
                id: appointmentId,
                userProfileId: appointment.userProfileId,
                stagerId: appointment.stagerId,
                appointmentTime: appointment.appointmentTime,
                address: appointment.address,
                isFurnished: appointment.isFurnished,
                notes: appointment.notes
            };

            // after updating the appointment in the DB,
            // navigate the user back to the updated list
            // of appointments
            editAppointment(editedAppointment)
                .then(resp => navigate('/myappointments'));
        }
    }

    const handleInputChange = (event) => {
        const apptCopy = { ...appointment }

        apptCopy[event.target.id] = event.target.value;
        setAppointment(apptCopy);
    }

    const handleOptionChange = (event) => {
        const apptCopy = { ...appointment }

        apptCopy.isFurnished = event.target.value === 'true';
        setAppointment(apptCopy);
    }

    useEffect(() => {
        getAppointment();
    }, [])

    return (
        <div className="container col-sm-6">
            <div className='my-2'>
                <h1>Update Appointment</h1>
                {userProfile &&
                    <h4>Stager: {userProfile.name}</h4>
                }
            </div>
            <Form>
                {invalidInput && <div className='alert alert-danger'>Invalid time or address. Please try again.</div>}
                <FormGroup>
                    <Label for="appointmentTime">Appointment Time</Label>
                    <Input type="datetime-local" name="appointmentTime" id="appointmentTime"
                        value={appointment.appointmentTime ? appointment.appointmentTime : ''}
                        onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" id="address" placeholder="Staging Address"
                        value={appointment.address ? appointment.address : ''}
                        onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label for="furnished">Is Home Furnished or Vacant?</Label>
                    {/* Since, the radio button values are of type string "true" or
                        "false", we used toString() to compare. The appointment object
                        has isFurnished as a boolean. */}
                    <div>
                        <Input type="radio" name="radioGroup" value="true"
                            checked={appointment.isFurnished?.toString() === 'true'}
                            onChange={handleOptionChange} /> Furnished &nbsp;
                        <Input type="radio" name="radioGroup" value="false"
                            checked={appointment.isFurnished?.toString() === 'false'}
                            onChange={handleOptionChange} /> Vacant
                    </div>
                </FormGroup>
                <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input type="textarea" name="notes" id="notes" placeholder="Any Notes..."
                        value={appointment.notes ? appointment.notes : ''}
                        onChange={handleInputChange} />
                </FormGroup>
                <Button color="primary" onClick={handleEditAppointment}>Update</Button> &nbsp;
                <Button color="secondary" onClick={handleCancel}>Cancel</Button>
            </Form>
        </div>
    )
}