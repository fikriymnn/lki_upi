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
                const data = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/login`,userForm,{withCredentials:true})
             
                if(data.data.success==true){
                    const dataUser = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`,{withCredentials:true})
                    if (dataUser.data.data.role=="admin") {
                        window.location.replace('/admin/dashboard/admin')
                    } else if(dataUser.data.data.role=="operator") {
                        window.location.replace('/admin/dashboard/operator')
                    }else if(dataUser.data.data.role=="pj") {
                        window.location.replace('/admin/dashboard/pj')
                    }else{
                      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/logout`, { withCredentials: true })
                      window.location.replace('/')
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
        <div className="md:mt-20 sm:mt-14 mt-8 mb-14">
        <p className='text-center md:text-2xl sm:text-xl text-lg font-bold text-gray-800 mt-7'>LOGIN ADMIN</p>
                      <div className='flex justify-center'>
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
