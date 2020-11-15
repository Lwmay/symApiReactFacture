import  React, { useState, useEffect } from 'react'
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import {Link} from "react-router-dom";
import customersAPI from "../services/customersAPI";
import invoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [customers, setCustomers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    // Récupération des clients
    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);
            if (!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            history.replace('/invoices');
        }
    };

    // Récupération d'une facture
    const fetchInvoice = async  id => {
        try {
            const data = await invoicesAPI.find(id);
            const { amount, status, customer } = data;
            setInvoice({ amount, status, customer: id });
        } catch (error) {
            history.replace('/invoices');
        }
    }

    // Récupération de la liste des clients lancement à chaque chargement
    useEffect(() => {
        fetchCustomers()
    }, [])

    // Récupération de la facture au changement d'url
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id])

    // Gestion des inputs
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice  , [name]: value});
    }

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if(editing) {
                await invoicesAPI.update(id, invoice);
            } else {
                await invoicesAPI.create(invoice);
                history.replace("/invoices");
            }

        } catch ({response}) {
            console.log(response);
            const { violations } = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors);
            }
        }
    }

    return (
        <>
            {editing && <h1>Modification de la facture</h1> || <h1>Création d'une facture</h1>}
            <form onSubmit={handleSubmit}>
                <Field name="amount" type="number" placeholder="Montant de la facture" label="Montant"
                       onChange={handleChange} value={invoice.amount} error={errors.amount}
                />
                <Select name="customer" label="Client" value={invoice.customer} error={errors.customer}
                        onChange={handleChange}>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    ))}
                </Select>

                <Select name="status" label="Statut" value={invoice.status} error={errors.status}
                        onChange={handleChange}>
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to={"/invoices"} className="btn btn-link">Retour aux factures</Link>
                </div>
            </form>


        </>
    );
}

export default InvoicePage;