import { Heading } from "@chakra-ui/react"
import { useAuth } from "@/contexts/useAuth"
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children}) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading){
        return <Heading>Loading...</Heading>
    }

    if (!isAuthenticated){
        return <Navigate to="/login" replace />; 
    }

    return children;
}

export default PrivateRoute;