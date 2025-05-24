import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login, signInWithGoogle, user } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
 const navigate = useNavigate();
 

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
     navigate("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px'
          }}>
            {!user ? (
              <button
                onClick={signInWithGoogle}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <img 
                  src="/google.jpeg"
                  alt="Google Logo"
                  style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                />
                Sign in with Google
              </button>
            ) : (
              <div>
                <p>Welcome, {user.displayName}!</p>
                <img 
                  src={user.photoURL}
                  alt="Profile"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginTop: '10px'
                  }}
                />
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}