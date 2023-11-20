'use client'
import { useState,useContext } from "react"
import {UserContext} from "@/context/userContext"
import { useRouter } from 'next/navigation'

export default function login({searchParams}) {
    const router = useRouter()
    const {prevRoute} = searchParams
    const {user,setUser} = useContext(UserContext)

    const [userForm, setUserForm] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = ()=>{
        if(user.login){
            if(prevRoute){
              redirect(prevRoute)
            }else{
                redirect("/")
            }
        }
    }

    return (
        <>
            <div>
                <h1>Login </h1>
                <form onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email">Email</label>
                      <input name="email" required type="text" onChange={handleChange} />
                  </div>
                  <div>
                      <label htmlFor="password">Password</label>
                      <input name="password" required type="password" onChange={handleChange} />
                  </div>
                  <button type="submit">Login</button>
                </form>
                <a href={`/register?prevRoute=${prevRoute}`}>Register</a>
            </div>
        </>
    )
}