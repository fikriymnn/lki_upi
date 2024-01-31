"use client"
import axios from "axios";
import { useEffect, useState } from "react"

export default function Profile() {
    const [edit, setEdit] = useState(false)
    const [user, setUser] = useState({
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))
        console.log(userForm)
    }

    const handleConfirm = (e) => {
        const user = async () => {
        try{
            await axios.put("http://localhost:5000/api/user",{ withCredentials: true })
        }catch(err){
            alert(err.message)
        }
    }
    user()
    }

    useEffect(() => {
        const user = async () => {
            try{
              const data = await axios("http://localhost:5000/api/user",{ withCredentials: true })
              console.log(data)
              if (data.data.success == true) {
                  setUser(data.data.data)
              }
            }catch(err){
             alert(err.message)
            }
          }
          user()
    })

    const EditComponent = () => {
        return (
            <>

                <div>
                    <p>Nama lengkap</p>
                    <input type="text" name="nama_lengkap" onChange={handleChange} defaultValue={user?.nama_lengkap} />
                </div>
                <div>
                    <p>Email</p>
                    <input type="text" name="email" onChange={handleChange} defaultValue={user?.email} />
                </div>
                <div>
                    <p>No whatsapp</p>
                    <input type="text" name="no_whatsapp" onChange={handleChange} defaultValue={user?.no_whatsapp} />
                </div>
                <div>
                    <p>No telepon</p>
                    <input type="text" name="no_telepon" onChange={handleChange} defaultValue={user?.no_telepon} />
                </div>
                <div>
                    <p>Jenis institusi</p>
                    <input type="text" name="no_telepon" onChange={handleChange} defaultValue={user?.jenis_institusi} />
                </div>
                {
                    jenis_institusi == "Pendidikan" ? <>
                        <div>
                            <p>Nama institusi</p>
                            <input type="text" name="no_telepon" onChange={handleChange} defaultValue={user?.jenis_institusi} />
                        </div>
                        <div>
                            <p>Fakultas</p>
                            <input type="text" name="fakultas" onChange={handleChange} defaultValue={user?.falkultas} />
                        </div>
                        <div>
                            <p>Program studi</p>
                            <input type="text" name="program_studi" onChange={handleChange} defaultValue={user?.program_studi} />
                        </div>
                    </> : <div>
                        <p>Nama institusi</p>
                        <input type="text" name="no_telepon" onChange={handleChange} defaultValue={user?.jenis_institusi} />
                    </div>
                }

            </>
        )
    }

    return (
        <>
            <div>
                {edit?<button onClick={()=>{setEdit(e=>!e)}} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Edit</button>:<div className="flex">
                    <button onClick={handleConfirm} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Konfirmasi</button>
                    <button onClick={()=>{setEdit(e=>!e)} } className="bg-blue-400 text-white px-2 py-1 rounded-lg">Cancel</button>
                    </div>}

                {
                    edit ? <EditComponent /> :
                        <>
                            <div>
                                <p>Nama lengkap</p>
                                <input type="text" name="nama_lengkap" readOnly defaultValue={user?.nama_lengkap} />
                            </div>
                            <div>
                                <p>Email</p>
                                <input type="text" name="email" readOnly defaultValue={user?.email} />
                            </div>
                            <div>
                                <p>No whatsapp</p>
                                <input type="text" name="no_whatsapp" readOnly defaultValue={user?.no_whatsapp} />
                            </div>
                            <div>
                                <p>No telepon</p>
                                <input type="text" name="no_telepon" readOnly defaultValue={user?.no_telepon} />
                            </div>
                            <div>
                                <p>Jenis institusi</p>
                                <input type="text" name="no_telepon" readOnly defaultValue={user?.jenis_institusi} />
                            </div>
                            {
                                jenis_institusi == "Pendidikan" ? <>
                                    <div>
                                        <p>Nama institusi</p>
                                        <input type="text" name="no_telepon" readOnly defaultValue={user?.jenis_institusi} />
                                    </div>
                                    <div>
                                        <p>Fakultas</p>
                                        <input type="text" name="fakultas" readOnly defaultValue={user?.falkultas} />
                                    </div>
                                    <div>
                                        <p>Program studi</p>
                                        <input type="text" name="program_studi" readOnly defaultValue={user?.program_studi} />
                                    </div>
                                </> : <div>
                                    <p>Nama institusi</p>
                                    <input type="text" name="no_telepon" readOnly defaultValue={user?.jenis_institusi} />
                                </div>
                            }
                        </>
                }

            </div>
        </>
    )
}