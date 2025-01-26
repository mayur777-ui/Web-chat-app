import React from 'react';
import { useState } from 'react';
import { Route,Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';
export default function Register() {
    let navigate = useNavigate();
    const USER_API_END_POINT = 'http://localhost:5000/user';
    const [input,setinput] = useState({
        name:'',
        email:'',
        password:'',
    })

    const [errors,setErrors] = useState({
      nameError:"",
      emailError:"",
      passwordError:"",
      allError:"",
    })
    const [show,setShow] = useState(false);
    let handleInput = (e) =>{
        const {name,value} = e.target;
        setinput({
            ...input,[name]:value
        }),
        // setErrors({...errors,[name]:''});//for direct update it is ok but for dynamic update we have to add some logic
        setErrors((prevErrors)=>{
          let updatedErrors = {...prevErrors,[name]:value?'':`Please fill your ${value}`};
        // console.log(errors.allError);
          return updatedErrors;
        })
        // console.log(errors.allError);
    }

    let handleSubmit = async(e)=>{
        e.preventDefault();
        // console.log(e);
        let errortoset = {
          nameError:"",
          emailError:"",
          passwordError:"",
          allError:""
        }
        // console.log(input.password.length);
        if(!input.name && !input.email &&!input.password){
          errortoset.allError = "please fill all required fields!";
        }
        
        if(!input.name){
          errortoset.allError = "Please fill your name!";
          errortoset.nameError = "username is required!";
        }

        const emailPtrn = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!input.email){
          errortoset.allError = "Please fill your Email!";
          errortoset.emailError = "email is required!";
        }else if(!emailPtrn.test(input.email)){
          errortoset.allError = "Enter a valid email!";
          errortoset.emailError = "Enter a valid email!";
        }
        // let passwordPtrn = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        if (!input.password) {
          errortoset.allError = "Please fill your password!";
          errortoset.passwordError = "Password is required!";
        } else if (input.password.length < 8 || input.password.length > 20) {
          errortoset.allError = "Password must be between 8 to 20 characters long!";
          errortoset.passwordError = "Password length must be between 8 to 20 characters!";
        } else {
          const passwordPtrn = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
          if (!passwordPtrn.test(input.password)) {
            errortoset.allError = "Password format is invalid!";
            errortoset.passwordError =
              "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character!";
          }
        }
        


        
      
      setErrors(errortoset);
      if(errortoset.nameError || errortoset.emailError || errortoset.passwordError || errortoset.allError){
        return;
      };
      
        try{
            const response = await axios.post(`${USER_API_END_POINT}/register`,input, {
                Headers:{
                    'Content-Type':'application/json',
                },
                withCredentials: true,
            });
            let token = response.data.token;
            localStorage.setItem('token',token);
            setinput({
                name:'',
                email:'',
                password:'',
            });
            const id = response.data.user._id;
            console.log(id);
            navigate(`/Home/${id}`,{replace:true});
        }catch(e){
          if(e.response && e.response.status == 409){
            setErrors({...errors,allError:"With this email user already exists!"});
          }else{
            setErrors({...errors, email: 'Registeration failed.Please try again!'});
          }
          console.log(e.message);
        }
    }
    let toggelpass = () =>{
      setShow(!show);
    }
  return (
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-r from-gray-900 to-gray-600">
      <div className="main-register-container w-full max-w-md bg-gray-800 rounded-3xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-cyan-300 mb-4">Register</h1>
        {errors.allError && (
          <p className='bg-red-700 bg-opacity-20 text-white border border-red-200 p-4 rounded-md'>{errors.allError}</p>
        )}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6" noValidate>
          <div className="name-register-container flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-lg text-cyan-200 font-medium"
            >
              Username
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
              value = {input.name}
              onChange={handleInput}
            />
           {
            errors.nameError &&
              <p className='p-1 font-bold text-white border-red-50  bg-red-500 opacity-70 rounded-md '>{errors.nameError}</p>
            
           }
          </div>

          <div className="email-register-container flex flex-col gap-2">
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
              errors.emailError
              &&
              <p className='p-1 font-bold text-white border-red-50 bg-red-500 opacity-70 rounded-md '>{errors.emailError}</p>
            }
          </div>

          <div className="password-register-container flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-lg text-cyan-200 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type={show?"text":"password"}
              name='password'
              placeholder="Enter your password"
              value={input.password}
                onChange={handleInput}
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            />{errors.passwordError && <p className='p-1 font-bold text-white border-red-50  bg-red-500 opacity-70 rounded-md '>{errors.passwordError}</p>}
            <button type='button' onClick={toggelpass} className='bg-cyan-500 text-gray-900 w-[20%] rounded-md'>
            {/* input.password && show ? 'hide' : 'show'//This will not work why?because of it is evalueted as (input.password && show)?'hide':'show' */}
            {input.password && <span>{show ? 'hide' : 'show'}</span>}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-cyan-500 text-gray-900 font-bold rounded-lg hover:bg-cyan-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-cyan-400 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

