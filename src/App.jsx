import ChatPage from "./ChatPage"
import { AuthContext } from "./context/AuthContext";
import LoginPage from "./LogInPage";
import RegisterPage from "./RegisterPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./Home.jsx";

function App() {

  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login"></Navigate>;
    }
    return children;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            <ProtectedRoute>
              <ChatPage/>
            </ProtectedRoute> 
          } />
          <Route path="login" element={<LoginPage></LoginPage>} />
          <Route path="registration" element={<RegisterPage></RegisterPage>} />
          <Route path="home" element={<Home></Home>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
