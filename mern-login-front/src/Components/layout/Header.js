import React from 'react'
import { Link } from 'react-router-dom'
import AuthOptions from '../Auth/AuthOptions'
export default function Header() {
  return (
    <div>
      <Link to="/">Inicio</Link>
      <AuthOptions />
    </div>
  )
}
