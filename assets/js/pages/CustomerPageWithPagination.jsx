import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = (props) => {
    
    const[customers, setCustomers] = useState([]);
    const[totalItems, setTotalItems] = useState(0);
    const[currentPage, setCurrentPage] = useState(1);
    const[loading, setLoading] = useState(true);

    //pagination
    const itemsPerPage = 10;

    useEffect( () => {
        axios.get(`http://127.0.0.1:8002/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
        .then(response => {
            setCustomers(response.data["hydra:member"]);
            setTotalItems(response.data["hydra:totalItems"]);
            setLoading(false);
        })
        .catch(error=>console.log(error.response))
    },[currentPage]);

    const handleDelete = (id) => {
        //copy des customers en cas d'échec de la requete delete
        const originalCustomers = [...customers];
        
        //affiche les customers sans le dernier retiré
        setCustomers(customers.filter(customer=>customer.id !== id)) 

        axios.delete("http://127.0.0.1:8002/api/customers/"+id)
        .then(response => console.log("ok"))
        .catch(error=>{
            /* en cas d'echec de la requete remodifie la liste 
            pour afficher tous les anciens customers avant la suppresion */
            setCustomers(originalCustomers);
            console.log(error.response)
        })
    };

    const handlePageChange = (page) => {
        setCustomers([]);
        setCurrentPage(page);
        setLoading(true);
    };

    
    const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage) 

    return ( 
        <>
            <h1>Liste des clients : (pagination)</h1>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Client</th>
                            <th>Email</th>
                            <th>Entreprise</th>
                            <th className="text-center">Factures</th>
                            <th className="text-center">Montant Total</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                    {loading (
                        <tr>
                            <td>Chargement...</td>
                        </tr>
                    )}
                    {!loading && customers.map(customer =>
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">{customer.firstName} {customer.lastName}</a>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge badge-light"> {customer.invoices.length} </span>
                            </td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0} 
                                    className="btn btn-sm btn-danger">supprimer</button>
                            </td>
                        </tr>
                    )}
                        
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChanged={handlePageChange} />
        </>
     );
};
 
export default CustomersPageWithPagination;