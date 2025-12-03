// ===============================================================
// Como funciona la API?
//
// Esta es una API REST que utiliza como base
// de datos una pagina Exel en la carpeta
// Content de este mismo proyecto (Alojado en el drive del dueño), 
// la ID de esta carpeta es ID_CARPETA_SHEET
//
// Para funcionar como base, debe de recibir
// 2 parametros:
//
// - El nombre del archivo Exel [sheetName]
// - El nombre de la hoja a modificar [tabName]
//
// Empezemos con los metodos, Lamentablemente 
// google app script solo admite los metodos
// get y post.
// Pero, para saltar esta limitación
// Enrutaremos el metodo post, para que con un nuevo
// parametro "action" podamos recurrir a put y delete
//
//
// get:
// 
// Con get obtendremos todo el contenido en un json
// de la hoja que espesificamos, y si pasamos el
// parametro [index], obtendremos una fila en especifico
// 
//
// post:
//
// Como lo mencionamos anteriormente, este metodo esta
// enrutando a los otros, para utilizar uno en especifico
// recurriremos al parametro [action]
//
// action == create, insert -> POST
// action == update, put -> PUT
// action == delete -> DELETE
//
// Con la acción Especificada, el metodo sera 
// enrutado respectivamente, PUT y DELETE trabajaran
// respecto a [index] para funcionar.
//
// Como ultimo detalle, en la primera fila se especifican
// los nombres de los datos, añadir un dato no especificado
// sera omitido completamente
//
// 
// =========================================================


import axios from "axios";

// URL base de tu script implementado
const baseURL = "https://script.google.com/macros/s/AKfycbyRxJbaNvu63y8XxFch5yovJTs2zx9M0_S2MTnByWYLDxLizYL6VHE5xbPIVI2tO1_S/exec";

// Configuración por defecto para evitar problemas con Google
const axiosConfig = {
    headers: {
        // CRUCIAL: Esto evita que el navegador lance la petición OPTIONS (Preflight)
        // que Google Apps Script no soporta.
        "Content-Type": "text/plain;charset=utf-8",
    },
};

export default class StorageLE {
    constructor(resourseName) {
        // Guardamos los parametros base. 
        // Usamos una propiedad para la URL limpia y params aparte si fuera necesario,
        // pero para mantener tu estilo, construiremos la URL completa.
        this.sheetName = "SteamLE";
        this.tabName = resourseName;
        
        // Construimos la URL base para este recurso
        this.resourceURL = `${baseURL}?sheetName=${this.sheetName}&tabName=${this.tabName}`;
    }

    /**
     * Obtiene todos los registros de la hoja
     */
    async getAll() {
        try {
            const response = await axios.get(this.resourceURL);
            return response.data;
        } catch (error) {
            console.error("Error en getAll:", error);
            throw error;
        }
    }

    /**
     * Obtiene un registro por su INDEX (Fila lógica)
     * @param {number} index 
     */
    async getByIndex(index) {
        try {
            // Pasamos el index como parametro
            const response = await axios.get(`${this.resourceURL}&index=${index}`);
            return response.data;
        } catch (error) {
            console.error(`Error en getByIndex(${index}):`, error);
            throw error;
        }
    }

    /**
     * Crea un nuevo registro
     * NOTA: Aquí aplicamos el truco anti-CORS
     * @param {object} data Objeto con los datos { Columna: Valor }
     */
    async createData(data) {
        try {
            const url = `${this.resourceURL}&action=create`;
            
            // 1. Convertimos a String manualmente
            const payload = JSON.stringify(data);

            // 2. Enviamos con la configuración text/plain
            const response = await axios.post(url, payload, axiosConfig);
            return response.data;
        } catch (error) {
            console.error("Error en createData:", error);
            throw error;
        }
    }

    /**
     * Actualiza un registro existente
     * @param {number} index Índice a modificar
     * @param {object} data Datos a cambiar
     */
    async updateData(index, data) {
        try {
            const url = `${this.resourceURL}&action=update&index=${index}`;
            
            // Truco anti-CORS
            const payload = JSON.stringify(data);
            
            const response = await axios.post(url, payload, axiosConfig);
            return response.data;
        } catch (error) {
            console.error(`Error en updateData(${index}):`, error);
            throw error;
        }
    }

    /**
     * Elimina un registro
     * @param {number} index Índice a eliminar
     */
    async deleteData(index) {
        try {
            const url = `${this.resourceURL}&action=delete&index=${index}`;
            
            // Aunque no enviemos datos, enviamos un body vacío stringified
            // y la cabecera text/plain para mantener consistencia y evitar errores 411/CORS.
            const response = await axios.post(url, JSON.stringify({}), axiosConfig);
            return response.data;
        } catch (error) {
            console.error(`Error en deleteData(${index}):`, error);
            throw error;
        }
    }
}
