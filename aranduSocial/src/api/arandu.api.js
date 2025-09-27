import axios from 'axios'

const BASE_URL = 'http://localhost:8000/resumen/'
const LOGIN_URL = `${BASE_URL}token/`
const REFRESH_URL = `${BASE_URL}token/refresh/`
const FOLDER_URL = `${BASE_URL}carpetas/`
const SUMMARY_URL = `${BASE_URL}resumen/`
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`
const REGISTER_URL = `${BASE_URL}registerUser/`

export const login = async (username, password) => {
    const response = await axios.post(LOGIN_URL,
        {username: username, password:password},
        {withCredentials: true}
    )
    return response.data.success
}

export const refresh_token = async () => {
    try{
        await axios.post(REFRESH_URL,
        {},
        {withCredentials: true}
        )
        return true
    } catch(error) {
        return false    }    
    
}

export const get_folder = async () => {
    try {
        const response = await axios.get(FOLDER_URL, 
        {withCredentials: true},
        ) 
        return response.data
    } catch(error) {
        return call_refresh(error, axios.get(FOLDER_URL, {withCredentials: true}))
    }    
}

export const post_folder = async (nombre, descripcion) => {
    try {
        const response = await axios.post(FOLDER_URL,
            {nombre: nombre, descripcion: descripcion},
            {withCredentials: true}
        )  
        return response.data
    } catch (error) {
        // Manejar error de refresh token si es necesario
        if (error.response && error.response.status === 401) {
            const tokenRefreshed = await refresh_token();
            if (tokenRefreshed) {
                // Reintentar la petición después de refrescar el token
                const retryResponse = await axios.post(FOLDER_URL,
                    {nombre: nombre, descripcion: descripcion},
                    {withCredentials: true}
                );
                return retryResponse.data;
            }
        }
        throw error; // Relanzar el error para manejarlo en el componente
    }
}


const call_refresh = async (error, func) => {
    if (error.response && error.response.status === 401){
        const tokenRefreshed = await refresh_token();

        if(tokenRefreshed){
            const retryResponse = await func();
            return retryResponse.data
        }
    }

    return false
    
}

export const logout = async () => {
    try {
        await axios.post(LOGOUT_URL,
            {},
            {withCredentials: true}
        )
        return true; 
    } catch (error) {
        return false;
    }
}

export const is_authenticated = async () => {
    try{
        await axios.post(AUTH_URL, {}, {withCredentials: true}  )
        return true
    } catch(error) {
        return false
    }
}

export const register = async (username, email, password) => {
    const response = axios.post(
        REGISTER_URL,
        {username: username, email:email, password:password},
        {withCredentials: true}
    )
    return response.data
}

export const getFolder = async (id) => {
    try {
        const response = await axios.get(
            `${FOLDER_URL}${id}/`,  
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Error fetching folder:', error)
        throw error
    }
}

export const update_folder = async (id, nombre, descripcion) => {
    try {
        const response = await axios.put(
            `${FOLDER_URL}${id}/`, 
            { nombre, descripcion }, 
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Error fetching folder:', error)
        throw error
    }
}

export const deleteFolder = async (id) => {
    try {
        const response = await axios.delete(
            `${FOLDER_URL}${id}/`,  
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Error fetching summary:', error)
        throw error
    }
}

export const get_resumenes = async (id) => {
    try {
        const response = await axios.get(
            `${SUMMARY_URL}?carpeta=${id}`,  
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Error fetching folder:', error)
        throw error
    }
}

export const create_resumen = async (carpetaId, titulo, contenido) => {
    try {
        const response = await axios.post(
            SUMMARY_URL,
            { 
                titulo: titulo,
                contenido: contenido,
                carpeta: carpetaId  
            },
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Error creating summary:', error)
        throw error
    }
}

export const update_resumen = async (id, titulo, contenido, carpetaId) => {
    try {
        const response = await axios.put(
            `${SUMMARY_URL}${id}/`,
            { 
                titulo: titulo,
                contenido: contenido,
                carpeta: carpetaId
            },
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Error updating summary:', error)
        throw error
    }
}

export const getResumen = async (id) => {
    try {
        const response = await axios.get(
            `${SUMMARY_URL}${id}/`,  
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Error fetching summary:', error)
        throw error
    }
}

export const deleteResumen = async (id) => {
    try {
        const response = await axios.delete(
            `${SUMMARY_URL}${id}/`,  
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Error fetching summary:', error)
        throw error
    }
}