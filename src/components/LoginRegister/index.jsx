import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

function LoginRegister({ onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [regFields, setRegFields] = useState({
    login_name: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    fetchModel("/api/admin/login", {
      method: "POST",
      body: { login_name: loginName, password },
    })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(res.data));
        onLoginSuccess(res.data);
      })
      .catch((err) =>
        setMsg({ type: "error", text: "Login failed! Check credentials." })
      );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (regFields.password !== regFields.confirm_password) {
      return setMsg({ type: "error", text: "Passwords do not match!" });
    }
    fetchModel("/api/user", { method: "POST", body: regFields })
      .then(() => {
        setMsg({
          type: "success",
          text: "Registered successfully! Please login.",
        });

        setRegFields({
          login_name: "",
          password: "",
          confirm_password: "",
          first_name: "",
          last_name: "",
          location: "",
          description: "",
          occupation: "",
        });

        setIsLoginView(true);
      })
      .catch((err) =>
        setMsg({ type: "error", text: err.error || "Registration failed" })
      );
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 4 }} variant="outlined">
      <Typography variant="h5" gutterBottom>
        {isLoginView ? "Login" : "Register"}
      </Typography>
      {msg.text && (
        <Alert severity={msg.type} sx={{ mb: 2 }}>
          {msg.text}
        </Alert>
      )}

      {isLoginView ? (
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Login Name"
            margin="normal"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Login
          </Button>
          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => {
              setIsLoginView(false);
              setMsg({ type: "", text: "" });
            }}
          >
            Don't have an account? Register
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            required
            label="Login Name"
            margin="dense"
            value={regFields.login_name}
            onChange={(e) =>
              setRegFields({ ...regFields, login_name: e.target.value })
            }
          />
          <TextField
            fullWidth
            required
            type="password"
            label="Password"
            margin="dense"
            value={regFields.password}
            onChange={(e) =>
              setRegFields({ ...regFields, password: e.target.value })
            }
          />
          <TextField
            fullWidth
            required
            type="password"
            label="Confirm Password"
            margin="dense"
            value={regFields.confirm_password}
            onChange={(e) =>
              setRegFields({ ...regFields, confirm_password: e.target.value })
            }
          />
          <TextField
            fullWidth
            required
            label="First Name"
            margin="dense"
            value={regFields.first_name}
            onChange={(e) =>
              setRegFields({ ...regFields, first_name: e.target.value })
            }
          />
          <TextField
            fullWidth
            required
            label="Last Name"
            margin="dense"
            value={regFields.last_name}
            onChange={(e) =>
              setRegFields({ ...regFields, last_name: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Location"
            margin="dense"
            value={regFields.location}
            onChange={(e) =>
              setRegFields({ ...regFields, location: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Occupation"
            margin="dense"
            value={regFields.occupation}
            onChange={(e) =>
              setRegFields({ ...regFields, occupation: e.target.value })
            }
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            color="success"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => {
              setIsLoginView(true);
              setMsg({ type: "", text: "" });
            }}
          >
            Back to Login
          </Button>
        </form>
      )}
    </Paper>
  );
}

export default LoginRegister;
