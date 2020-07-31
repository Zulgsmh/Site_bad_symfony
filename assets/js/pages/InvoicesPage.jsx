import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/invoicesAPI';
import { Link } from 'react-router-dom';

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELLED: "danger"
};

 const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
 };


const InvoicesPage = (props) => {
  
    const[invoices, setInvoices] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[search, setSearch] = useState("");
    const itemsPerPage = 10;

    //Récupérer mes invoices 
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll()
            setInvoices(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    //afficher invoices au chargement de la page
    useEffect(() => {
        fetchInvoices();
    }, []);

    //gestion suppression
   const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        try {
            await InvoicesAPI.delete(id);   
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
        
    };

    //formater date
    const formatDate = (str ) => moment(str).format('DD/MM/YYYY'); 

    //Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);
    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

 

    //Filtrage des invoices en fontion des champs
    const filteredInvoices = invoices.filter(
        invoice => 
            invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
            invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            invoice.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[invoice.status].toLowerCase().includes(search.toLowerCase())
    );
    

    //pagination des données
    const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage, 
        itemsPerPage
    ); 

    

    return ( 
        <>
        <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
        </div>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} placeholder="Rechercher..." className="form-control"/>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => 
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge badge-"+STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">modifier</Link>
                            <button 
                                className="btn btn-sm btn-danger" 
                                onClick={() => handleDelete(invoice.id)} >supprimer</button>
                        </td> 
                    </tr>
                    )}  
                </tbody>
            </table>
            <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                onPageChanged={handlePageChange} 
                length={filteredInvoices.length}
            />
        </>
     );
}
 
export default InvoicesPage;