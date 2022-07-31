import { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { addAppointment, getMyAppointments } from '../modules/appointmentManager';
import { getUserByFirebaseId, getUserProfileById } from '../modules/authManager';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

export const CreateAppointmentForm = () => {

    const [currentUser, setCurrentUser] = useState({});
    const [userProfile, setUserProfile] = useState({});
    const { stagerId } = useParams();
    const [errorPresent, setErrorPresent] = useState(false);
    const [invalidInput, setInvalidInput] = useState(false);
    const navigate = useNavigate();

    // initialize the appointment state with default values
    const [appointment, setAppointment] = useState({
        userProfileId: 0,
        stagerId: 0,
        appointmentTime: '',
        address: '',
        isFurnished: false,
        notes: '',
    })

    const getCurrentUser = () => {
        getUserByFirebaseId().then(user => setCurrentUser(user));
    }

    const getUserById = () => {
        getUserProfileById(stagerId).then(stager => setUserProfile(stager));
    }

    const handleCreateAppointment = (event) => {
        event.preventDefault();
        appointment.userProfileId = currentUser.id;

        let errorP = false;

        if (appointment.address === "" || appointment.appointmentTime === "") {
            setInvalidInput(true);
        }
        else {
            getMyAppointments(appointment.stagerId, 2)
                .then(apptsFromAPI => {
                    for (let stgAppt of apptsFromAPI) {
                        console.log(`stager appt time: ${stgAppt.appointmentTime}, new appt time: ${appointment.appointmentTime}`);

                        console.log('------------------------');
                        console.log(moment(stgAppt.appointmentTime).diff(appointment.appointmentTime, 'hour'))
                        const timeDiff = moment(stgAppt.appointmentTime).diff(appointment.appointmentTime, 'hour');
                        if (timeDiff > 0 && timeDiff < 2) {
                            console.log("inside if");
                            setErrorPresent(true);
                            errorP = true;
                            break;
                        }
                    }

                    if (!errorP) {
                        addAppointment(appointment).then(resp => navigate('/myappointments'));
                        setErrorPresent(false);
                    }
                });
        }
    }

    const handleInputChange = (event) => {
        const apptCopy = { ...appointment }
        apptCopy.userProfileId = currentUser.Id;
        // assign the stagerId we got from the url
        apptCopy.stagerId = stagerId;

        apptCopy[event.target.id] = event.target.value;
        setAppointment(apptCopy);
    }

    const handleOptionChange = (event) => {
        const apptCopy = { ...appointment }

        apptCopy.isFurnished = event.target.value === 'true';
        setAppointment(apptCopy);
    }

    const handleCancel = (event) => {
        event.preventDefault();
        // navigate the user to all stagers view
        navigate("/");
    }

    useEffect(() => {
        getCurrentUser();
        getUserById();
    }, [])

    return (
        <div className="container col-sm-6">
            <div className='my-2'>
                {userProfile &&
                    <h2>Appointment with {userProfile.name}</h2>
                }
            </div>
            <Form>
                {errorPresent && <div className='alert alert-danger'>Stager is not available for the date/time selected. Please choose another time.</div>}
                {invalidInput && <div className='alert alert-danger'>Invalid time or address. Please try again.</div>}

                <FormGroup>
                    <Label for="appointmentTime">Appointment Time</Label>
                    <Input type="datetime-local" name="appointmentTime" id="appointmentTime"
                        onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" id="address" placeholder="Staging Address"
                        onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label for="furnished">Is Home Furnished or Vacant?</Label>
                    {/* Furnished is checked when its value is "true"
                        Vacant is checked when its value if "false"
                        Note: true and false are string values here */}
                    <div>
                        <Input type="radio" name="radioGroup" value="true"
                            onChange={handleOptionChange} /> Furnished &nbsp;
                        <Input type="radio" name="radioGroup" value="false" defaultChecked
                            onChange={handleOptionChange} /> Vacant
                    </div>
                </FormGroup>
                <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input type="textarea" name="notes" id="notes" placeholder="Enter Notes..."
                        onChange={handleInputChange} />
                </FormGroup>
                <Button color="primary" onClick={handleCreateAppointment}>Create</Button> &nbsp;&nbsp;
                <Button color="secondary" onClick={handleCancel}>Cancel</Button>
            </Form>
        </div>
    )
}