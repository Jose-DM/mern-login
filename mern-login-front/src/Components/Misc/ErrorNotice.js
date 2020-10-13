import React from 'react'

export default function ErrorNotice(props) {
  return (
    <div>
      <h2>{props.message}</h2>
      <button onClick={props.clearError}>X</button>
    </div>
  )
}
