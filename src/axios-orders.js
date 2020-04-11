import axios from 'axios'

const instant  = axios.create ({
    baseURL : 'https://react-my-burger-d34aa.firebaseio.com/'
});

export default instant;

