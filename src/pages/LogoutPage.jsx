import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function LogoutPage() {
    const navigate = useNavigate();

    useEffect(() => {
        signOut(auth).then(() => navigate("/"));
    }, []);

    return <p className="text-center text-muted mt-5">Logging out...</p>;
}