import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy danh sách user từ Backend
    fetchModel("/api/user/list")
      .then((response) => {
        // Hứng dữ liệu an toàn từ fetch thuần
        const userData = response.data || response;
        setUsers(Array.isArray(userData) ? userData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách user:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography sx={{ p: 2 }}>Loading users...</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" sx={{ p: 2 }}>
        Users
      </Typography>
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={`/users/${user._id}`}>
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
