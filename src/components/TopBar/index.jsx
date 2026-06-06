import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Grid, Button, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

/**
 * Define TopBar, a React component of Project 5.
 */
function TopBar({ currentUser, onLogout }) {
  const location = useLocation();
  const [contextText, setContextText] = useState("Photo Sharing App");
  const [version, setVersion] = useState("");

  // Effect để lấy Version (Problem 2)
  useEffect(() => {
    fetchModel("/api/test/info")
      .then((response) => {
        const resData = response.data || response;
        if (resData && resData.version) {
          setVersion(resData.version);
        }
      })
      .catch((err) => console.error("Lỗi lấy version:", err));
  }, []);

  // Effect để cập nhật tên User dựa trên URL
  useEffect(() => {
    // 🌟 ĐÃ KHÓA: Nếu chưa đăng nhập thành công thì không gọi API chi tiết tránh lỗi 401
    if (!currentUser) {
      setContextText("Photo Sharing App");
      return;
    }

    const path = location.pathname;
    const pathParts = path.split("/");

    if (
      (path.startsWith("/users/") || path.startsWith("/photos/")) &&
      pathParts[2]
    ) {
      const userId = pathParts[2];
      const type = path.startsWith("/users/") ? "Details of" : "Photos of";

      fetchModel(`/api/user/${userId}`)
        .then((response) => {
          const user = response.data || response;

          if (user && (user.first_name || user.last_name)) {
            setContextText(`${type} ${user.first_name} ${user.last_name}`);
          } else {
            setContextText("Photo Sharing App");
          }
        })
        .catch(() => {
          setContextText("Photo Sharing App");
        });
    } else {
      setContextText("Photo Sharing App");
    }
  }, [location.pathname, currentUser]); // Thêm currentUser vào dependencies để cập nhật khi login/logout

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Cột trái: Tên sinh viên */}
          <Grid item>
            <Typography variant="h5" color="inherit">
              Mai Tiến Đạt
            </Typography>
          </Grid>

          {/* Cột giữa: Ngữ cảnh hiển thị app (Details of... / Photos of...) */}
          <Grid item>
            <Typography variant="h6" color="inherit">
              {currentUser ? contextText : "Please Login"}{" "}
              {version ? `(v${version})` : ""}
            </Typography>
          </Grid>

          {/* 🌟 Cột phải: Trạng thái Đăng nhập / Chào mừng & Logout (Problem 1) */}
          <Grid item>
            {currentUser ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  sx={{ fontWeight: "bold" }}
                >
                  Hi {currentUser.first_name}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={onLogout}
                  sx={{ textTransform: "none" }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Typography
                variant="subtitle1"
                color="inherit"
                sx={{ fontStyle: "italic" }}
              >
                Please Login
              </Typography>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
