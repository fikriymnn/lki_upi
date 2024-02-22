"use client"
import { useRouter } from "next/navigation"
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useState,useEffect } from "react";
import axios from "axios";

export default function Admin(){
    // const [role,setRole] = useState('')
    const [userForm, setUserForm] = useState({
        email: "",
        password: ""
    })
    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))
     
    }

    useEffect(()=>{
        
    },[])

    const onSubmit = (e)=>{
        e.preventDefault()
        const get_user = async ()=>{
            try{
                const data = await axios.post("http://localhost:5000/api/login",userForm,{withCredentials:true})
             
                if(data.data.success==true){
                    const dataUser = await axios.get("http://localhost:5000/api/user",{withCredentials:true})
                    if (dataUser.data.data.role=="admin") {
                        window.location.replace('/admin/dashboard/admin')
                    } else if(dataUser.data.data.role=="operator") {
                        window.location.replace('/admin/dashboard/operator')
                    }else if(dataUser.data.data.role=="pj") {
                        window.location.replace('/admin/dashboard/pj')
                    }
                }else{
                    alert(data.message)
                }
            }catch(err){
                alert(err.message)
            }
            
        }
        get_user()
    }

    // if(role=="admin"){
    //     router.push('/admin/dashboard/admin')
    // } else {
    //     router.push('/admin/dashboard/operator')
    // }
    return(
        <>
        <div className="">
        <p className='text-center text-4xl font-bold text-gray-800 mt-7'>LOGIN ADMIN</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>
                <form className="flex max-w-md flex-col gap-4 m-auto " onSubmit={onSubmit}>
                    <div >
                        <div className="mb-2 block ">
                            <Label htmlFor="email" value="Your email" />
                        </div>
                        <TextInput id="email" type="text" placeholder="email" name="email" required onChange={handleChange}/>
                    </div>
                    <div>
                        <div className="mb-2 block ">
                            <Label htmlFor="password" value="Your password" />
                        </div>
                        <TextInput id="password" type="password" name="password" required placeholder="password" onChange={handleChange}/>
                    </div>
                   
                    <Button type="submit" color="failure">Submit</Button>
                    <br />
                <br />
               
                </form>
                
            </div>
        </>
    )
}