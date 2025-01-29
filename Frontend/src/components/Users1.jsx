import React, { useEffect, useState } from "react";
import defaultImg from "../images/default.jpg";
import { UserRoundPlus, LogOut, Search } from "lucide-react";
import {useNavigate,useParams,Link } from "react-router-dom";
import axios from 'axios';
import '../styles/User1.css';
export default function Users1() {
  const USER_API_END_POINT = 'http://localhost:5000/user';
  let token = localStorage.getItem('token');
  let [loggedInUser,setloggedInUser] = useState({});
  let [ConnectionList,setConnectionList] = useState([]);
  let [sendConnection,setSendConnection] = useState({
    "email":'',
    "message":'',
  })
  let {id} = useParams();
  let navigate = useNavigate();
  let logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  let [adduser, setadduser] = useState(false);
  let [showprofile, setshowProfile] = useState(false);
  let showAdd = () => {
    setadduser(!adduser);
  };
  let showp = () => {
    setshowProfile(!showprofile);
  };

  useEffect(() => {
    let fetchUser = async () => {
      try {
        let response = await axios.get(`${USER_API_END_POINT}/getDetails/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setloggedInUser(response.data.user); 
        setConnectionList((prevData) => [...prevData, ...response.data.user.connections]);
      } catch (err) {
        if (err.response) {
          console.error('Error:', err.response.data, 'Status:', err.response.status);
        } else {
          console.error('Error:', err.message);
        }
      }
    };
    fetchUser();
  }, [id]);

  let handelSendC = (e) =>{
    let name = e.target.name;
    let value = e.target.value;
    setSendConnection((prev)=>({
      ...prev,[name]:value
    }))
  }

  let SendConnectionTo = async()=>{
    try{
      let res = await axios.post(`${USER_API_END_POINT}/beginconnect/${id}`,sendConnection,{
        headers:{
          Authorization:`Bearer ${token}`,
        }
      })
      setSendConnection({
        email:'',
        message:'',
      })
      setadduser(!adduser);
    }catch(e){
      if(e.response && e.response.status === 400){
        alert('user already in your connections');
      }
    }
  }
  return (
    <div className="connection-main w-full md:w-[40%] flex items-center h-screen">
      <div className="userdetails p-5 w-[20%] h-full bg-slate-800">
        <ul className="h-full flex flex-col justify-start items-center gap-5">
          <li className="flex items-center gap-5 relative">
            <img
              onClick={showp}
              className="cursor-pointer rounded-full w-9 h-9 border-2 border-gray-300 hover:scale-105 transition-all"
              src={defaultImg}
              alt="User Avatar"
            />
            {showprofile && (
              <div className="absolute left-16 top-5 w-[90vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] bg-white border border-gray-200 rounded-3xl shadow-lg p-4 flex flex-col items-center gap-4 animate-slide-down">
                <h2 className="text-lg font-bold text-gray-800">{loggedInUser.name}</h2>
                <p className="text-gray-600 text-sm text-center">
                  Welcome back! Manage your profile or check out your settings.
                </p>
                <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-md transition-transform transform hover:scale-105">
                  View Profile
                </button>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-md transition-transform transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            )}
          </li>

          <li className="relative flex items-center gap-4">
            <UserRoundPlus
              className="cursor-pointer  hover:text-slate-300 transition-all text-2xl"
              onClick={showAdd}
            />
            {adduser && (
              <div className="absolute top-10 left-10 w-[90vw] md:w-[50vw] lg:w-[40vw] h-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col gap-6 animate-slide-down">
                <h1 className="text-center text-3xl font-extrabold text-green-600">
                  Add Connections
                </h1>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="email"
                    className="text-lg font-semibold text-gray-800"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={sendConnection.email}
                    onChange={handelSendC}
                    placeholder="Enter email"
                    className="bg-gray-50 text-gray-700 border border-green-400 rounded-lg px-4 py-3 w-full outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="message"
                    className="text-lg font-semibold text-gray-800"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Type your message here"
                    value={sendConnection.message}
                    onChange={handelSendC}
                    className="bg-gray-50 text-gray-700 border border-green-400 rounded-lg px-4 py-3 w-full h-28 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  ></textarea>
                </div>
                <button onClick={SendConnectionTo} className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                  Send Connection Request
                </button>
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl transition-all"
                  onClick={showAdd}
                >
                  ✕
                </button>
              </div>
            )}
          </li>

          <li onClick={logout} className="cursor-pointer absolute bottom-10">
            <LogOut />
          </li>
        </ul>
      </div>
      <div className="w-full h-full bg-slate-100">
        <div className="search w-full h-[6vw] border border-gray-300 flex justify-center items-center gap-3 px-4 bg-white rounded-lg shadow-sm">
          <input
            className="h-[3vw] w-full text-gray-700 bg-gray-50 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            type="text"
            placeholder="Search..."
          />
          <Search className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer" />
        </div>
        <div className="connectionList w-full">
            {
              ConnectionList.map((connectOne,i) =>(
                <Link key={i} to={`connection/${connectOne._id}`}>
                  <div className="connectiondetails text-xl text-slate-700 flex items-center gap-4 cursor-pointer p-5">
              <img src={defaultImg} alt="" className="w-9 h-9 rounded-full connectionpic" />
              <h2>
                {connectOne.name}
              </h2>
            </div>
                </Link>
              ))
            }
        </div> 
      </div>
    </div>
  );
}
