import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <p class='text-red-500'>
            This is Red Text Finally Run.
        </p>
      </div>
    </>
  )
}

export default App
