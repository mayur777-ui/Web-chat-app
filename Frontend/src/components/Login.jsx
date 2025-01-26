import React, { useState } from 'react'
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import '../styles/Login.css'
export default function Login() {
  const USER_API_END_POINT = 'http://localhost:5000/user';
  let [input,setInput] = useState({
    email:"",
    password:""
  })
  let [errors,setErrors] = useState({
    email:"",
    password:"",
    both:'',
  })
  let navigate = useNavigate();
  let [show,setShow] = useState(false);
  let handleInput = (e)=>{
    let name= e.target.name;
    let value = e.target.value;
    setInput({...input,[name]:value});
    setErrors({...errors,[name]:""});
  }

  let Handelsubmit = async(e)=>{
    e.preventDefault();
    let errortoset = {
      email:'',
      password:"",
      both:''
    }
    
    if(!input.email){
      errortoset.email = 'Email is required!';
      errortoset.both = 'Email is required!';
    }

    if(!input.password){
      errortoset.password = 'Password is required!';
      errortoset.both = 'Password is required!';
    }

    if(!input.email&&!input.password){
      errortoset.both = "please fill all required filled!";
    }

    setErrors(errortoset);
    if(errortoset.both){
      return;
    }

    try{
      const res = await axios.post(`${USER_API_END_POINT}/login`,input,{
        headers:{
          'Content-Type':"application/json",
        },
        withCredentials:true,
      });
      // console.log(res);
      let token = res.data.token;
      // console.log(token);
      localStorage.setItem('token',token);
      setInput({
        email:"",
        password:"",
      })
      // console.log(res.data.id);
      const id = res.data.id;
      // console.log(res.token);
      navigate(`/Home/${id}`,{replace:true});
    }catch(e){
      // console.log(e.response);
      if(e.response && e.response.status == 404){
        setErrors({...errors,both:'User does not exits!'});
      }else if(e.response &&e.response.status == 400){
        setErrors({...errors,both:'invalid credentials'});
      }else{
        setErrors({...errors,both:'Internal server error'})
      }
    }
  };
  let toggel = ()=>{
    setShow(!show);
  }
  return (
    <div className='bg-gradient-to-r from-gray-950 to-gray-600 h-screen w-full flex justify-center items-center'>
      <div className='main-container w-full max-w-md bg-gray-800 rounded-3xl shadow-lg p-8 flex flex-col items-center'>
        <h1 className='text-4xl text-cyan-300 mb-4 font-bold'>
          Login
        </h1>
        {errors.both && (
          <p className='bg-red-700 bg-opacity-20 text-white border border-red-200 p-4 rounded-md'>{errors.both}</p>
        )}
        <form className='w-full flex flex-col gap-6' onSubmit={Handelsubmit} noValidate>
          {/* <div className="flex flex-col gap-2"> */}
          <div className="email-container flex flex-col gap-2">
            <label htmlFor="email" className="text-lg text-cyan-200 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
              value={input.email}
              onChange={handleInput}
            />{
              errors.email
              &&
              <p className='p-1 font-bold text-white border-red-50 bg-red-500 opacity-70 rounded-md '>{errors.email}</p>
            }
          </div>
          <div className="password-container flex flex-col gap-2">
            <label htmlFor="password" className="text-lg text-cyan-200 font-medium">
              Password
            </label>
            <input
              id="password"
              type={show?'text':'password'}
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
              value={input.password}
              onChange={handleInput}
            />{
              errors.password
              &&
              <p className='p-1 font-bold text-white border-red-50 bg-red-500 opacity-70 rounded-md '>{errors.password}</p>
            }
            <button type='button' onClick={toggel} className='bg-cyan-500 text-gray-900 w-[20%] rounded-md'>
            {/* input.password && show ? 'hide' : 'show'//This will not work why?because of it is evalueted as (input.password && show)?'hide':'show' */}
            {input.password && <span>{show ? 'hide' : 'show'}</span>}
            </button>
          </div>
          <button
            type="submit"
            className="btn w-full py-2 mt-4 bg-cyan-500 text-gray-900 font-bold rounded-lg hover:bg-cyan-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className='mt-6 text-sm text-gray-400'>
          Don't have an account?{' '}
            <Link to="/register" className='text-cyan-400 hover:underline'>
              Register
            </Link>
        </p>
      </div>
    </div>
  )
}
