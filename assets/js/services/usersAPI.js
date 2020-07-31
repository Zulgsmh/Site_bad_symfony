import axios from 'axios';

function create(user){
    return(
        axios.post("http://localhost:8000/api/users", user)
    );
}

export default {
    create
};