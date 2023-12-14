'use client'
import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/context/userContext"
import { useRouter } from 'next/navigation'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

export default function login({ searchParams }) {
    const router = useRouter()
    const { prevRoute } = searchParams
    // const [email,setEmail] = useState('')
    // const [password,setPassword] = useState('')
    const [login,setLogin] = useState(false)


    const [userForm, setUserForm] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))
        console.log(userForm)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // const get_user = async ()=>{
        //     const data = await fetch("http://localhost:5000/api/login", {
        //         Method: 'POST',
        //         Headers: {
        //           Accept: 'application.json',
        //           'Content-Type': 'application/json'
        //         },
        //         Body: {email:userForm.email,password:userForm.password},
        //         Cache: 'default'
        //       })

        //     if(data.success==true){
        //         setLogin(true)
        //     }
        // }
        // get_user()

        // setTimeout(() => {
        //     if (login) {
                if (prevRoute) {
                    router.push(prevRoute)
                } else {

                    router.push("/")
                }
            // }
          
        // }, 2000)

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
                        <TextInput id="email1" type="text" placeholder="email" required  onChange={handleChange}/>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Your password" />
                        </div>
                        <TextInput id="password" type="password" required placeholder="password"  onChange={handleChange}/>
                    </div>
                   
                    <Button type="submit" color="failure">Submit</Button>
                    <br />
                
                <a href={`/register?prevRoute=${prevRoute}`} className="text-center m-auto text-red-600">Register</a>
                </form>
                
            </div>
        </>
    )
}