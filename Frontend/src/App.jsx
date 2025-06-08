import { useState } from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import landing from './components/Landing';

import Login from './components/Login';
import Register from './components/Register';
import Home1 from './components/Home1';
import SecureRoute from './components/SecureRoute';
import Landing from './components/Landing';
import ChatBox from './components/ChatBox';
import EmptyChat from './components/EmptyChat';
import { GoogleOAuthProvider } from '@react-oauth/google';
import OTP from './components/OTP.JSX';
import ResetPassword from './components/ResetPassword';

const clientID = "364301647683-pjarv54flf93in9c7hd25e4qlqugd982.apps.googleusercontent.com";
let Routeapp = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path:'/login',
   element:(
      <GoogleOAuthProvider clientId={clientID}>
       <Login/>
       </GoogleOAuthProvider>
    )
  },
  {
    path:'/register',
    element: <Register />
  },
  {
    path:'Home/:id', //=> till now id is user id who is logged in
    element:(
      <SecureRoute>
        <Home1 />
      </SecureRoute>
    ),
    children:[
      {
        path:'',
        element:<EmptyChat/>
      },
      {
        path:'connection/:connectionId',
        element:<ChatBox />
    },
    ]
  },
  {
    path:'/otp',
    element: <OTP />
  },
  {
    path:'/resetPassword',
    element: <ResetPassword />
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={Routeapp}/>
    </>
  )
}

export default App
