import { getToken } from "./authManager";

const _apiUrl = '/api/appointment';

export const getMyAppointments = (userId, roleId) => {
    return getToken().then((token) => {
        return fetch(_apiUrl + '/getuserappointments?id=' + userId + '&roleId=' + roleId, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json());
    })
};

export const addAppointment = (appointment) => {
    return getToken().then((token) => {
        return fetch(_apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointment)
        })
    })
};

export const editAppointment = (appointment) => {
    return getToken().then((token) => {
        return fetch(`${_apiUrl} / ${appointment.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointment)
        })
    })
};

export const getAppointmentById = (id) => {
    return getToken().then((token) => {
        return fetch(`${_apiUrl} / ${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
    })
};

export const deleteAppointment = (id) => {
    return getToken().then((token) => {
        return fetch(`${_apiUrl} / ${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    })
};
