import { VStack, Button, Field, Input, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { getFolder} from "@/api/arandu.api";

export const RegisterFolder = () => {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [loading, setLoading] = useState(false)
    const { register_carpeta, update_carpeta } = useAuth(); 
    const nav = useNavigate();
    const params = useParams()

    const handleCarpeta = async (e) => {
        e.preventDefault()
        
        if (!nombre.trim()) {
            alert('El nombre es obligatorio')
            return
        }

        setLoading(true)
        
        try {
            if(params.id){
                // Actualizar carpeta existente
                await update_carpeta(params.id, nombre, descripcion)
                nav('/')
            } else {
                // Crear nueva carpeta
                await register_carpeta(nombre, descripcion)
                nav('/')
            }
            nav('/')
        } catch (error) {
            console.error('Error al guardar la carpeta:', error)
            alert('Error al guardar la carpeta')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        async function loadFolder() {
            if(params.id){
                try {
                    const folderData = await getFolder(params.id)
                    setNombre(folderData.nombre || '')
                    setDescripcion(folderData.descripcion || '')
                } catch (error) {
                    console.error('Error cargando carpeta:', error)
                    alert('Error al cargar la carpeta')
                }
            }
        }
        loadFolder()
    }, [params.id])

    return (
        <Box maxW="400px" width="100%" margin="auto" p="4">
        <VStack as="form" onSubmit={handleCarpeta} gap="4" align="flex-start">
            <Field.Root>
                <Text>{params.id ? 'Editar Carpeta' : 'Crear Carpeta'}</Text>
                <Field.Label>Nombre de la carpeta:</Field.Label>
                <Input 
                    onChange={(e) => setNombre(e.target.value)} 
                    value={nombre} 
                    type="text"
                    required
                    placeholder="Ingresa el nombre de la carpeta"
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Descripción (opcional):</Field.Label>
                <Input 
                    onChange={(e) => setDescripcion(e.target.value)} 
                    value={descripcion} 
                    type="text"
                    placeholder="Ingresa una descripción"
                />
            </Field.Root>
           
            <Button 
                type="submit" 
                isLoading={loading}
                loadingText={params.id ? "Actualizando..." : "Creando..."}
            >
                {params.id ? 'Actualizar carpeta' : 'Crear carpeta'}
            </Button>
        </VStack>
        </Box>
    )
}