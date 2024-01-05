'use client'
import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/context/userContext"
import { useRouter } from 'next/navigation'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import axios from "axios";
import Router from "next/router";

export default function login({ searchParams }) {
    const router = useRouter()
    
    const { prevRoute } = searchParams
    const [userForm, setUserForm] = useState({
        email: "",
        password: ""
    })

    useEffect(()=>{
        async function user(){
            try{
                const data = await axios.get("http://localhost:5000/api/user",{
                    withCredentials: true
                })
               
                if (data.data.success) {
                    if (prevRoute) {
            
                        router.replace(prevRoute)
                    }else{
                        
                        router.replace("/")
                    }
                }  
            }catch(err){
               console.log(err.message)
            }
                    
        }
        user()
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))
        console.log(userForm)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const get_user = async ()=>{
            try{
                const data = await axios.post("http://localhost:5000/api/login",userForm,{withCredentials:true})
                if(data.data.success==true){
                    if (prevRoute) {
                        window.location.replace(prevRoute)
                       
                    } else {
                        window.location.replace("/")
                       
                    }
                }
            }catch(err){
                alert(err.message)
            }
            
        }
        get_user()
    }

  

    return (
        <>
            <div className="">
            <p className='text-center text-4xl font-bold text-gray-800 mt-7'>LOGIN</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>
                <form className="flex max-w-md flex-col gap-4 m-auto" onSubmit={handleSubmit}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1" value="Your email" />
                        </div>
                        <TextInput id="email1" type="text" name="email" placeholder="email" required  onChange={handleChange}/>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Your password" />
                        </div>
                        <TextInput id="password" type="password" name="password" required placeholder="password"  onChange={handleChange}/>
                    </div>
                   
                    <Button type="submit" color="failure">Submit</Button>
                    <br />
                
                <a href={`/register?prevRoute=${prevRoute}`} className="text-center m-auto text-red-600">Register</a>
                </form>
                
            </div>
        </>
    )
}