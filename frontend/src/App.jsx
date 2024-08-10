import React from 'react'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login" 
import Register from "./pages/Register/Register" 

const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route>
          <Route index element={<Login /> }/>
          <Route path='/dashboard' element={<Home /> }/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
        </Route>
      </Route>
    )
)

function App() {
  return (
    <RouterProvider router={routes}/>
  )
}

export default App
