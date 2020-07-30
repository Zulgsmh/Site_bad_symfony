import axios from "axios";
import CustomersAPI from './customersAPI';
import jwtDecode from 'jwt-decode';

/**
 * Requete http authentification et stockage token dans le localsotrage et axios
 * @param {object} credentials 
 */
function authenticate(credentials){
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            //je stocke le token dans le local storage
            window.localStorage.setItem("authToken", token);
            //on prévient axios qu'on à un header par default sur nos futures requetes http
            setAxiosToken(token);
        });
}

//Deconnexion, suppression du token du localstorage et axios
function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Positionne token jwt sur axios
 * @param {string} token 
 */
function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token;
};

/**
 * Mise en place lors du chargement de l'application 
 */
function setup(){
    const token = window.localStorage.getItem("authToken");

    if(token){
        const {exp: expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime() ){
            setAxiosToken(token);
        }
    } 
}

/**
 * Permet de savoir si on est authentifier
 * @returns boolean
 */
function isAuthenticated(){
    const token = window.localStorage.getItem("authToken");
    if(token){
        const {exp: expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime() ){
            setAxiosToken(token);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export default{
    authenticate,
    logout,
    setup,
    isAuthenticated
};