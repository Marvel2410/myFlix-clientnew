import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './movie-view.scss';


const MovieView = ({ movies, token, username, favoriteMovies, user, removeFromFavorites }) => {
  const { movieId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const isMovieFavorite = movies.some(movie => movie.title === movieId);
    setIsFavorite(isMovieFavorite);
  }, [favoriteMovies, movieId]);

  const addToFavorites = async (movieTitle) => {
    try {
      const response = await fetch(`https://movies-myflix-85528af4e39c.herokuapp.com/users/${username}/favorites/${movieTitle}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error adding movie to favorites:', error);
    }
  };

  const handleRemoveFromFavorites = async (movieTitle) => {
    try {
      const response = await fetch(`https://movies-myflix-85528af4e39c.herokuapp.com/users/${username}/favorites/${movieTitle}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsFavorite(false);
        removeFromFavorites(movieTitle);
      }
    } catch (error) {
      console.error('Error removing movie from favorites:', error);
    }
  };

  const movie = movies.find((m) => m.id === movieId);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="spacer"></div>
          <img className="img-fluid" src={movie.image} alt={movie.title} />
        </div>
        <div className="col-md-6">
          <div>
            <span>Title: </span>
            {movie.title}
          </div>
          <div>
            <span>Description: </span>
            {movie.description}
          </div>
          <div>
            <span>Director: </span>
            {movie.director}
          </div>
          <div>
            <span>Genre: </span>
            {movie.genre}
          </div>
        </div>
      </div>
      <div className="button">
        <Link to="/"> Back </Link>
      </div>
      <div>
        <button onClick={() => addToFavorites(movie.title)}>
          Add to Favorites
        </button>
        <button onClick={() => handleRemoveFromFavorites(movie.title)}>
          Remove from Favorites
        </button>
      </div>
    </div>
  );
}

MovieView.propTypes = {
  movies: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  favoriteMovies: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
};

export default MovieView;


