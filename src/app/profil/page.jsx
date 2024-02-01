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
            <div>
                {edit ? <div className="flex">
                    <button onClick={handleConfirm} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Konfirmasi</button>
                    <button onClick={() => { setEdit(e => !e) }} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Cancel</button>
                </div> : <button onClick={() => { setEdit(e => !e) }} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Edit</button>}
                <form>
                    {
                        edit ? <div className="">

                            <div>
                                <p>Nama lengkap</p>
                                <input className="input-style-lki" type="text" name="nama_lengkap"  onChange={handleChange} defaultValue={user?.nama_lengkap} />
                            </div>
                            <div>
                                <p>Email</p>
                                <input className="input-style-lki" type="text" name="email" onChange={handleChange} defaultValue={user?.email} />
                            </div>
                            <div>
                                <p>No whatsapp</p>
                                <input className="input-style-lki" type="text" name="no_whatsapp" onChange={handleChange} defaultValue={user?.no_whatsapp} />
                            </div>
                            <div>
                                <p>No telepon</p>
                                <input className="input-style-lki" type="text" name="no_telepon" onChange={handleChange} defaultValue={user?.no_telp} />
                            </div>
                            <div>
                                <p>Jenis institusi</p>
                                <input className="input-style-lki" type="text" name="jenis_institusi" readOnly defaultValue={user?.jenis_institusi} />
                            </div>
                            {
                                user.jenis_institusi == "Pendidikan" ? <>
                                    <div>
                                        <p>Nama institusi</p>
                                        <input className="input-style-lki" type="text" name="nama_institusi" onChange={handleChange} defaultValue={user?.jenis_institusi} />
                                    </div>
                                    <div>
                                        <p>Fakultas</p>
                                        <input className="input-style-lki" type="text" name="fakultas" onChange={handleChange} defaultValue={user?.falkultas} />
                                    </div>
                                    <div>
                                        <p>Program studi</p>
                                        <input className="input-style-lki" type="text" name="program_studi" onChange={handleChange} defaultValue={user?.program_studi} />
                                    </div>
                                </> : <div>
                                    <p>Nama institusi</p>
                                    <input className="input-style-lki" type="text" name="nama_institusi" onChange={handleChange} defaultValue={user?.jenis_institusi} />
                                </div>
                            }

                        </div> :
                            <>
                                <div>
                                    <p>Nama lengkap</p>
                                    <input className="input-style-lki" type="text" name="nama_lengkap" readOnly defaultValue={user?.nama_lengkap} />
                                </div>
                                <div>
                                    <p>Email</p>
                                    <input className="input-style-lki" type="text" name="email" readOnly defaultValue={user?.email} />
                                </div>
                                <div>
                                    <p>No whatsapp</p>
                                    <input className="input-style-lki" type="text" name="no_whatsapp" readOnly defaultValue={user?.no_whatsapp} />
                                </div>
                                <div>
                                    <p>No telepon</p>
                                    <input className="input-style-lki" type="text" name="no_telepon" readOnly defaultValue={user?.no_telp} />
                                </div>
                                <div>
                                    <p>Jenis institusi</p>
                                    <input className="input-style-lki" type="text" name="no_telepon" readOnly defaultValue={user?.jenis_institusi} />
                                </div>
                                {
                                    user.jenis_institusi == "Pendidikan" ? <>
                                        <div>
                                            <p>Nama institusi</p>
                                            <input className="input-style-lki" type="text" name="no_telepon" readOnly defaultValue={user?.jenis_institusi} />
                                        </div>
                                        <div>
                                            <p>Fakultas</p>
                                            <input className="input-style-lki" type="text" name="fakultas" readOnly defaultValue={user?.falkultas} />
                                        </div>
                                        <div>
                                            <p>Program studi</p>
                                            <input className="input-style-lki" type="text" name="program_studi" readOnly defaultValue={user?.program_studi} />
                                        </div>
                                    </> : <div>
                                        <p>Nama institusi</p>
                                        <input className="input-style-lki" type="text" name="no_telepon" readOnly defaultValue={user?.jenis_institusi} />
                                    </div>
                                }

                            </>
                    }
                </form>

            </div>
        </>
    )
}