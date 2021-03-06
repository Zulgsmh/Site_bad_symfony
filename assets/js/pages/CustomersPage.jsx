import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/customersAPI';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

const CustomersPage = (props) => {
    
    const[customers, setCustomers] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[search, setSearch] = useState("");
    const[loading, setLoading] = useState(true);

    //Permet de récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll() 
            setCustomers(data)
            setLoading(false)
        } catch (error) {
            toast.error("Impossible de charger les clients.");
        }    
    }
    //Au chargement du composant, on récupère les customers.
    useEffect(() => {
        fetchCustomers()
    },[]);

    //Gestion de la suppression d'un customer
    const handleDelete = async (id) => {
        //copy des customers en cas d'échec de la requete delete
        const originalCustomers = [...customers];
        //affiche les customers sans le dernier retiré
        setCustomers(customers.filter(customer=>customer.id !== id))
        try {
            await CustomersAPI.delete(id)  
            toast.success("Le client a bien été supprimé.");  
        } catch (error) {
             /* en cas d'echec de la requete remodifie la liste 
            pour afficher tous les anciens customers avant la suppresion */
            toast.error("Une erreur est survenue lors de la suppression.");
            setCustomers(originalCustomers);
        }   
    };

    //Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

     //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    

    //Filtrage des customers en fontion des champs
    const filteredCustomers = customers.filter(
        customer => 
            customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
            customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            customer.email.toLowerCase().includes(search.toLowerCase()) ||
            (customer.company && customer.company.toLowerCase().includes(search.toLowerCase()))
    );

    //pagination
    const itemsPerPage = 10;

    //pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers, 
        currentPage, 
        itemsPerPage
    ) 

   

    return ( 
        <>
            <div className="mb-2 d-flex justify-content-between align-items-center">
                <h1>Liste des clients : </h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>
            

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} placeholder="Rechercher..." className="form-control"/>
            </div>

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

                    {!loading && (<tbody>
                    {paginatedCustomers.map(customer =>
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <Link to={"/customers/"+customer.id}>{customer.firstName} {customer.lastName}</Link>
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
                    </tbody>)} 
                        
                </table>


                    {loading && <TableLoader/>}
                

                {itemsPerPage < filteredCustomers.length && <Pagination 
                        currentPage={currentPage} 
                        itemsPerPage={itemsPerPage} 
                        length={filteredCustomers.length} 
                        onPageChanged={handlePageChange} 
                    />
                }
        </>
     );
};
 
export default CustomersPage;