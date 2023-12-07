'use client'
import { useState,useContext } from "react"
import {UserContext} from "@/context/userContext"
import { useRouter } from 'next/navigation'

export default function register({searchParams}) {
    const {prevRoute} = searchParams
    const {user,setUser} = useContext(UserContext)

    const [userForm, setUserForm] = useState({
        nama: "",
        jenisInstansi: "perorangan",
        namaInstansi: "",
        jabatan: "",
        email: "",
        password: "",
        noTelp: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = ()=>{
        if(user.login){
            if(prevRoute){
                router.push(prevRoute)
            }else{
                router.push("/")
            }
        }
    }

    return (
        <>
            <div>
                <h1>Login </h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="nama">Nama lengkap</label>
                        <input name="nama" type="text" required onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="jenisInstansi">Jenis instansi</label>
                        <select name="jenisInstansi" required onChange={handleChange}>
                            <option value="pendidikan">pendidikan</option>
                            <option value="perusahaan">perusahaan</option>
                            <option value="perorangan">perorangan</option>

                        </select>
                    </div>
                    {
                      userForm.jenisInstansi=="perorangan"?"":<div><div>
                      <label htmlFor="namaInstansi">{userForm.jenisInstansi=="perusahaan"?"Nama perusahaan":"Nama instansi pendidikan dan jurusan"}</label>
                      <input name="namaInstansi" required type="text" onChange={handleChange} />
                  </div><div>
                      <label htmlFor="jabatan">Jabatan</label>
                      <input name="jabatan" required type="text" onChange={handleChange} />
                  </div>
                   </div>
                    }
                    <div>
                      <label htmlFor="email">Email</label>
                      <input name="email" required type="text" onChange={handleChange} />
                  </div>
                  <div>
                      <label htmlFor="password">Password</label>
                      <input name="password" required type="password" onChange={handleChange} />
                  </div>
                  <div>
                      <label htmlFor="noTelp">No telepon</label>
                      <input name="noTelp" required type="text" onChange={handleChange} />
                  </div>
                  <button type="submit">Login</button>
                </form>
                <a href={`/login?prevRoute=${prevRoute}`}>Login</a>
            </div>
        </>
    )
}