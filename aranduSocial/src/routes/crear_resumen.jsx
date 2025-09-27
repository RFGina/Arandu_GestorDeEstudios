import { VStack, Button, Field, Input, Box, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { getFolder } from "@/api/arandu.api";

export const FormResumen = () => {
    const [titulo, setTitulo] = useState('')
    const [contenido, setContenido] = useState('')
    const [loading, setLoading] = useState(false)
    const { crear_resumen } = useAuth(); 
    const nav = useNavigate();
    const params = useParams()

      const cargarCarpetas = async () => {
            if (params.id) {
                try {
                    setLoading(true);
                    const resumenes = await getFolder();
                    setResumen(resumenes);
                } catch (error) {
                    console.error('Error fetching summaries:', error);
                    toast.error('Error al cargar los resúmenes');
                } finally {
                    setLoading(false);
                }
            }
        };

    const handleResumen = async (e) => {
        e.preventDefault()
        
        if (!titulo.trim()) {
            alert('El título es obligatorio')
            return
        }

        if (!contenido.trim()) {
            alert('El contenido es obligatorio')
            return
        }

        setLoading(true)
        
        try {
            console.log('📝 Creando resumen con params:', params);
            
            // Espera la respuesta de la función
            const resultado = await crear_resumen(params.id, titulo, contenido);
            
            // verifica  si fue exitoso
            if (resultado.success) {
                // redirige solo si fue exitoso
                nav(`/resumenes/${params.id}`);
            }
            
            
        } catch (error) {
            console.error('❌ Error al crear el resumen:', error);
            
            // Este bloque solo se ejecutará si hay un error inesperado
            toast.error('Error inesperado al crear el resumen');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box maxW="600px" width="100%" margin="auto" p="4">
            <VStack as="form" onSubmit={handleResumen} gap="4" align="flex-start">
                <Field.Root>
                    <Text fontSize="xl" fontWeight="bold">Crear Nuevo Resumen</Text>
                    <Field.Label>Título del resumen:</Field.Label>
                    <Input 
                        onChange={(e) => setTitulo(e.target.value)} 
                        value={titulo} 
                        type="text"
                        required
                        placeholder="Ingresa el título del resumen"
                        disabled={loading}
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
                        disabled={loading}
                    />
                </Field.Root>
               
                <Button 
                    type="submit" 
                    isLoading={loading}
                    loadingText="Creando..."
                    colorScheme="blue"
                    width="100%"
                >
                    Crear resumen
                </Button>
            </VStack>
        </Box>
    )
}