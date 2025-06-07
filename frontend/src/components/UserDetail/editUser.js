import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import { useAuth } from "../../context/AuthContext";

function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: ""
  });
  const [loading, setLoading] = useState(true);

  // Load dữ liệu hiện tại
  useEffect(() => {
    async function fetchUser() {
      const user = await models.userModel(userId);
      if (user) {
        setForm({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          location: user.location || "",
          description: user.description || "",
          occupation: user.occupation || ""
        });
      }
      setLoading(false);
    }
    fetchUser();
  }, [userId]);

  // Hàm xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API cập nhật thông tin (giả sử đã có models.updateUserInfo)
      await models.updateUserInfo(userId, form, currentUser?.token);
      alert("Cập nhật thành công!");
      navigate(`/users/${userId}`);
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  // Hàm thay đổi value form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box component={Paper} p={4} maxWidth={500} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Change your information</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="First_name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last_name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Occupation"
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save
        </Button>
      </form>
    </Box>
  );
}

export default EditUser;
