import { VStack, Button, Field, Input, Box, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { getResumen } from "@/api/arandu.api";

export const EditarResumen = () => {
    const [titulo, setTitulo] = useState('')
    const [contenido, setContenido] = useState('')
    const [loading, setLoading] = useState(false)
    const [resumenData, setResumenData] = useState(null) 
    const { editar_resumen } = useAuth(); 
    const nav = useNavigate();
    const params = useParams()

    const handleResumen = async (e) => {
        e.preventDefault()
        
        if (!titulo.trim() || !contenido.trim()) {
            alert('Todos los campos son obligatorios')
            return
        }

        setLoading(true)
        
        try {
            // Pasar carpetaId desde los datos del resumen
            await editar_resumen(params.resumenId, titulo, contenido, resumenData?.carpeta?.id || params.carpetaId)
            nav(`/resumenes/${params.carpetaId}`)
        } catch (error) {
            console.error('Error al editar el resumen:', error)
            alert('Error al editar el resumen')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        async function loadResumen() {
            if(params.resumenId){
                try {
                    const resumenData = await getResumen(params.resumenId)
                    setResumenData(resumenData) 
                    setTitulo(resumenData.titulo || '')
                    setContenido(resumenData.contenido || '')
                } catch (error) {
                    console.error('Error cargando resumen:', error)
                    alert('Error al cargar el resumen')
                }
            }
        }
        loadResumen()
    }, [params.resumenId])

    return (
        <Box maxW="600px" width="100%" margin="auto" p="4">
            <VStack as="form" onSubmit={handleResumen} gap="4" align="flex-start">
                <Field.Root>
                    <Text>Editar Resumen</Text>
                    <Field.Label>Título del resumen:</Field.Label>
                    <Input 
                        onChange={(e) => setTitulo(e.target.value)} 
                        value={titulo} 
                        type="text"
                        required
                        placeholder="Ingresa el título del resumen"
                    />
                </Field.Root>
                
                <Field.Root width="100%">
                    <Field.Label>Contenido del resumen:</Field.Label>
                    <Textarea 
                        onChange={(e) => setContenido(e.target.value)} 
                        value={contenido} 
                        required
                        placeholder="Escribe el contenido de tu resumen aquí..."
                        rows={10}
                    />
                </Field.Root>
               
                <Button 
                    type="submit" 
                    isLoading={loading}
                    loadingText="Editando..."
                >
                    Guardar cambios
                </Button>
            </VStack>
        </Box>
    )
}