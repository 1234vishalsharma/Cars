import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { saveUserData } from '../../Store/Reducer';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const handelLogin = () => {
    if (!email || !password) {
      toast.error("All fields are compulsary");
      return;
    }
    fetch(`${BASE_URL}/Login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        if (resp.status === 1) {
          toast.success("User Logged in successfully");
          localStorage.setItem('token' , resp.token);
          localStorage.setItem('userID' , resp.UserData.userID);
          localStorage.setItem('userName' , resp.UserData.name);
          dispatch(saveUserData(resp.UserData)); 
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error("User Not Exist");
        }
      })
      .catch((e) => {
        toast.error("Internal Server Error");
      });
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-Login bg-cover bg-center  text-[#454545]">
      <div className="w-2/4 h-full flex flex-col p-12">
        <p className="text-xl font-bold">
          {"Explore - Begin Your journey by Signup/login"}
        </p>
        <p className="font-semibold text-3xl mb-4">
          Enter and Explore Cars<span className="text-5xl">.</span>
        </p>
        <p className="font-semibold mb-6">
          Become A Member ?{" "}
          <Link to="/Signup" className="text-blue-700">
            Create One
          </Link>
        </p>

        <div className="flex flex-col gap-4">
          <div className="w-80 flex flex-col gap-4">
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              type="email"
              style={{ color: "white" }}
              label="Email"
              variant="outlined"
            />
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              type="password"
              style={{ color: "white" }}
              label="Password"
              variant="outlined"
            />
            <Button onClick={handelLogin} variant="contained">
              Log In
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
