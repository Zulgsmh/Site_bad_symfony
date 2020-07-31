import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import CustomersAPI from '../services/customersAPI';
import axios from 'axios';
import InvoicesAPI from '../services/invoicesAPI';

const InvoicePage = ({history, match}) => {

    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    const [editing, setEditing] = useState(false); 

    const [customers, setCustomers] = useState([]);

    //recup tous les clients
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            console.log(error.response);
            history.replace("/invoices");
        }
    }; 

    //récupérer une invoice par son id
    const fetchInvoice = async (id) => {
        try {
            const { amount , status, customer} = await InvoicesAPI.find(id);
            setInvoice({amount: amount, status: status, customer: customer.id});
        } catch (error) {
            console.log(error.response);
            history.replace("/invoices");
        }
    }
    
    //recup liste clients  à chaque chargement du composant
    useEffect(()=> {
        fetchCustomers();
    }, []);

    //recup bonne facture quand id url est modifié
    useEffect(()=> {
        if(id !== "new"){
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);
    
    //gestion des changement input du formulaire
    const handleChange = ({currentTarget}) => {
        const {name,value} = currentTarget;
        setInvoice({...invoice, [name]: value})
    }

    //gestion de la validation du form
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(editing){
                await InvoicesAPI.update(id, invoice);
            }else{
                await InvoicesAPI.create(invoice);
                history.replace("/invoices");
            }
        } catch ({response}) {
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach(({ propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });

                setErrors(apiErrors);
            }
        }
    };

    return ( <>
    {editing && (<h1>Modification d'une facture</h1>) || (<h1>Création de la facture</h1>)}
    <form onSubmit={handleSubmit}>
        <Field name="amount" type="number" placeholder="Montant de la facture" label="Montant" value={invoice.amount} onChange={handleChange} error={errors.amount}/>
        <Select name="customer" label="Client" value={invoice.customer} error={errors.customer} onChange={handleChange}> 
            { customers.map( customer =>
                <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
            )}    
        </Select>

        <Select name="status" label="Statut" value={invoice.status} error={errors.status} onChange={handleChange}>
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
        </Select>
        <div className="form-group">
            <button type="submit" className="btn btn-success">
                Enregistrer
            </button>
            <Link to="/invoices" className="btn btn-link">Retour à la liste des factures</Link>
        </div>
    </form>
    </> 
    );
}
 
export default InvoicePage;