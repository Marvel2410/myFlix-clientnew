import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import myFlixLogo from '../../img/myflixlogo.png';

import './signup-view.scss';

const SignupView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };

    fetch("https://movies-myflix-85528af4e39c.herokuapp.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)

    }).then(async (response) => {
      console.log(response)
      if (response.ok) {
        alert('Signup successful')
        navigate('/login');
        //window.location.reload()
      } else {
        const e = await response.text()
        console.log(e)
        alert("Signup failed");
      }
    });
  }


  return (
    <div className="login-container">
      <Card className="login-card">
        <Card.Body>
          <Card.Title>
            <img src={myFlixLogo} alt="logo" className="myflix-logo" />
          </Card.Title>

          <form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                minLength="3"
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
            <div className="spacer"></div>
            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </Form.Group>
            <div className="spacer"></div>
            <Form.Group controlId="formBirthday">
              <Form.Control
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
              />
            </Form.Group>
            <div className="spacer"></div>
            <button type="submit" className="login-button">Submit</button>
            <a href="/login" className="signup-link">
              Already have an account? Log in
            </a>
          </form>
        </Card.Body>
      </Card>
    </div >
  );
};

export default SignupView;