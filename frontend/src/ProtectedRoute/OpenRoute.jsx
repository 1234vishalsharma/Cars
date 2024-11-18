import { Navigate } from 'react-router-dom';

const OpenRoute = ({children}) => {
    const token = localStorage.getItem('token') || null;
    if(token){
        return children;
    }
    return <Navigate to='Signup'/>;
}

export default OpenRoute;