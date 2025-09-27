import { Button, Stack, Text, Link, Field, Input, Box } from "@chakra-ui/react"
import { colorPalettes } from "../lib/color-palettes"
import { useState } from "react"
import { login } from "@/api/arandu.api"
import { useAuth } from "@/contexts/useAuth"
import { useNavigate } from "react-router-dom"

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login_user } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = () => {
    login_user(username, password)
  }

  const handleNav = () => {
    navigate('/register')
  }

  return (
    <Box maxW="400px" width="100%" margin="auto" p="4">
      <Stack gap="4" align="flex-start">
        <Text>Iniciar Sesión</Text>
        <Field.Root>
          <Field.Label>Usuario</Field.Label>
          <Input 
            onChange={(e) => setUsername(e.target.value)} 
            value={username} 
            type="text"  
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Contraseña</Field.Label>
          <Input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            type="password" 
          />
        </Field.Root>

        <Stack direction="row" gap="2" align="center">
          <Button onClick={handleLogin} colorPalette="green" variant="solid">
            Ingresar
          </Button>
          <Link 
            onClick={handleNav} 
            colorPalette="blue" 
            cursor="pointer" 
            textDecoration="underline"
            fontSize="sm"
          >
            ¿No tenes una cuenta? create una
          </Link>
        </Stack>
      </Stack>
    </Box>
  )
}