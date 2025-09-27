import { is_authenticated } from "@/api/arandu.api";
import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, register, post_folder, update_folder, create_resumen, update_resumen } from "@/api/arandu.api"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true)
    const nav = useNavigate();

    const get_authenticated = async () => {
        try {
           const success = await is_authenticated();
            setIsAuthenticated(success)
        }catch{
            setIsAuthenticated(false)
        }finally{
            setLoading(false)
        }
    }

    const login_user = async (username, password) => {
        const success = await login(username, password);
        if (success) {
            setIsAuthenticated(true)
            nav('/')
        }
    }

    const logout_user = async () => {
        const success = await logout();
        if (success) {
            setIsAuthenticated(false);
            nav('/login');
        }
        return success;
    }

    const register_user = async(username, email, password, cPassword) => {
        if(password === cPassword){
            try{
                await register(username, email, password)
                alert('Usuario registrado')
                nav('/login')
            }catch{
                alert('Error al registrar usuario')
            }
           
        }else{
            alert('Las contraseñas no coinciden')
        }
        
    }

    const register_carpeta = async (nombre, descripcion) => {
        try {
            await post_folder(nombre, descripcion)
            alert('Carpeta registrada correctamente')
            nav('/')
        } catch (error) {
            console.error('Error completo al registrar carpeta:', error)
            
            // Mostrar mensaje de error más específico
            if (error.response) {
                // Error del servidor 
                alert(`Error del servidor: ${error.response.data?.message || error.response.status}`)
            } else if (error.request) {
                // Error de red
                alert('Error de conexión. Verifica tu internet.')
            } else {
                // Error general
                alert('Error al registrar carpeta')
            }
        }
    }

    const update_carpeta = async(id, nombre, descripcion) => {
        try{
            await update_folder(id, nombre, descripcion)
            toast.success('Carpeta actualizada con exito',{
                position: "bottom-right",
                style :{
                background: "#101010",
                color: "#fff"
            }
           } ) 
           nav('/')
        } catch(error){
            console.error('Error completo al actualizar carpeta:', error)
            
            // Mostrar mensaje de error más específico
            if (error.response) {
                // Error del servidor 
                toast.success(`Error del servidor: ${error.response.data?.message || error.response.status}`,{
                    position:"bottom-center",
                    style:{
                        background: "#902f2fff",
                        color: "#fff"
                    }
                })
            
            } else if (error.request) {
                // Error de red
                alert('Error de conexión. Verifica tu internet.')
            } else {
                // Error general
                alert('Error al registrar carpeta')
            }
        }
    }
     
   
const crear_resumen = async (carpetaId, titulo, contenido) => {
    try {
        await create_resumen(carpetaId, titulo, contenido);
        
       
        toast.success('Resumen creado con éxito', {
            position: "bottom-right",
            style: {
                background: "#101010",
                color: "#fff"
            }
        });
        
        
        return { success: true };
        
    } catch (error) {
        console.error('Error completo al crear Resumen:', error);
        
        
        if (error.response) {
            toast.error(`Error del servidor: ${error.response.data?.message || error.response.status}`, {
                position: "bottom-center",
                style: {
                    background: "#902f2fff",
                    color: "#fff"
                }
            });
        } else if (error.request) {
            toast.error('Error de conexión. Verifica tu internet.', {
                position: "bottom-center",
                style: {
                    background: "#902f2fff",
                    color: "#fff"
                }
            });
        } else {
            toast.error('Error al crear resumen', {
                position: "bottom-center",
                style: {
                    background: "#902f2fff",
                    color: "#fff"
                }
            });
        }
        
       
        return { success: false, error };
    }
}

    const editar_resumen = async (resumenId, titulo, contenido, carpetaId) => {
        try {
            console.log('Editando resumen:', { resumenId, titulo, contenido, carpetaId });
            await update_resumen(resumenId, titulo, contenido, carpetaId);
            toast.success('Resumen actualizado con éxito', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            });
            nav('/resumenes/' + carpetaId); 
        } catch (error) {
            console.error('Error completo al actualizar Resumen:', error);
            
            if (error.response) {
                toast.error(`Error: ${JSON.stringify(error.response.data)}`, {
                    position: "bottom-center",
                    style: {
                        background: "#902f2fff",
                        color: "#fff"
                    }
                });
            } else if (error.request) {
                toast.error('Error de conexión. Verifica tu internet.', {
                    position: "bottom-center",
                    style: {
                        background: "#902f2fff",
                        color: "#fff"
                    }
                });
            } else {
                toast.error('Error al actualizar resumen', {
                    position: "bottom-center",
                    style: {
                        background: "#902f2fff",
                        color: "#fff"
                    }
                });
            }
        }
    }


    useEffect(() =>{
        get_authenticated();
    }, []); 

    return(
        <AuthContext.Provider value={{isAuthenticated, loading, login_user, logout_user, register_user, register_carpeta, update_carpeta, crear_resumen, editar_resumen}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)