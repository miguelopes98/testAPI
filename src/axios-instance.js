import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://us-central1-testapi-6bce3.cloudfunctions.net/'
});

export default instance;