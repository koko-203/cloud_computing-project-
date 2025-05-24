import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login, signInWithGoogle } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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

  async function handleGoogleSignIn(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await signInWithGoogle()
      navigate("/")
    } catch {
      setError("Failed to sign in with Google")
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

          {/* Google Sign In */}
          <div className="w-100 text-center mt-3">
            <div className="d-flex align-items-center justify-content-center">
              <div className="border-top flex-grow-1"></div>
              <span className="px-2 text-muted">or</span>
              <div className="border-top flex-grow-1"></div>
            </div>
            <Button
              variant="light"
              disabled={loading}
              className="w-100 mt-3"
              onClick={handleGoogleSignIn}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <img 
                src="/google.jpeg"
                alt="Google Logo"
                style={{ width: '20px', height: '20px', objectFit: 'contain' }}
              />
              Sign in with Google
            </Button>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}