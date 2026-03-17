import { Form, Button } from 'react-bootstrap';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterPage() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    function handleRegister(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        
        const auth = getAuth();

        // check for valid email and password:
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            alert("Registration successful! Please log in.");
            navigate("/login");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Error: " + errorMessage);
            // ..
        });

    }

    return<>
        <h1>Register</h1>
        <Form onSubmit={handleRegister}>
        <Form.Label htmlFor="emailInput">Email</Form.Label>
        <Form.Control id="emailInput" ref={emailRef}></Form.Control>
        <Form.Label htmlFor="passwordInput">Password</Form.Label>
        <Form.Control id="passwordInput" type="password" ref={passwordRef}></Form.Control>
        <br/>
        <Button type="submit">Register</Button>
        </Form>
    </>
}
 