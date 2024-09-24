import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {ProtectedRoute} from "./components/protected_routes.js";
import {FindOpskriftPage} from "./pages/find_opskrift_page.js";
import {LoginPage} from "./pages/login_page.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/find-opskrift"
          element={
            <ProtectedRoute>
              <FindOpskriftPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    
  );
}

export default App;
