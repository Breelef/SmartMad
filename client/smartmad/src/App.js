import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {ProtectedRoute} from "./components/protected_routes.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {FindOpskriftPage} from "./pages/find_opskrift_page.js";
import {LoginPage} from "./pages/login_page.js";
import {UdfyldTilOpskrift} from "./pages/udfyld_til_opskrift.js";
import { SignupPage } from "./pages/signup_page.js";
function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
       <Router>
          <Routes>
                <Route path="/signup" element={<SignupPage />}/>
                <Route path="/login" element={<LoginPage />} />
            <Route path="/udfyld-til-opskrift" element={
              <ProtectedRoute>
                <UdfyldTilOpskrift />
              </ProtectedRoute>
              } />
            <Route
              path="/find-opskrift"
              element={
                <ProtectedRoute>
                  <FindOpskriftPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />}/>
          </Routes>
        </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
