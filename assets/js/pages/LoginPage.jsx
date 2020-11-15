import  React, {useState, useContext} from 'react';
import AuthAPI from "../services/authAPI"
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        username : "",
        password : ""
    });

    const [error, setError] = useState("");

    // Gestion des champs
    const handleChange = event => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        setCredentials({...credentials, [name]: value});
    };

    // Gestion du submit
    const handleSubmit = async event => {
        // Pour que le formulaire ne recharge pas la page
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            setError("Le compte n'existe pas.")
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="Adresse email"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresser email de connexion"
                    error={error}
                />
                <Field
                    label="Mot de passe"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    type = "password"
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Connexion
                    </button>
                </div>
            </form>
        </>
    )
}

export default LoginPage;