import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Password reset instructions have been sent to your email")
      // Add a timer to redirect to login after showing success message
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setError(
        error.code === 'auth/user-not-found'
          ? "No account found with this email"
          : "Failed to reset password. Please try again"
      )
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                ref={emailRef} 
                required 
                placeholder="Enter your email address"
              />
            </Form.Group>
            <Button 
              disabled={loading} 
              className="w-100 mt-3" 
              type="submit"
            >
              {loading ? "Sending..." : "Reset Password"}
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            Remember your password? <Link to="/login">Log In</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}