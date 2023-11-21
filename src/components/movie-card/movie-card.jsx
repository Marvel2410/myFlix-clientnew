import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './movie-card.scss';

const MovieCard = ({ movies }) => {

  return (
    <div className="movie-list">
      {movies.map(movie => (
        <Card key={movie.id} className="h-100 movie-card">
          <Card.Img variant="top" src={movie.image} />
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Link to={`/movies/${movie.id}`}>Open</Link>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

MovieCard.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MovieCard;