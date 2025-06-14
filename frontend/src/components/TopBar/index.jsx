import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PhotoUploadDialog from "../PhotoUploadDialog";
import models from "../../modelData/models";
import { useAuth } from "../../context/AuthContext";
import "./styles.css";

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [contextText, setContextText] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (!currentUser) {
        setContextText("Please Login");
        return;
      }

      const pathParts = location.pathname.split("/").filter(Boolean);

      if (
        (pathParts[0] === "users" || pathParts[0] === "photos") &&
        pathParts.length === 2
      ) {
        const userId = pathParts[1];
        try {
          const user = await models.userModel(userId);
          if (user) {
            const fullName = `${user.first_name} ${user.last_name}`;
            if (pathParts[0] === "photos") {
              setContextText(
                user._id === currentUser._id
                  ? "My Photos"
                  : `Photos of ${fullName}`
              );
            } else {
              setContextText(
                user._id === currentUser._id ? "My Profile" : fullName
              );
            }
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setContextText("");
        }
      } else {
        setContextText(
          currentUser ? `Hi ${currentUser.first_name}` : "Please Login"
        );
      }
    }

    fetchUser();
  }, [location, currentUser]);

  const handleLogout = () => {
    logout();
  };
  
  const handlePhotoUploadSuccess = (uploadedPhoto) => {
    if (uploadedPhoto && uploadedPhoto._id) {
      // Navigate thẳng tới ảnh vừa upload
      navigate(
        `/photos/${uploadedPhoto.userId || currentUser._id}/${
          uploadedPhoto._id
        }`,
        { replace: true }
      );

      // Hoặc reload trang nếu cần thiết
      window.location.reload();
    } else if (currentUser && currentUser._id) {
      navigate(`/photos/${currentUser._id}`);
    }
  };

  return (
    <AppBar position="fixed">
  <Toolbar className="appbar-toolbar">
    <Box className="toolbar-left" >Trần Ngọc Khuyến - B22DCVT299</Box>

    <Box className="toolbar-center">{contextText}</Box>

    <Box className="toolbar-right">
      {currentUser && (
        <>
          <Typography
            variant="body1"
            onClick={() => navigate(`/users/${currentUser._id}`)}
            sx={{ cursor: "pointer", textDecoration: "underline", marginRight: 2 }}
          >
            Hi {currentUser.first_name}
          </Typography>

          <Button color="inherit" onClick={() => setUploadDialogOpen(true)}>
            Add Photo
          </Button>

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </>
      )}
    </Box>
  </Toolbar>

  {currentUser && (
    <PhotoUploadDialog
      open={uploadDialogOpen}
      onClose={() => setUploadDialogOpen(false)}
      onSuccess={handlePhotoUploadSuccess}
      userId={currentUser._id}
    />
  )}
</AppBar>

  );
}

export default TopBar;
