import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, Col, Row, Form, CardBody, CardTitle } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './login-view.scss';
import myFlixLogo from '../../img/myflixlogo.png';



const LoginView = ({ onLoggedIn }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();



  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    fetch("https://movies-myflix-85528af4e39c.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        console.log("Login response:", data);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          onLoggedIn(data.user, data.token);
          navigate('/');
        } else {
          alert("User does not exist");
        }
      })
      .catch((e) => {
        alert("Something Went Wrong");
      });
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Card.Body>
          <Card.Title>
            <img src={myFlixLogo} alt="logo" className="myflix-logo" />
          </Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
                required
              />
            </Form.Group>
            <div className="spacer"></div>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </Form.Group>

            <Button type="submit" className="login-button">
              Login
            </Button>

            <a href="/signup" className="signup-link">
              New User? Sign Up
            </a>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};



export default LoginView;

