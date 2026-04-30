import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Spinner } from 'react-bootstrap';

export default function ProtectedRoute({ children }) {
    const [user, loading] = useAuthState(auth);

    if (loading) return (
        <div className="d-flex justify-content-center mt-5">
            <Spinner animation="border" variant="secondary" />
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    return children;
}