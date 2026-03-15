import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom'
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"; 
import '../App.css'
import LoginStatusContext from "./contexts/LoginStatusContext";

export default function Layout() {

  const [loginStatus, setLoginStatus] = useState(sessionStorage.getItem("loginStatus"));

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
              {loginStatus ? 
                <Nav.Link as={Link} to="logout">Logout</Nav.Link>
              :
              <>
                <Nav.Link as={Link} to="login">Login</Nav.Link>
                <Nav.Link as={Link} to="register">Register</Nav.Link>
              </>
              }                                               
            </Nav>
        </Container>
      </Navbar>
      <div style={{ margin: "1rem" }}>
        <LoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
          <Outlet />
        </LoginStatusContext.Provider>
      </div>
    </div>
  )
}
