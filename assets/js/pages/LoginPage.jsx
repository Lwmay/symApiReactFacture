import  React, {useState, useContext} from 'react';
import AuthAPI from "../services/authAPI"
import AuthContext from "../contexts/AuthContext";

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
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input value={credentials.username} onChange={handleChange}
                           type="email" placeholder="Adresser email de connexion" name="username" id="username"
                           className={"form-control" + (error && " is-invalid")}/>
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input value={credentials.password} onChange={handleChange}
                           type="password" placeholder="Mot de passe" name="password" id="password"
                           className="form-control"/>
                </div>
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