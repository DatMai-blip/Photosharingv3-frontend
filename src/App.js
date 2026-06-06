import "./App.css";
import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const App = (props) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
  };

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar currentUser={currentUser} onLogout={handleLogout} />
          </Grid>

          <div className="main-topbar-buffer" />

          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {currentUser ? (
                <UserList />
              ) : (
                <Typography
                  sx={{
                    p: 2,
                    textAlign: "center",
                    color: "gray",
                    fontStyle: "italic",
                  }}
                >
                  Please log in to see user list.
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item sm={9}>
            <Paper className="main-grid-item">
              {currentUser ? (
                <Routes>
                  <Route path="/users/:userId" element={<UserDetail />} />
                  <Route
                    path="/photos/:userId"
                    element={<UserPhotos currentUser={currentUser} />}
                  />
                  <Route
                    path="*"
                    element={
                      <Navigate to={`/users/${currentUser._id}`} replace />
                    }
                  />
                </Routes>
              ) : (
                <Routes>
                  <Route
                    path="*"
                    element={
                      <LoginRegister
                        onLoginSuccess={(user) => setCurrentUser(user)}
                      />
                    }
                  />
                </Routes>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
