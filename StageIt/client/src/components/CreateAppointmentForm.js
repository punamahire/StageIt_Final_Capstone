import { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { addAppointment, getMyAppointments } from '../modules/appointmentManager';
import { getUserByFirebaseId, getUserProfileById } from '../modules/authManager';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import "./Form.css"

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
        rooms: 0,
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

        let timeOverlap = false;

        if (appointment.address === "" || appointment.appointmentTime === "") {
            setInvalidInput(true);
        }
        else {
            // If the selected time overlaps with any of the appts 
            // of the stager, flash an error message to the
            // user to choose another time. 
            getMyAppointments(appointment.stagerId, 2)
                .then(apptsFromAPI => {
                    for (let stgAppt of apptsFromAPI) {
                        if (!timeOverlap) {
                            const duration = moment.duration(moment(appointment.appointmentTime).diff(stgAppt.appointmentTime));
                            var timeDiff = duration.asHours();

                            // the time selected should have a difference
                            // of 2 hours or more, from existing appointments
                            // of this stager.
                            if (timeDiff >= 0 && timeDiff < 2) {
                                setErrorPresent(true);
                                timeOverlap = true;
                                break;
                            }
                        }
                    }

                    if (!timeOverlap) {
                        addAppointment(appointment).then(resp => {
                            setErrorPresent(false);
                            navigate('/myappointments');
                        });
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
        <section className="vh-100 bg-image" >
            <div className="mask d-flex align-items-center h-100 gradient-custom">
                <div className="container py-5">
                    <div className="container col-sm-6 form-container">
                        <div className='my-3'>
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
                                <Label htmlFor="rooms">Number of Rooms</Label>
                                <Input
                                    id="rooms"
                                    type="select"
                                    onChange={handleInputChange}>
                                    <option value="0">Select Number of Rooms</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Input>
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
                </div>
            </div>
        </section>
    )
}