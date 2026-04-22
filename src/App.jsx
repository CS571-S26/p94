import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LogoutPage from './pages/LogoutPage.jsx'
import CreateFlowPage from './pages/CreateFlowPage.jsx'
import MyFlowsPage from './pages/MyFlowsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Layout from './components/Layout.jsx'
import PosesPage from './pages/PosesPage.jsx'
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
        <Route path="/poses" element={<PosesPage />} />
        <Route path="/logout" element={<LogoutPage />}></Route>
        <Route path="/create" element={<CreateFlowPage />}></Route>
        <Route path="/my-flows" element={<MyFlowsPage />}></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
