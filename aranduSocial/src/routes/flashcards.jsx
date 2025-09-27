import { 
  Stack, Heading, Text, Button, Box, HStack, Image, Show, SimpleGrid,
  Drawer, Portal, CloseButton, Menu, Grid, GridItem, Flex, Card, 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { get_resumenes, deleteResumen } from "@/api/arandu.api"; 
import { useAuth } from "@/contexts/useAuth";
import { HiMenu, HiDotsVertical, HiUserCircle, HiDotsHorizontal } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-hot-toast';

export const ResumenInterativo = () => {
    const [resumen, setResumen] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(1)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [flippedCards, setFlippedCards] = useState({})
    const { logout_user } = useAuth();
    const navigate = useNavigate();
    const params = useParams();

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

    const toggleFlip = (cardId) => {
        setFlippedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    const handleVolverAResumenes = () => {
        navigate(`/resumenes/${params.id}`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = resumen.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(resumen.length / itemsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
        setFlippedCards({});
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
        setFlippedCards({});
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'Fecha no disponible';
        return new Date(fecha).toLocaleDateString('es-ES');
    };

    const handleLogout = async () => {
        await logout_user();
    };

    return(
        <Stack gap="4">
            <Box p="4">
                <Heading size="md" mb="4">Tus Flashcards</Heading>

                <Stack direction="row" gap="3" mb="3">
                    <Button 
                        size="sm" 
                        colorPalette="green" 
                        variant="outline"
                        onClick={handleVolverAResumenes}
                    >
                        Ver listado de resumenes
                    </Button>
                </Stack>

                {loading && (
                    <Text textAlign="center" py="4">Cargando...</Text>
                )}

                <Flex justifyContent="center" mb="6">
                    <SimpleGrid 
                        columns={{ base: 1, md: 1, lg: 1 }} 
                        gap="6" 
                        width="100%"
                        maxWidth="600px"
                    >
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <Box 
                                    key={item.id || index} 
                                    position="relative"
                                    width="100%"
                                    height="400px"
                                    perspective="1000px"
                                    cursor="pointer"
                                    onClick={() => toggleFlip(item.id || index)}
                                >
                                    <Box
                                        position="relative"
                                        width="100%"
                                        height="100%"
                                        transition="transform 0.6s"
                                        transformStyle="preserve-3d"
                                        transform={flippedCards[item.id || index] ? "rotateY(180deg)" : "rotateY(0deg)"}
                                    >
                                        {/* Parte frontal */}
                                        <Card.Root
                                            position="absolute"
                                            width="100%"
                                            height="100%"
                                            backfaceVisibility="hidden"
                                            backgroundColor="gray.900"
                                            border="2px solid"
                                            borderColor="gray.700"
                                            borderRadius="xl"
                                            boxShadow="lg"
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="center"
                                            alignItems="center"
                                            p="6"
                                        >
                                            <Card.Body textAlign="center">
                                                <Heading size="lg" mb="4" color="blue.600">
                                                    {item.titulo || "Sin título"}
                                                </Heading>
                                                <Text fontSize="sm" color="gray.600" mb="2">
                                                    Carpeta: {item.carpeta_nombre || "Sin categoría"}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500" mt="4">
                                                    👆 Haz clic para ver el contenido
                                                </Text>
                                            </Card.Body>
                                        </Card.Root>

                                        {/*Parte trasera*/}
                                        <Card.Root
                                            position="absolute"
                                            width="100%"
                                            height="100%"
                                            backfaceVisibility="hidden"
                                            backgroundColor="gray.900"
                                            border="2px solid"
                                            borderColor="gray.700"
                                            borderRadius="xl"
                                            boxShadow="lg"
                                            transform="rotateY(180deg)"
                                            display="flex"
                                            flexDirection="column"
                                            p="6"
                                        >
                                            <Card.Body>
                                                <HStack justify="space-between" mb="4">
                                                    <Heading size="md" color="blue.700">
                                                        Contenido
                                                    </Heading>
                                                    <Menu.Root>
                                                        <Menu.Trigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                                                <HiDotsVertical />
                                                            </Button>
                                                        </Menu.Trigger>
                                                        <Portal>
                                                            <Menu.Positioner>
                                                                <Menu.Content zIndex="dropdown">                        
                                                                    <Menu.Item 
                                                                        value="edit" 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigate(`/editResumen/${params.id}/${item.id}`);
                                                                        }}
                                                                    >
                                                                        Editar
                                                                    </Menu.Item>
                                                                    <Menu.Separator />
                                                                    <Menu.Item 
                                                                        value="delete" 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleEliminarResumen(item.id);
                                                                        }} 
                                                                    >
                                                                        🗑️ Eliminar
                                                                    </Menu.Item>
                                                                </Menu.Content>
                                                            </Menu.Positioner>
                                                        </Portal>
                                                    </Menu.Root>
                                                </HStack>
                                                
                                                {item.contenido ? (
                                                    <Text 
                                                        fontSize="md" 
                                                        lineHeight="1.6"
                                                        maxHeight="250px"
                                                        overflowY="auto"
                                                    >
                                                        {item.contenido}
                                                    </Text>
                                                ) : (
                                                    <Text color="gray.500" fontStyle="italic">
                                                        No hay contenido disponible
                                                    </Text>
                                                )}
                                                
                                                {item.fecha_creacion && (
                                                    <Text color="gray.500" fontSize="xs" mt="auto" pt="4">
                                                        Creado: {formatFecha(item.fecha_creacion)}
                                                    </Text>
                                                )}
                                            </Card.Body>
                                        </Card.Root>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            !loading && (
                                <Box>
                                    <Text textAlign="center" color="gray.500" py="8">
                                        No hay resúmenes para mostrar
                                    </Text>
                                </Box>
                            )
                        )}
                    </SimpleGrid>
                </Flex>

                {currentItems.length > 0 && (
                    <Text textAlign="center" color="blue.600" fontSize="sm" mb="4">
                        {flippedCards[currentItems[0]?.id || 0] ? "📖 Contenido" : "📄 Título"} 
                        - Haz clic en la tarjeta para {flippedCards[currentItems[0]?.id || 0] ? "volver al título" : "ver el contenido"}
                    </Text>
                )}

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
                            Flashcard {currentPage} de {totalPages}
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
                    Mostrando {currentItems.length} de {resumen.length} flashcards
                </Text>

                <Stack direction="row" gap="3" mb="3" justifyContent="center">
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