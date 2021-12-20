import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import { createStore, createEvent } from 'effector';

const setTokenTOStore = createEvent();
const tokenFromStore = createStore('').on(
    setTokenTOStore,
    (_, newToken) => newToken
);
export const instanceAPI = axios.create({
    //TODO create env_variable
    baseURL: 'https://localhost:5001/api/',
});

export function APISetup() {
    const { getAccessTokenSilently } = useAuth0();
    useEffect(() => {
        (async () => {
            try {
                const token = await getAccessTokenSilently();
                setTokenTOStore(token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [getAccessTokenSilently]);
    return null;
}

const tokenHeader = (config) => {
    const token = tokenFromStore.getState();
    if (token !== '') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};
const authError = (err) => {
    const status = err?.response?.status;
    if (status === 401) {
        //TODO something
    }
    return Promise.reject(err);
};

instanceAPI.interceptors.request.use(tokenHeader);
instanceAPI.interceptors.response.use((response) => response, authError);

export const apiInvoker = {
    companies: {
        async getCompanies() {
            return await instanceAPI.get('companies');
        },
        async createCompany(companyName) {
            return await instanceAPI.post('companies', { name: companyName });
        },
    },
};
