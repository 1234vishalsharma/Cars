import { Navigate } from "react-router-dom";

const SpecificRoute = ({children}) => {
    const token = localStorage.getItem('token') || null;
    if(token){
        return <Navigate to='/'/>    
    }else{
        return children;
    }
}


export default SpecificRoute;