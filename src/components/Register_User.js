"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { supabase } from "../supabase"
import Alert from "./Alert"

const RegisterUser = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase.from("profiles").insert([{ id: user.id, username, avatar_url: null }])

      if (error) throw error
      setAlertMessage("Profile created successfully!")
      setTimeout(() => {
        navigate("/")
      }, 3000) // Redirect after 3 seconds
    } catch (error) {
      setAlertMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledWrapper>
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage("")} />}
      <WelcomeText>Welcome!</WelcomeText>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormTitle>Please choose a username</FormTitle>
          <InputWrapper>
            <StyledInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </InputWrapper>
          <SubmitButton disabled={loading}>{loading ? "Registering..." : "Register"}</SubmitButton>
        </form>
      </FormContainer>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  box-sizing: border-box;
  position: relative;
`

const WelcomeText = styled.h1`
  font-size: 3.5rem;
  color: #2c3e50;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 20px;
  left: 20px;

  @media (max-width: 768px) {
    position: static;
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
`

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin: auto;

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #34495e;
  font-size: 1.5rem;
`

const InputWrapper = styled.div`
  margin-bottom: 1.5rem;
`

const StyledInput = styled.input`
  width: calc(100% - 2rem); /* Adjust width to fit within padding */
  padding: 1rem;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.8rem;
  }
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.3s ease, transform 0.1s ease;

  &:hover {
    background: #2980b9;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`

export default RegisterUser

