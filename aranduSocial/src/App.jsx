import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { 
  Stack, Heading, Text, Button, Box, HStack, Image, Show, SimpleGrid,
  Drawer, Portal, CloseButton, Menu, Grid, GridItem
} from "@chakra-ui/react";
import { HiMenu, HiDotsVertical, HiUserCircle, HiDotsHorizontal } from "react-icons/hi";
import './App.css'
import { Login } from './routes/login'
import { MenuPage } from './routes/menu'
import { AuthProvider } from './contexts/useAuth'
import PrivateRoute from './components/private_route'
import {Register} from './routes/register'
import { RegisterFolder } from './routes/crear_carpeta'
import  { ResumenPag }  from './routes/resumen'
import { FormResumen } from './routes/crear_resumen';
import { EditarResumen } from './routes/editar_resumen';
import { Toaster } from 'react-hot-toast';
import  { ResumenInterativo }  from './routes/flashcards';

//los componentes se separan en NavegationHeader y App
function NavigationHeader() {
  const navigate = useNavigate();

  const handleNav = () => {
    navigate('/');
  };


  return (
    <Box as="nav" boxShadow="sm" p="4" borderBottom="1px" borderColor="gray.200" position="relative" zIndex="dropdown">
      <HStack justify="space-between" width="100%">
       
        <HStack onClick={handleNav} cursor="pointer">
          <Image src="/logo.png" alt="Logo" w="50px" h="50px" />
          <Heading size="lg">Arandú</Heading>
        </HStack>

        
        
      </HStack>
    </Box>
  );
}


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NavigationHeader /> 
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/registerFolder' element={<RegisterFolder />} />
          <Route path='/editFolder/:id' element={<RegisterFolder />} />
          <Route path='/resumenes/:id' element={<ResumenPag />} />
          <Route path='/formResumen/:id' element={<FormResumen />} />
          <Route path="/editResumen/:carpetaId/:resumenId" element={<EditarResumen />} />
          <Route path="/flashcard/:id" element= {<ResumenInterativo/>}/>
          <Route path='/' element={<PrivateRoute><MenuPage /></PrivateRoute>} />

        </Routes>
      </AuthProvider>
       <Toaster />
    </Router>
  );
}