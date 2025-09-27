import { VStack, Button, Field, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "@/contexts/useAuth";

export const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')
    const { register_user } = useAuth();

    const handleRegister = () => {
        register_user(username, email, password, cPassword)
    }

    return (
        <VStack>
            <Field.Root>
                <Field.Label>Nombre de usuario:</Field.Label>
                <Input onChange={(e) => setUsername(e.target.value)} value={username} type="text" ></Input>
            </Field.Root>
            <Field.Root>
                <Field.Label>Correo Electronico:</Field.Label>
                <Input onChange={(e) => setEmail(e.target.value)} value={email} type="email"  ></Input>
            </Field.Root>
            <Field.Root>
                <Field.Label>Contraseña:</Field.Label>
                <Input onChange={(e) => setPassword(e.target.value)} value={password} type="password" ></Input>
            </Field.Root>
            <Field.Root>
                <Field.Label>Confirmar Contraseña:</Field.Label>
                <Input onChange={(e) => setCPassword(e.target.value)} value={cPassword} type="password" ></Input>
            </Field.Root>

            <Button onClick={handleRegister}>Crear cuenta</Button>
        </VStack>
    )
}

