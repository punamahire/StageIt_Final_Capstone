import { getToken } from "./authManager";

const baseUrl = '/api/stager';

export const getAllStagers = () => {
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