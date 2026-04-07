import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, signOut } from 'firebase/auth';
import LoginStatusContext from '../components/contexts/LoginStatusContext';

export default function LogoutPage() {
  const [loginStatus, setLoginStatus] = useContext(LoginStatusContext);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        sessionStorage.setItem("loginStatus", "false");
        setLoginStatus(false);   // <-- triggers navbar update
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }, []);

  return <p>Logging out...</p>;
}
