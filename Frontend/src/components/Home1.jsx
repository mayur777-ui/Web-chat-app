import React from 'react'
import Users1 from './Users1'
import { Outlet } from 'react-router-dom'
export default function Home1() {
  return (
    <div className='flex bg-white'>
      <Users1 />
      <Outlet />
    </div>
  )
}

