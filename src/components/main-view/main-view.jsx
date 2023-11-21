import React, { useState, useEffect } from 'react';
import MovieCard from '../movie-card/movie-card';
import MovieView from '../movie-view/movie-view';
import LoginView from '../login-view/login-view';
import NavigationBar from '../navigation-bar/navigation-bar';
import ProfileView from '../profile-view/profile-view';
import SignupView from '../signup-view/signup-view';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';

import { Button, Container, Nav, Form, Row } from 'react-bootstrap';

const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  const [search, setSearch] = useState("");

  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const removeFromFavorites = async (movieTitle) => {
    try {
      const response = await fetch(`https://movies-myflix-85528af4e39c.herokuapp.com/users/${username}/favorites/${movieTitle}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        removeFromFavorites(movieTitle);
      }
    } catch (error) {
      console.error('Error removing movie from favorites:', error);
    }
  };

  const handleUpdateProfile = (updatedUserData) => {
  };

  useEffect(() => {
    if (!token) return;

    fetch("https://movies-myflix-85528af4e39c.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => response.json())
      .then(data => {
        console.log("Movies from API:", data);
        const moviesFromApi = data.map(movie => ({
          id: movie.id,
          title: movie.Title,
          description: movie.Description,
          genre: movie.Genre,
          director: movie.Director,
          image: movie.ImagePath
        }));
        setMovies(moviesFromApi);
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, [token]);

  useEffect(() => {
    return () => {
      // cleanup when exit app
      setUser(null);
      setToken(null);
      localStorage.clear();
    };
  }, []);

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    setFilteredMovies(movies);
  }, [movies]);

  const handleGenreChange = e => {
    const genre = e.target.value;

    if (genre === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => movie.genre === genre);
      setFilteredMovies(filtered);
    }

    setSelectedGenre(genre);
  };

  return (
    <Router>
      <div className="main-view">
        {user && <NavigationBar user={user} movies={movies} search={search} onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }} />}
        <Row className="margin-top-custom justify-content-center mb-5">
          <Routes>
            <Route path="/login" element={
              <LoginView
                onLoggedIn={(user, token) => {
                  setUser(user);
                  setToken(token);

                }}

              />
            } />
            <Route
              path="/profile"
              element={<ProfileView
                user={user}
                token={token}
                movie={movies}
                setUser={setUser}
                onUpdateProfile={handleUpdateProfile}
              />}
            />
            <Route
              path="/signup"
              element={
                <>
                  {user ? (
                    <Navigate to="/" />
                  ) : (
                    <Col md={6}>
                      <SignupView />

                    </Col>
                  )}
                </>
              }
            />
            <Route
              path="/"
              element={
                <>
                  {!user ? (
                    <Navigate to="/login" replace />
                  ) : movies.length === 0 ? (
                    <Col>The list is empty!</Col>
                  ) : (
                    <>
                      <Col md={7} className="mx-auto mt-4 p-3" style={{ background: 'blue', borderRadius: '5px', border: '2px solid white' }}>
                        <Form.Group controlId="genreFilter">
                          <Form.Label>Filter by Genre:</Form.Label>
                          <Form.Control as="select" onChange={handleGenreChange} value={selectedGenre}>
                            <option value="">All Genres</option>
                            {Array.from(new Set(movies.map(movie => movie.genre))).map(genre => (
                              <option key={genre} value={genre}>
                                {genre}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <div className="movie-card-container mt-4 d-flex flex-wrap justify-content-center">
                        {filteredMovies.map((movie) => (
                          <Col xs={6} sm={6} md={4} lg={3} className="mb-4" key={movie.id}>
                            <MovieCard
                              movies={[movie]}
                              token={token}
                              user={user}
                              setUser={setUser}
                              username={user.Username}
                            />
                          </Col>
                        ))}
                      </div>
                    </>
                  )}
                </>
              }
            />
            {/* Update:: changing the prop to movies not movie. We will pass in our entire list here and filter in that component. */}
            <Route
              path="/movies/:movieId"
              element={<MovieView movies={movies} username={user ? user.Username : null} token={token} />}
            />
            <Route
              path="/profile"
              element={<ProfileView user={user} token={token} movie={movies} setUser={setUser} />}
            />

          </Routes>
        </Row>
      </div>
    </Router>
  );
};

MainView.propTypes = {
  onLoggedOut: PropTypes.func
};

export default MainView;
