import { getToken } from "./authManager";

const baseUrl = '/api/appointment';

export const getMyAppointments = () => {
    return getToken().then((token) => {
        return fetch(baseUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json());
    })
};