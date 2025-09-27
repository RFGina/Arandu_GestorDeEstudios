import { 
  Stack, Heading, Text, Button, Box, HStack, Image, Show, SimpleGrid,
  Drawer, Portal, CloseButton, Menu, Grid, GridItem
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { get_folder, get_resumenes, deleteFolder } from "@/api/arandu.api";
import { useAuth } from "@/contexts/useAuth";
import { HiMenu, HiDotsVertical, HiUserCircle, HiDotsHorizontal } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-hot-toast';

export const MenuPage = () => {
    const [carpetas, setCarpetas] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { logout_user } = useAuth();
    const navigate = useNavigate();
    const params = useParams();

    // Función para cargar carpetas
    const cargarCarpetas = async () => {
        try {
            setLoading(true);
            const carpetasData = await get_folder(); 
            setCarpetas(carpetasData);
        } catch (error) {
            console.error('Error cargando carpetas:', error);
            toast.error('Error al cargar las carpetas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCarpetas();
    }, []);

    // Calcular los datos para la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = carpetas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(carpetas.length / itemsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }

    const formatFecha = (fecha) => {
        if (!fecha) return 'Fecha no disponible';
        return new Date(fecha).toLocaleDateString('es-ES');
    }

    const handleNav = () => {
        navigate('/registerFolder');
    }

    const handleLogout = async () => {
        await logout_user();
    }

    const handleEliminarCarpeta = async (carpetaId) => {
        const accepted = window.confirm('¿Seguro que quieres eliminar esta carpeta?');
        if (!accepted) return;

        try {
            await deleteFolder(carpetaId); 
            
            toast.success('Carpeta eliminada correctamente', {
                position: "bottom-right",
                style: {
                    background: "#791919ff",
                    color: "#fff"
                }
            });
            
            // Recargar las carpetas después de eliminar
            await cargarCarpetas();
            
            // Resetear a la página 1 si la página actual queda vacía
            if (currentItems.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
            
        } catch (error) {
            console.error('Error eliminando carpeta:', error);
            toast.error('Error al eliminar la carpeta', {
                position: "bottom-right",
                style: {
                    background: "#902f2f",
                    color: "#fff"
                }
            });
        }
    };

    return(
        <Stack gap="4">
            {/* Contenido principal */}
            <Box p="4">
                <Heading size="md" mb="4">Tus Carpetas</Heading>

                <Stack direction="row" gap="3" mb="3">
                    <Button 
                        onClick={handleNav} 
                        size="sm" 
                        colorPalette="green" 
                        variant="outline"
                    >Crear nueva carpeta</Button>
                </Stack>
                
                {/* Loading state */}
                {loading && (
                    <Text textAlign="center" py="4">Cargando carpetas...</Text>
                )}
                
                {/* Lista de carpetas */}
                <SimpleGrid 
                    columns={{ base: 1, md: 2, lg: 3 }} 
                    gap="4" 
                    mb="4"
                >
                    {!loading && currentItems.length > 0 ? (
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
                                    <Heading size="md" noOfLines={1}>{item.nombre}</Heading>
                                    
                                    {/* Menu de opciones para cada carpeta */}
                                    <Menu.Root>
                                        <Menu.Trigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <HiDotsVertical />
                                            </Button>
                                        </Menu.Trigger>
                                        <Portal>
                                            <Menu.Positioner>
                                                <Menu.Content zIndex="dropdown">
                                                    <Menu.Item value="view" 
                                                        onClick={() =>{
                                                            navigate(`/resumenes/${item.id}`)
                                                        }}
                                                    > Ver contenido</Menu.Item>
                                                    
                                                    <Menu.Item value="edit" 
                                                        onClick={() =>{
                                                            navigate(`/editFolder/${item.id}`)
                                                        }}
                                                    > Editar</Menu.Item>
                                                    <Menu.Separator />
                                                    <Menu.Item  
                                                        value="delete" 
                                                        onClick={() => handleEliminarCarpeta(item.id)} 
                                                        color="red.500"
                                                    >
                                                        🗑️ Eliminar
                                                    </Menu.Item>
                                                </Menu.Content>
                                            </Menu.Positioner>
                                        </Portal>
                                    </Menu.Root>
                                </HStack>
                                
                                {item.descripcion && (
                                    <Text mb="2" noOfLines={2}>{item.descripcion}</Text>
                                )}
                                {item.fecha_creacion && (
                                    <Text color="gray.600" fontSize="sm" mb="3">
                                        Creado: {formatFecha(item.fecha_creacion)}
                                    </Text>
                                )}
                                <Button
                                    onClick={() =>{
                                        navigate(`/resumenes/${item.id}`)
                                    }}
                                    colorScheme="blue" variant="outline" size="sm" width="full">
                                    Ver contenido
                                </Button>
                            </Box>
                        ))
                    ) : !loading && (
                        <Box gridColumn="1 / -1">
                            <Text textAlign="center" color="gray.500" py="8">
                                No hay carpetas para mostrar
                            </Text>
                        </Box>
                    )}
                </SimpleGrid>

                {/* Paginación */}
                {!loading && totalPages > 1 && (
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

                {!loading && (
                    <Text color="gray.600" fontSize="sm" textAlign="center">
                        Mostrando {currentItems.length} de {carpetas.length} carpetas
                    </Text>
                )}

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
    )
}