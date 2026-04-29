import { NavLink, Outlet } from 'react-router-dom';
import { Container, Nav, Navbar } from "react-bootstrap";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import LightLogo from '../assets/LightLogo.png';
import flowStateLogoGrey from '../assets/flowStateLogoGrey.png'
import '../App.css';

function Layout() {
  const [user] = useAuthState(auth);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar bg="dark" variant="dark">
        <Container fluid className="px-2">
           <Navbar.Brand as={NavLink} to="/">
              <img src={flowStateLogoGrey} alt="FlowState" height="40" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/poses">Poses</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={NavLink} to="/create">Create Flow</Nav.Link>
                <Nav.Link as={NavLink} to="/my-flows">My Flows</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        {user && (
        <Nav className="ms-auto">
          <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
        </Nav>
        )}  
        </Container>
      </Navbar>
      <div style={{ margin: "1rem", flex: 1 }}>
        <Outlet />
      </div>
      <footer style={{
    borderTop: '0.5px solid #dee2e6',
    padding: '20px 0',
    marginTop: '3rem',
    background: '#f8f9fa'
}}>
    <Container>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                © {new Date().getFullYear()} FlowState
            </span>
            <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                Pose descriptions and images sourced from{' '}
                <a href="https://pocketyoga.com" target="_blank" rel="noreferrer" style={{ color: '#6c757d' }}>
                    pocketyoga.com
                </a>
            </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#adb5bd', margin: 0 }}>
            Built by Rebecca Silverstein · A personal web project for creating and saving yoga flows. 
            Made as part of CS571 at UW-Madison.
        </p>
    </Container>
</footer>
    </div>
  );
}

export default Layout;