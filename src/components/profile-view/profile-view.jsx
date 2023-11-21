import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

import './profile-view.scss';





const ProfileView = ({ user, username, onUpdateProfile, onLogout }) => {
  const [newUsername, setNewUsername] = useState(user.Username);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user.Email);
  const [newBirthday, setNewBirthday] = useState(user.Birthday);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    fetch(`https://movies-myflix-85528af4e39c.herokuapp.com/users/${user.Username}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("Favorite Movies from API:", data);
        setFavoriteMovies(data);
      })
      .catch(error => console.error('Error fetching favorite movies:', error));
  }, [user]);

  const handleUpdate = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.  Please try again.");
      return;
    }

    const updatedUserData = {
      Username: newUsername,
      Email: newEmail,
      Birthday: newBirthday
    };

    if (newPassword) {
      updatedUserData.Password = newPassword;
    }

    console.log("updated user data:", updatedUserData);

    const token = localStorage.getItem("token");
    fetch(`https://movies-myflix-85528af4e39c.herokuapp.com/users/${user.Username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedUserData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('User profile updated:', data);
        onUpdateProfile(data);
      })
      .catch(error => {
        console.error('Error updating user profile:', error);
      });
  };


  const handleDeregister = () => {
    const token = localStorage.getItem("token");
    fetch(`https://movies-myflix-85528af4e39c.herokuapp.com/users/${user.Username}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        onLogout();
      })
      .catch(error => {
        console.error('Error deregistering user:', error);
      });
  };

  const removeFromFavorites = async (movieTitle) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://movies-myflix-85528af4e39c.herokuapp.com/users/${user.Username}/favorites/${movieTitle}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('API Response:', response);

      if (response.ok) {
        setFavoriteMovies(favoriteMovies.filter(movie => movie.Title !== movieTitle)); // Update the favoriteMovies state
        localStorage.removeItem(`favorite_${movieTitle}`);
      }
    } catch (error) {
      console.error('Error removing movie from favorites:', error);
    }
  };

  return (
    <div className="profile-view-container">
      <div className="form-container">
        <Card style={{ width: '18rem' }}>
          <div>
            <Card.Body>
              <Card.Title>Profile</Card.Title>
              <Form>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    minLength="3"
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>New Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formPasswordConfirm">
                  <Form.Label>Confirm New Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBirthday">
                  <Form.Label>Date of Birth:</Form.Label>
                  <Form.Control
                    type="date"
                    value={newBirthday}
                    onChange={(e) => setNewBirthday(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleUpdate}>
                  Update
                </Button>

                <Button variant="danger" onClick={handleDeregister}>
                  Deregister
                </Button>
              </Form>
            </Card.Body>
          </div>
        </Card>
      </div>

      <div className="favorites-container">

        <Form.Group controlId="formFavoriteMovies">
          <Form.Label>Favorite Movies:</Form.Label>
          {favoriteMovies.map(movie => (
            <Card key={movie._id} className="favorite-movie-item">
              <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Button variant="danger" size="sm" onClick={() => removeFromFavorites(movie.Title)}>
                  Remove
                </Button>

              </Card.Body>
            </Card>
          ))}
        </Form.Group>
      </div>
    </div >
  );
};

ProfileView.propTypes = {
  user: PropTypes.object.isRequired,
  onUpdateProfile: PropTypes.func.isRequired,
};

export default ProfileView;