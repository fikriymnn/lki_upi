"use client"
import axios from "axios";
import { useEffect, useState } from "react"

export default function Profile() {
    const [edit, setEdit] = useState(false)
    const [user, setUser] = useState({
        nama_lengkap: '',
        jenis_institusi: '',
        no_whatsapp: '',
        email: '',
        no_telp: '',
        nama_institusi: '',
        falkultas: '',
        program_studi: ''

    })

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setUser(prev => ({ ...prev, [name]: value }))
    }

    const handleConfirm = (e) => {
        e.preventDefault()
        const users = async () => {
            try {
                const data = await axios.put(`http://localhost:5000/api/user/${user._id}`, user, { withCredentials: true })
                if (data.data.success) {
                    setEdit(e => !e)
                    alert('update success')
                }
            } catch (err) {
                alert(err.message)
            }
        }
        users()
    }

    useEffect(() => {
        const users = async () => {
            try {
                const data = await axios("http://localhost:5000/api/user", { withCredentials: true })
                console.log(data)
                if (data.data.success == true) {
                    setUser(data.data.data)
                }
            } catch (err) {
                alert(err.message)
            }
        }
        users()
    }, [])



    return (
        <>
            <div className="mb-20">
                <div className="flex justify-end items-end">

                    {edit ? <div className="flex mx-16 gap-3 mb-5">
                        <button onClick={handleConfirm} className="grad text-white px-2 py-1 rounded-xl ">Konfirmasi</button>
                        <button onClick={() => { setEdit(e => !e) }} className="grad text-white px-2 py-1 rounded-xl">Cancel</button>
                    </div> : <button onClick={() => { setEdit(e => !e) }} className="grad text-white px-2 py-1 rounded-xl mx-16 mb-5">Edit</button>}
                </div>
                <form className="flex justify-center items-center flex-col gap-3">
                    {
                        edit ? <div className="w-full flex flex-col justify-center items-center gap-3">

                            <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px] ">
                                <p className="font-semibold">Nama lengkap</p>
                                <input className="input-style-lki" type="text" name="nama_lengkap" onChange={handleChange} defaultValue={user?.nama_lengkap} />
                            </div>
                            <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold">Email</p>
                                <input className="input-style-lki" type="text" name="email" onChange={handleChange} defaultValue={user?.email} />
                            </div>
                            <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold">No whatsapp</p>
                                <input className="input-style-lki" type="text" name="no_whatsapp" onChange={handleChange} defaultValue={user?.no_whatsapp} />
                            </div>
                            <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold">No telepon</p>
                                <input className="input-style-lki" type="text" name="no_telepon" onChange={handleChange} defaultValue={user?.no_telp} />
                            </div>
                            <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold">Jenis institusi</p>
                                <input className="input-style-lki" type="text" name="jenis_institusi" readOnly defaultValue={user?.jenis_institusi} />
                            </div>
                            {
                                user.jenis_institusi == "Pendidikan" ? <>
                                    <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                        <p className="font-semibold">Nama institusi</p>
                                        <input className="input-style-lki" type="text" name="nama_institusi" onChange={handleChange} defaultValue={user?.jenis_institusi} />
                                    </div>
                                    <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                        <p className="font-semibold">Fakultas</p>
                                        <input className="input-style-lki" type="text" name="fakultas" onChange={handleChange} defaultValue={user?.falkultas} />
                                    </div>
                                    <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                        <p className="font-semibold">Program studi</p>
                                        <input className="input-style-lki" type="text" name="program_studi" onChange={handleChange} defaultValue={user?.program_studi} />
                                    </div>
                                </> : <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                    <p className="font-semibold">Nama institusi</p>
                                    <input className="input-style-lki" type="text" name="nama_institusi" onChange={handleChange} defaultValue={user?.jenis_institusi} />
                                </div>
                            }

                        </div> :
                            <>
                                <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px] ">
                                    <p className="font-semibold">Nama lengkap</p>
                                    <p>{user?.nama_lengkap}</p>
                                </div>
                                <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                    <p className="font-semibold">Email</p>
                                    <p>{user?.email}</p>
                                </div>
                                <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                    <p className="font-semibold">No whatsapp</p>
                                    <p>{user?.no_whatsapp}</p>
                                </div>
                                <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                    <p className="font-semibold">No telepon</p>
                                    <p>{user?.no_telp}</p>
                                </div>
                                <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                    <p className="font-semibold">Jenis institusi</p>
                                    <p>{user?.jenis_institusi}</p>
                                </div>
                                {
                                    user.jenis_institusi == "Pendidikan" ? <>
                                        <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                            <p className="font-semibold">Nama institusi</p>
                                            <p>{user?.jenis_institusi}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                            <p className="font-semibold">Fakultas</p>
                                            <p>{user?.falkultas}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                            <p className="font-semibold">Program studi</p>
                                            <p>{user?.program_studi}</p>
                                        </div>
                                    </> : <div className="grid grid-cols-2 md:w-11/12 border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                        <p className="font-semibold">Nama institusi</p>
                                        <p>{user?.jenis_institusi}</p>
                                    </div>
                                }

                            </>
                    }
                </form>

            </div>
        </>
    )
}