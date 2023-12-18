"use client"
import { useRouter } from "next/navigation"
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useState } from "react";

export default function admin(){
    const [role,setRole] = useState("admin")
    const router = useRouter()

    const onSubmit = (e)=>{

        if(role=="admin"){
            router.push('/admin/dashboard/admin')
        } else {
            router.push('/admin/dashboard/operator')
        }
       
    }
    return(
        <>
        <div className="">
        <p className='text-center text-4xl font-bold text-gray-800 mt-7'>LOGIN ADMIN</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>
                <form className="flex max-w-md flex-col gap-4 m-auto ">
                    <div >
                        <div className="mb-2 block ">
                            <Label htmlFor="email1" value="Your email" />
                        </div>
                        <TextInput id="email1" type="text" placeholder="email" required />
                    </div>
                    <div>
                        <div className="mb-2 block ">
                            <Label htmlFor="password" value="Your password" />
                        </div>
                        <TextInput id="password" type="password" required placeholder="password" />
                    </div>
                   
                    <Button onClick={onSubmit} color="failure">Submit</Button>
                    <br />
                <br />
               
                </form>
                
            </div>
        </>
    )
}