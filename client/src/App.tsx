import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup'
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import { Navigate } from "react-router-dom";


//@ts-ignore
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/signin" replace />; 
  }

  return children; 
};

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/signup' element={<Signup/>}/>
        <Route path = '/signin' element={<Signin/>}/>
        <Route path = '/' element={<Navigate to="/signin"/>}/>
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
