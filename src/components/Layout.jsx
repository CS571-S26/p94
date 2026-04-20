import { Link, Outlet } from 'react-router-dom';
import { Container, Nav, Navbar } from "react-bootstrap";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import '../App.css';

function Layout() {
  const [user] = useAuthState(auth);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                <Nav.Link as={Link} to="/create">Create Flow</Nav.Link>
                <Nav.Link as={Link} to="/my-flows">My Flows</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <div style={{ margin: "1rem" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;