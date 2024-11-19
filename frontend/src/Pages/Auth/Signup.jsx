import React, { useState } from 'react';
import {Button, TextField} from "@mui/material";
import { Link , useNavigate } from 'react-router-dom';
import toast , {Toaster} from 'react-hot-toast';
import { useEffect } from 'react';


const Signup = () => {
    const [name , setName] = useState("");
    const [contact , setContact] = useState("");
    const [password , setPassword] = useState("");
    const [email , setEmail] = useState("");
    const BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handelSignup = () => {
        if(!email || !name || !password || !contact){
            toast.error("All fields are compulsary");
            return;
        }
        fetch(`${BASE_URL}/Signup` , {
            method : "POST",
            headers : {
                "content-type" : "application/json" 
            },
            body : JSON.stringify({
                email : email , name :name , password : password, contact : contact
            })
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            if(resp.status === 1){
                toast.success("Account created successfully");
                setTimeout(() => {
                    navigate('/Login');                
                }, 2000);
            }else{
                toast.error("User not found");
            }
        }).catch((e) => {
            toast.error("OOP'S - Internal Server Error");
        })
    }

    useEffect(() => {
        toast("Backend will take 30s to load please wait. deployed platform -Render.com");
    } , []);


    return (
        <div className={`flex flex-col w-screen h-screen bg-Signup bg-cover bg-center text-[#686767]`}>
        <div className='w-2/4 h-full flex flex-col p-12'>
            <p className='text-xl font-bold'>{"Explore - Begin Your journey by Signup/login"}</p>
            <p className='font-semibold text-3xl mb-4'>Begin Your Journey, Explore Cars<span className='text-5xl'>.</span></p>
            <p className='font-semibold mb-6'>Already A Member ? <Link to="/Login" className='text-blue-700'>Log In</Link></p>

            <div className='flex flex-col gap-4'>
                
                <div className='w-80 flex flex-col gap-4'>
                  <TextField fullWidth onChange={(e) => setName(e.target.value)}  label="Full Name"  variant="outlined"/>
                  <TextField fullWidth onChange={(e) => setContact(e.target.value)} label="Contact" variant="outlined"/>
                  
                    <TextField  type="email" onChange={(e) => setEmail(e.target.value)} label="Email*" variant="outlined"/>
                    <TextField  type="password" onChange={(e) => setPassword(e.target.value)} label="Password *" variant="outlined"/>
                  
                  <Button onClick={handelSignup} variant="contained">Create Account</Button>
                </div>

            </div>

        </div>      
        <Toaster/>
    </div>
    );
}

export default Signup;