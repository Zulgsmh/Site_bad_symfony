import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomersAPI from '../services/customersAPI';
import Field from '../components/forms/Field';
import { toast } from 'react-toastify';
import FormContentLoader from '../components/loaders/FormContentLoader';

const CustomerPage = ({match, history}) => {

    const {id = "new"} = match.params;
    
    const [customer, setCustomer] = useState({
        lastName: "", 
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    

    //récupération customer par l'identifiant
    const fetchCustomer = async (id) => {
        try {
            const {firstName, lastName, email, company} = await CustomersAPI.find(id);
            setCustomer({firstName: firstName, lastName: lastName, email:email, company: company});
        } catch (error) {
            toast.error("Récupération du client impossible.");
            history.replace("/customers");
        }
            
    };

    //chargement customer au chargement du composant ou à la modification via l'id
    useEffect(() => {
        if(id !== "new"){
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
            setLoading(false);
        }
    }, [id]);

    //gestion des changement input du formulaire
    const handleChange = ({currentTarget}) => {
        const {name,value} = currentTarget;
        setCustomer({...customer, [name]: value})
    }
    
    //gestion soumission formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(editing){
                await CustomersAPI.update(id, customer);
                setErrors({});
                toast.success("Le client a bien été modifié.");
            } else {
                await CustomersAPI.create(customer);
                toast.success("Création du client réussie.")
                setErrors({});
                history.replace("/customers");
            }
        } catch ({response}) {
            const {violations} = response.data 
            if(violations){
                const apiErrors = {};
                violations.forEach(({propertyPath,message}) => {
                    apiErrors[propertyPath] = message;
                })
                setErrors(apiErrors);
            };
        }

    }

    return ( <>
        {loading && <FormContentLoader/>}
        { !editing && (<h1>Création d'un client</h1>) || (<h1>Modification du client {id}, {customer.firstName} {customer.lastName}</h1>) }
        {!loading && <form onSubmit={handleSubmit}>
            <Field  value={customer.lastName}  name="lastName" label="Nom de famille" placeholder="Nom de famille du client..." onChange={handleChange} error={errors.lastName}/>
            <Field  value={customer.firstName} name="firstName" label="Prénom" placeholder="Prénom du client..." onChange={handleChange} error={errors.firstName}/>
            <Field  value={customer.email} name="email" label="Email" placeholder="Adresse email du client..." type="email" onChange={handleChange} error={errors.email}/>
            <Field  value={customer.company} name="company" label="Entreprise" placeholder="Entreprise du client..." onChange={handleChange}/>

            <div className="form-group">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
            </div>
        </form>}
    </> );
}
 
export default CustomerPage;