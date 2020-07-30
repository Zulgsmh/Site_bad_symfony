import React, { useState, useContext } from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';


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
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input 
                        value={credentials.username}
                        onChange={handleChange}
                        type="email" 
                        className={"form-control" + (error && " is-invalid")}
                        placeholder="Adresse email..." 
                        name="username" id="username"
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        value={credentials.password}
                        onChange={handleChange}
                        type="password" 
                        className="form-control" 
                        placeholder="Mot de passe..." 
                        name="password" id="password"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>
         </>
      );
 }
  
 export default LoginPage;