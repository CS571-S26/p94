import { Form, Button } from 'react-bootstrap';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {


    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    function handleLogin(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        
        const auth = getAuth();

        // check for valid email and password:
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        
        // use firebase authentication to log in with email and password
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            alert("Login successful!");
            navigate("/");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Error: " + errorMessage);
        });
        
    }

    return<>
        <h1>Login</h1>
        <Form onSubmit={handleLogin}>
        <Form.Label htmlFor="emailInput">Email</Form.Label>
        <Form.Control id="emailInput" ref={emailRef}></Form.Control>
        <Form.Label htmlFor="passwordInput">Password</Form.Label>
        <Form.Control id="passwordInput" type="password" ref={passwordRef}></Form.Control>
        <br/>
        <Button type="submit">Login</Button>
        </Form>
    </>
}
