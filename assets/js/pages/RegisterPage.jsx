import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import UsersAPI from '../services/usersAPI';
import { toast } from 'react-toastify';

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = ({currentTarget}) => {
        const { name, value} = currentTarget;
        setUser({...user, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};

        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Votre confirmation doit être identique au mot de passe";
            setErrors(apiErrors);
            return;
        }

        try {
            await UsersAPI.create(user);
            console.log("bonjour")
            setErrors({});
            toast.success("Votre compte à bien été créé.");
            history.replace("/login");
        } catch ({response}) {
            const {violations} = response.data;
            if(violations){
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
        }
    };

    return ( 
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field name="firstName" label="Prénom" placeholder="Votre prénom..." error={errors.firstName} onChange={handleChange} value={user.firstName}/>
                <Field name="lastName" label="Nom" placeholder="Votre nom..." error={errors.lastName} onChange={handleChange} value={user.lastName}/>
                <Field name="email" type="email" label="Email" placeholder="Votre email..." error={errors.email} onChange={handleChange} value={user.email}/>
                <Field name="password" type="password" label="Mot de passe" placeholder="Votre mot de passe..." error={errors.password} onChange={handleChange} value={user.password}/>
                <Field name="passwordConfirm" type="password" label="Confirmation du mot de passe" placeholder="Confirmez votre mot de passe..." error={errors.passwordConfirm} onChange={handleChange} value={user.passwordConfirm}/>
            

            <div className="form-group">
                <button type="submit" className="btn btn-success">Confirmer inscription</button>
                <Link to="/login" className="btn btn-link"> Vous êtes déjà inscrit ?</Link>
            </div>
            </form>
        </>
     );
}
 
export default RegisterPage;