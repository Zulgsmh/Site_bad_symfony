import React, { useState, useContext } from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';


 const LoginPage = ({history}) => {
     
    const {setIsAuthenticated} = useContext(AuthContext);

    const[credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const[error, setError] = useState("");

    //gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value})
    };

    //gestion submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await AuthAPI.authenticate(credentials);
            setError(""); 
            setIsAuthenticated(true);
            history.replace("/customers")
        } catch (error) {
            setError("Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas.");
        }
        console.log(credentials);
    };

     return ( 
         <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
            <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange} error={error}/>
            <Field type="password" label="Mot de passe" name="password" value={credentials.password} onChange={handleChange} error=""/>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                    <Link to="/register" className="btn btn-link">Vous n'avez pas encore de compte? cliquez ici</Link>
                </div>
            </form>
         </>
      );
 }
  
 export default LoginPage;