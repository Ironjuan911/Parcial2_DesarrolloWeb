// ===============================================================
// Como funciona la API?
//
// Esta es una API REST que utiliza como base
// de datos una pagina Exel en la carpeta
// Content de este mismo proyecto (Alojado en el drive del dueño), 
// la ID de este archivo es [sheetId]
//
// Para funcionar como base, debe de recibir
// 2 parametros:
//
// - El id del archivo Exel [sheetId]
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
import { useLoadingStore } from "../store/loadingStore";

// URL base de tu script implementado
const baseURL = "https://script.google.com/macros/s/AKfycbxCoatx5hTF_KxVsjfrmJWkbAUWqU4sSphqSLizf_TqX6wcjvti4dNZVjduLvmgrH-L/exec";

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


        this.sheetId = "1uvLuyzSk9a8sxJxaG_fhhpJQrkSVO_n2-RIZH7g9030"; // ID de la hoja de cálculo
        this.tabName = resourseName;
        
        // Construimos la URL base para este recurso
        this.resourceURL = `${baseURL}?sheetId=${this.sheetId}&tabName=${this.tabName}`;
        this.loadingStore = useLoadingStore();
    }

    /**
     * Obtiene todos los registros de la hoja
     */
    async getAll() {
        let response;
        try {
            this.loadingStore.loadingPromise();
            response = await axios.get(this.resourceURL);
            
        } catch (error) {
            console.error("Error en getAll:", error);
            throw error;
        } finally {
            this.loadingStore.solvePromise();
        }

        return response.data;
    }

    /**
     * Obtiene un registro por su INDEX (Fila lógica)
     * @param {number} index 
     */
    async getByIndex(index) {
        let response;
        try {
            this.loadingStore.loadingPromise();
            response = await axios.get(`${this.resourceURL}&index=${index}`);
        } catch (error) {
            console.error(`Error en getByIndex(${index}):`, error);
            throw error;
        } finally {
            this.loadingStore.solvePromise();
        }

        return response.data;
    }

    /**
     * Crea un nuevo registro
     * NOTA: Aquí aplicamos el truco anti-CORS
     * @param {object} data Objeto con los datos { Columna: Valor }
     */
    async createData(data) {
        let response;
        try {
            this.loadingStore.loadingPromise();
            const url = `${this.resourceURL}&action=create`;
            
            // 1. Convertimos a String manualmente
            const payload = JSON.stringify(data);

            // 2. Enviamos con la configuración text/plain
            response = await axios.post(url, payload, axiosConfig);
        } catch (error) {
            console.error("Error en createData:", error);
            throw error;
        } finally {
            this.loadingStore.solvePromise();
        }

        return response.data;
    }

    /**
     * Actualiza un registro existente
     * @param {number} index Índice a modificar
     * @param {object} data Datos a cambiar
     */
    async updateData(index, data) {
        let response;
        try {
            this.loadingStore.loadingPromise();
            const url = `${this.resourceURL}&action=update&index=${index}`;
            
            // Truco anti-CORS
            const payload = JSON.stringify(data);
            
            response = await axios.post(url, payload, axiosConfig);
        } catch (error) {
            console.error(`Error en updateData(${index}):`, error);
            throw error;
        } finally {
            this.loadingStore.solvePromise();
        }

        return response.data;
    }

    /**
     * Elimina un registro
     * @param {number} index Índice a eliminar
     */
    async deleteData(index) {
        let response;
        try {
            this.loadingStore.loadingPromise();
            const url = `${this.resourceURL}&action=delete&index=${index}`;
            
            // Aunque no enviemos datos, enviamos un body vacío stringified
            // y la cabecera text/plain para mantener consistencia y evitar errores 411/CORS.
            response = await axios.post(url, JSON.stringify({}), axiosConfig);
        } catch (error) {
            console.error(`Error en deleteData(${index}):`, error);
            throw error;
        } finally {
            this.loadingStore.solvePromise();
        }

        return response.data;
    }
}
