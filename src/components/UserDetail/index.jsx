import React, { useState, useEffect } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // Thêm state để quản lý lỗi

  useEffect(() => {
    fetchModel(`/api/user/${userId}`)
      .then((response) => {
        const actualUser = response.data || response;
        setUser(actualUser);
        setError(null);
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết user:", err);
        setError("User not found or Invalid ID");
        setUser(null);
      });
  }, [userId]);

  // Xử lý khi đang tải hoặc gặp lỗi (đúng yêu cầu Problem 1 về việc báo lỗi ID)
  if (error)
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {error}
      </Typography>
    );

  if (!user)
    return <Typography sx={{ p: 2 }}>Loading user details...</Typography>;

  return (
    <Card variant="outlined">
      <CardContent>
        {/* Bây giờ user đã là Object sạch chứa dữ liệu thật, render sẽ ăn ngay lập tức */}
        <Typography variant="h4">{`${user.first_name || ""} ${
          user.last_name || ""
        }`}</Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
          sx={{ mt: 1 }}
        >
          {`Location: ${user.location || "N/A"}`}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {`Occupation: ${user.occupation || "N/A"}`}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
          {/* Dùng dangerouslySetInnerHTML nếu description chứa thẻ HTML giống như user John Ousterhout (CS142!) */}
          <span dangerouslySetInnerHTML={{ __html: user.description || "" }} />
        </Typography>

        {/* Giữ nguyên Button chuyển sang trang ảnh */}
        <Button
          variant="contained"
          component={Link}
          to={`/photos/${userId}`}
          color="primary"
          sx={{ mt: 1 }}
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
