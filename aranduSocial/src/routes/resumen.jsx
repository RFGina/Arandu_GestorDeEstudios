import { 
  Stack, Heading, Text, Button, Box, HStack, Image, Show, SimpleGrid,
  Drawer, Portal, CloseButton, Menu, Grid, GridItem
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { get_resumenes, deleteResumen } from "@/api/arandu.api"; 
import { useAuth } from "@/contexts/useAuth";
import { HiMenu, HiDotsVertical, HiUserCircle, HiDotsHorizontal } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-hot-toast';

export const ResumenPag = () => {
    const [resumen, setResumen] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(6)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [loading, setLoading] = useState(false) 
    const { logout_user } = useAuth();
    const navigate = useNavigate();
    const params = useParams();

    // Función para cargar resúmenes
    const cargarResumenes = async () => {
        if (params.id) {
            try {
                setLoading(true);
                const resumenes = await get_resumenes(params.id);
                setResumen(resumenes);
            } catch (error) {
                console.error('Error fetching summaries:', error);
                toast.error('Error al cargar los resúmenes');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        cargarResumenes();
    }, [params.id]);

    // Función para eliminar resumen
    const handleEliminarResumen = async (resumenId) => {
        const accepted = window.confirm('¿Seguro que quieres eliminar este resumen?');
        if (!accepted) return;

        try {
            await deleteResumen(resumenId); 
            
            toast.success('Resumen eliminado correctamente', {
                position: "bottom-right",
                style: {
                    background: "#791919ff",
                    color: "#fff"
                }
            });
            
            
            await cargarResumenes();
            
        } catch (error) {
            console.error('Error eliminando resumen:', error);
            toast.error('Error al eliminar el resumen', {
                position: "bottom-right",
                style: {
                    background: "#902f2f",
                    color: "#fff"
                }
            });
        }
    };

    // Calcular los datos para la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = resumen.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(resumen.length / itemsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'Fecha no disponible';
        return new Date(fecha).toLocaleDateString('es-ES');
    };

    const handleNav = () => {
        navigate(`/formResumen/${params.id}`);
    };
    const resumenNav = () => {
        navigate(`/flashcard/${params.id}`)
    }

    const handleLogout = async () => {
        await logout_user();
    };

    return(
        <Stack gap="4">
            <Box p="4">
                <Heading size="md" mb="4">Tus Resúmenes</Heading>

                <Stack direction="row" gap="3" mb="3">
                    <Button 
                        onClick={handleNav} 
                        size="sm" 
                        colorPalette="green" 
                        variant="outline"
                    >
                        Crear resumen
                    </Button>
                    <Button 
                        onClick={resumenNav}
                        size="sm" 
                        colorPalette="green" 
                        variant="outline"
                    >
                        Ver como flashcard
                    </Button>
                </Stack>

                {/* Loading state */}
                {loading && (
                    <Text textAlign="center" py="4">Cargando...</Text>
                )}

                {/* Lista de resúmenes en grid responsivo */}
                <SimpleGrid 
                    columns={{ base: 1, md: 2, lg: 3 }} 
                    gap="4" 
                    mb="4"
                >
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <Box 
                                key={item.id || index} 
                                p="4" 
                                border="1px" 
                                borderColor="gray.200" 
                                borderRadius="md"
                                boxShadow="sm"
                                position="relative"
                                height="fit-content"
                            >
                                <HStack justify="space-between" mb="2">
                                    <Heading size="sm" noOfLines={1}>{item.titulo}</Heading>
                                    <Text fontSize="sm" color="gray.600" noOfLines={1}>
                                        {item.carpeta_nombre}
                                    </Text>
                                    
                                    <Menu.Root>
                                        <Menu.Trigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <HiDotsVertical />
                                            </Button>
                                        </Menu.Trigger>
                                        <Portal>
                                            <Menu.Positioner>
                                                <Menu.Content zIndex="dropdown">                        
                                                    <Menu.Item 
                                                        value="edit" 
                                                        onClick={() => {
                                                            navigate(`/editResumen/${params.id}/${item.id}`);
                                                        }}
                                                    >
                                                        Editar
                                                    </Menu.Item>
                                                    <Menu.Separator />
                                                    <Menu.Item 
                                                        value="delete" 
                                                        onClick={() => handleEliminarResumen(item.id)} 
                                                    >
                                                        🗑️ Eliminar
                                                    </Menu.Item>
                                                </Menu.Content>
                                            </Menu.Positioner>
                                        </Portal>
                                    </Menu.Root>
                                </HStack>
                                
                                {item.contenido && (
                                    <Text mb="2" noOfLines={3} fontSize="sm">
                                        {item.contenido}
                                    </Text>
                                )}
                                {item.fecha_creacion && (
                                    <Text color="gray.500" fontSize="xs">
                                        Creado: {formatFecha(item.fecha_creacion)}
                                    </Text>
                                )}
                            </Box>
                        ))
                    ) : (
                        !loading && (
                            <Box gridColumn="1 / -1">
                                <Text textAlign="center" color="gray.500" py="8">
                                    No hay resúmenes para mostrar
                                </Text>
                            </Box>
                        )
                    )}
                </SimpleGrid>

                {/* Paginación */}
                {totalPages > 1 && (
                    <Stack direction="row" gap="3" justifyContent="center" alignItems="center" mb="3">
                        <Button 
                            size="sm" 
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            colorPalette="blue"
                            variant="outline"
                        >
                            Anterior
                        </Button>
                        
                        <Text fontSize="sm" color="gray.600">
                            Página {currentPage} de {totalPages}
                        </Text>
                        
                        <Button 
                            size="sm" 
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            colorPalette="blue"
                            variant="outline"
                        >
                            Siguiente
                        </Button>
                    </Stack>
                )}

                <Text color="gray.600" fontSize="sm" textAlign="center">
                    Mostrando {currentItems.length} de {resumen.length} resúmenes
                </Text>

                <Stack direction="row" gap="3" mb="3">
                    <Button 
                        value="salir" 
                        size="sm" 
                        colorPalette="red" 
                        variant="outline" 
                        onClick={handleLogout}
                    >
                        Cerrar Sesión
                    </Button>
                </Stack>
            </Box>
        </Stack>
    );
};