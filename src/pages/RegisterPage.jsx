import { Form, Button, Alert } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function RegisterPage() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setError('');
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError("An account with this email already exists.");
            } else {
                setError("Failed to create account. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h2 className="mb-4" style={{ fontWeight: 500 }}>Create an account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="emailInput">Email</Form.Label>
                    <Form.Control id="emailInput" type="email" ref={emailRef} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="passwordInput">Password</Form.Label>
                    <Form.Control id="passwordInput" type="password" ref={passwordRef} />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label htmlFor="confirmPasswordInput">Confirm password</Form.Label>
                    <Form.Control id="confirmPasswordInput" type="password" ref={confirmPasswordRef} />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create account'}
                </Button>
            </Form>
            <p className="text-center text-muted mt-3" style={{ fontSize: '0.9rem' }}>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}