import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContext';
import AuthAPI from '../services/authAPI';

const Navbar = ({history}) => {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)

    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        toast.info("Vous êtes désormais déconnecté.");
        history.push("/");
    }
    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <NavLink className="navbar-brand" to="/">Symfony/React</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/customers">Clients</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/invoices">Factures</NavLink>
                </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                {!isAuthenticated && <>
                    <li className="nav-item">
                        <NavLink to="/register" className="nav-link">inscription</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/login" className="btn btn-success mr-1">Connexion</NavLink>
                    </li>
                </>}
                {isAuthenticated && <>
                    <li className="nav-item">
                        <button onClick={handleLogout} className="btn btn-danger">deconnexion</button>
                    </li>
                </>}
                </ul>
            </div>
        </nav>
     );
}
 
export default Navbar;