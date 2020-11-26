import axios from "axios";
import jwtDecode from "jwt-decode";
import {LOGIN_API} from "../config";

/**
 * Déconnexion (suppression du token du localStorage et Axios.
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du token dans le localStorage et Axios.
 * @param {object} credentials
 * @returns {Promise<boolean>}
 */
function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // On stocke le token dans le localstorage
            window.localStorage.setItem("authToken", token);

            // On prévient Axios qu'on a maintenant un header par default sur toutes nos futures requêtes http.
            setAxiosToken(token);

            return true;
        });
}

/**
 * Positione le token JWT sur Axios.
 * @param token
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 * @returns {boolean}
 */
function setup () {
    // Voir si on a un token
    const token = window.localStorage.getItem("authToken");

    // Si le token est encore valide
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
    }
}

/**
 * Permet de vérifier si l'utilisateur est authentifié.
 * @returns {boolean}
 */
function isAuthenticated() {
    // Voir si on a un token
    const token = window.localStorage.getItem("authToken");

    // Si le token est encore valide
    if (token) {
        const jwtData = jwtDecode(token);
        return jwtData.exp * 1000 > new Date().getTime();

    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}