import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Divider,
  Box,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos({ currentUser }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState(null);

  // Trạng thái lưu trữ chữ đang gõ trong ô comment (Key là photoId, Value là nội dung text)
  const [newCommentText, setNewCommentText] = useState({});
  // Trạng thái lưu trữ file ảnh được chọn để chuẩn bị upload
  const [selectedFile, setSelectedFile] = useState(null);

  // Hàm dùng chung để lấy danh sách ảnh từ API và cập nhật lại State giao diện
  const loadPhotos = () => {
    fetchModel(`/api/photo/photosOfUser/${userId}`)
      .then((response) => {
        const actualPhotos = response.data || response;
        setPhotos(Array.isArray(actualPhotos) ? actualPhotos : []);
      })
      .catch((err) => {
        console.error("Lỗi lấy ảnh từ FE:", err);
        setPhotos([]);
      });
  };

  // Mỗi lần đổi ID người dùng thì tải lại danh sách ảnh tương ứng
  useEffect(() => {
    loadPhotos();
  }, [userId]);

  // 🌟 XỬ LÝ: Gửi bình luận mới lên Server (Problem 2)
  const handleAddComment = (photoId) => {
    const text = newCommentText[photoId];
    if (!text || text.trim() === "") return;

    fetchModel(`/api/photo/commentsOfPhoto/${photoId}`, {
      method: "POST",
      body: { comment: text.trim() },
    })
      .then(() => {
        // Xóa sạch chữ trong ô nhập comment của riêng bức ảnh vừa đăng thành công
        setNewCommentText({ ...newCommentText, [photoId]: "" });
        // Tải lại danh sách ảnh lập tức để giao diện hiển thị comment mới tinh vừa thêm
        loadPhotos();
      })
      .catch((err) => {
        console.error("Lỗi khi thêm bình luận:", err);
        alert("Cannot add empty comment!");
      });
  };

  // 🌟 XỬ LÝ: Upload file ảnh mới (Problem 3)
  const handleUploadPhoto = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // Vì bưu kiện gửi đi là file thô (binary), ta bắt buộc phải bọc bằng đối tượng FormData
    const formData = new FormData();
    formData.append("uploadedphoto", selectedFile);

    // Sử dụng fetch mặc định của trình duyệt để xử lý body FormData thay vì XMLHttpRequest
    fetch("https://mdr8k8-8081.csb.app/api/photo/new", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Đính kèm vé thông hành token
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upload failed");
        return res.json();
      })
      .then(() => {
        setSelectedFile(null); // Reset xóa file đã chọn trên thanh input
        // Đưa input file về trạng thái trống trên màn hình
        document.getElementById("photo-upload-input").value = "";
        // Tải lại toàn bộ danh sách để ảnh mới xuất hiện ngay lập tức trên trang ảnh
        loadPhotos();
      })
      .catch((err) => {
        console.error("Lỗi khi upload ảnh:", err);
        alert("Upload photo failed!");
      });
  };

  if (photos === null)
    return <Typography sx={{ p: 2 }}>Loading photos...</Typography>;

  return (
    <div className="user-photos-container" style={{ padding: "10px" }}>
      {/* 🌟 ĐÃ SỬA: Chỉ hiển thị khu vực Đăng ảnh nếu đang ở đúng trang album của CHÍNH MÌNH */}
      {currentUser && currentUser._id === userId && (
        <Paper
          sx={{ p: 2, mb: 4, border: "1px dashed #1976d2", bgcolor: "#fbfcfe" }}
          variant="outlined"
        >
          <Typography
            variant="h6"
            color="primary"
            sx={{ mb: 1, fontWeight: "bold" }}
          >
            Upload New Photo
          </Typography>
          <Box
            component="form"
            onSubmit={handleUploadPhoto}
            sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
          >
            <input
              id="photo-upload-input"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ fontSize: "14px" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
            >
              Add Photo
            </Button>
          </Box>
        </Paper>
      )}

      {/* HIỂN THỊ DANH SÁCH ẢNH VÀ BÌNH LUẬN */}
      {photos.length === 0 ? (
        <Typography sx={{ p: 2, color: "gray", fontStyle: "italic" }}>
          No photos available for this user.
        </Typography>
      ) : (
        photos.map((photo) => (
          <Card key={photo._id} sx={{ mb: 4 }} variant="outlined">
            <CardHeader
              title={`Posted on: ${new Date(photo.date_time).toLocaleString()}`}
              titleTypographyProps={{
                variant: "subtitle2",
                color: "textSecondary",
              }}
            />
            <CardMedia
              component="img"
              image={`/images/${photo.file_name}`}
              alt={photo.file_name}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "contain",
                bgcolor: "#f5f5f5",
              }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Comments:
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Render danh sách bình luận cũ */}
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <div key={comment._id} style={{ marginBottom: "15px" }}>
                    <Typography variant="subtitle2">
                      {comment.user ? (
                        <Link
                          to={`/users/${comment.user._id}`}
                          style={{
                            fontWeight: "bold",
                            textDecoration: "none",
                            color: "#1976d2",
                          }}
                        >
                          {`${comment.user.first_name} ${comment.user.last_name}`}
                        </Link>
                      ) : (
                        <span style={{ color: "gray", fontStyle: "italic" }}>
                          Unknown User
                        </span>
                      )}
                      {` - ${new Date(comment.date_time).toLocaleString()}`}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 0.5, pl: 1, borderLeft: "2px solid #e0e0e0" }}
                    >
                      {comment.comment}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  No comments yet.
                </Typography>
              )}

              {/* 🌟 GIAO DIỆN KHU VỰC THÊM BÌNH LUẬN MỚI CHO TỪNG ẢNH (Problem 2) */}
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Write a comment..."
                  value={newCommentText[photo._id] || ""}
                  onChange={(e) =>
                    setNewCommentText({
                      ...newCommentText,
                      [photo._id]: e.target.value,
                    })
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleAddComment(photo._id)}
                >
                  Send
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default UserPhotos;
