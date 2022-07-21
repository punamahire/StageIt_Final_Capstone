import { getToken } from "./authManager";

const _apiUrl = '/api/userprofile';

export const getAllStagers = () => {
    return getToken().then((token) => {
        return fetch(_apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json());
    })
};