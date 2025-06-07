import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";
//import { useAuth } from "../../context/AuthContext";
import TextField from "@mui/material/TextField";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  //const { currentUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: ""
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await models.userModel(userId);
        if (data) {
          setUser(data);
          setForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            location: data.location || "",  
            description: data.description || "",
            occupation: data.occupation || ""
          });
        } else {
          console.error("User not found for ID:", userId);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    if (userId) fetchUser();
    
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await models.updateUserInfo(userId, form);
      setUser({ ...user, ...form });
      setEditMode(false);
      alert("Successfully updated user information!");
    } catch (err) {
      alert("Failed to update user information.");
    }
  };

  if (!user) {
    return <Typography variant="h4">Loading user...</Typography>;
  }

  return (
    <Card className="user-detail-card">
      <CardContent>
        <div className="user-detail-header">
          {!editMode ? (
            <>
              <Typography variant="h4" gutterBottom>
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {user.occupation}
              </Typography>
            </>
          ) : (
            <>
              <TextField
                name="first_name"
                label="First Name"
                value={form.first_name}
                onChange={handleChange}
                sx={{ mr: 1 }}
              />
              <TextField
                name="last_name"
                label="Last Name"
                value={form.last_name}
                onChange={handleChange}
              />
              <TextField
                name="occupation"
                label="Occupation"
                value={form.occupation}
                onChange={handleChange}
                fullWidth
                sx={{ mt: 2 }}
              />
            
            </>
          )}
        </div>
        {!editMode ? (
          <>
            <Typography variant="body1" className="user-detail-location">
              Location: {user.location}
            </Typography>
            <Typography variant="body1" className="user-detail-description">
              {user.description}
            </Typography>
          </>
        ) : (
          <>
            <TextField
              name="location"
              label="Location"
              value={form.location}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              sx={{ mt: 2 }}
            />
          </>
        )}

        <Button 
          variant="contained" 
          component={Link} 
          to={`/photos/${user._id}`}
          color="primary"
          className="photos-button"
          sx={{ mt: 2, mr: 2 }}
        >
          View Photos
        </Button>

        {/*
        {!editMode && currentUser._id === userId && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setEditMode(true)}
            sx={{ mt: 2 }}
          >
            Edit
          </Button>
        )}
        */}

        {editMode && (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              sx={{ mt: 2, mr: 2 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setEditMode(false)}
              sx={{ mt: 2 }}
            >
              Cancel
            </Button>
          </>
        )}
        
      </CardContent>
    </Card>
  );
}

export default UserDetail;
