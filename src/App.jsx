import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LogoutPage from './pages/LogoutPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Layout from './components/Layout.jsx'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {auth} from './firebase'

function App() {

  // use firebase for authentication and session storage to keep track of login status on the frontend.
  // test firebase connection:
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      console.log("Firebase connected. User:", user);
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/logout" element={<LogoutPage />}></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
