import  React, { useState, useEffect } from 'react'
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomerAPI from "../services/customersAPI";

const CustomerPage = ({match, history}) => {
    const { id = "new" } = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [editing, setEditing] = useState(false);

    // Recuparation du customer avec id
    const fetchCustomer = async id => {
        try {
            const { firstName, lastName, email, company }  = await CustomerAPI.find(id);
            setCustomer({ firstName, lastName, email, company });
        } catch (error) {
            history.replace("/customers");
        }
    };

    // Chargement du customer si besoin au chargement
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // Gestion des inputs
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value});
    }

    // Gestion de la soumission du formulaire.
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if(editing) {
                await CustomerAPI.update(id, customer);
            } else {
                await CustomerAPI.create(customer);
                history.replace("/customers");
            }
            setErrors({});

        } catch ({response}) {
            const { violations } = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors);
            }
        }
    };

    return (
        <>
            {!editing && <h1>Création d'un Client</h1> || <h1>Modification du client</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Adresse du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    );
};

export default CustomerPage;