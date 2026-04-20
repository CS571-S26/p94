import { Form, Button, Alert } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginPage() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError("Incorrect email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h2 className="mb-4" style={{ fontWeight: 500 }}>Log in</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="emailInput">Email</Form.Label>
                    <Form.Control id="emailInput" type="email" ref={emailRef} />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label htmlFor="passwordInput">Password</Form.Label>
                    <Form.Control id="passwordInput" type="password" ref={passwordRef} />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log in'}
                </Button>
            </Form>
            <p className="text-center text-muted mt-3" style={{ fontSize: '0.9rem' }}>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}