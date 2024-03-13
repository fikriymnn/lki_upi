"use client"
import axios from "axios";
import { useEffect, useState } from "react"
import Navigasi from '@/components/Navigasi'

export default function Profile() {
    const [edit, setEdit] = useState(false)
    const [edit2, setEdit2] = useState(false)
    const [edit3, setEdit3] = useState(false)
    const [admin, setAdmin] = useState({
        email: '',
        password: ''
    })
    const [operator, setOperator] = useState({
        email: '',
        password: ''
    })
    const [pj, setPj] = useState({
        email: '',
        password: ''
    })

    const handleChangeAdmin = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setAdmin(prev => ({ ...prev, [name]: value }))
    }

    const handleChangeOperator = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setOperator(prev => ({ ...prev, [name]: value }))
    }

    const handleChangePj = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setPj(prev => ({ ...prev, [name]: value }))
    }

    const handleConfirm = (e) => {
        e.preventDefault()
        const users = async () => {
            try {
                const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/edit_user/${admin._id}`, admin, { withCredentials: true })
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

    const handleConfirmOp = (e) => {
        e.preventDefault()
        const users = async () => {
            try {
                const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/edit_user/${operator._id}`, operator, { withCredentials: true })
                if (data.data.success) {
                    setEdit2(e => !e)
                    alert('update success')
                }
            } catch (err) {
                alert(err.message)
            }
        }
        users()
    }

    const handleConfirmPj = (e) => {
        e.preventDefault()
        const users = async () => {
            try {
                const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/edit_user/${pj._id}`, pj, { withCredentials: true })
                if (data.data.success) {
                    setEdit3(e => !e)
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
                const data = await axios(`${process.env.NEXT_PUBLIC_URL}/api/admin_user`, { withCredentials: true })
                console.log(data)

                if (data.data.success == true) {
                    console.log(data.data.data)
                    setAdmin(data.data.data.admin)
                    setOperator(data.data.data.operator)
                    setPj(data.data.data.pj)
                }
            } catch (err) {
                alert(err.message)
            }
        }
        users()
    }, [])



    return (
        <>   <Navigasi text1={"admin"} text2={'user'} />
            <div className="md:mb-20 mb-28 h-full md:mt-[-20px] mb-[-10px]">

                <form className="flex justify-center items-center flex-col gap-3 mx-10">
                    <div className=" w-screen flex justify-end items-end md:mr-20 ">

                        {edit ? <div className="flex mx-16 gap-3 my-5 ">
                            <button onClick={handleConfirm} className="grad text-white px-2 py-1 rounded-xl ">Konfirmasi</button>
                            <button onClick={() => { setEdit(e => !e) }} className="grad text-white px-2 py-1 rounded-xl">Cancel</button>
                        </div> : <button onClick={() => { setEdit(e => !e) }} className="grad text-white px-2 py-1 rounded-xl mx-16 my-5">Edit</button>}
                    </div>
                    {
                        edit ? <div className="w-full flex flex-col justify-center items-center gap-3 ">

                            <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px] ">
                                <p className="font-semibold my-auto " >Nama user</p>
                                <p>Admin</p>
                            </div>
                            <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold my-auto">Email</p>
                                <input className="input-style-lki" type="text" name="email" onChange={handleChangeAdmin} defaultValue={admin?.email} />
                            </div>
                            <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold my-auto">Password Baru</p>
                                <input className="input-style-lki" type="text" name="password" onChange={handleChangeAdmin} />
                            </div>
                        </div> :
                            <>
                                <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12   w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px] ">
                                    <p className="font-semibold my-auto">Nama user</p>
                                    <p className="md:text-lg sm:text-base text-xs">Admin</p>
                                </div>
                                <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12 w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                    <p className="font-semibold my-auto">Email</p>
                                    <p className="md:text-lg sm:text-base text-xs">{admin?.email}</p>
                                </div>

                            </>
                    }
                    
                    <div className="w-screen flex justify-end items-end md:mr-20">

                        {edit2 ? <div className="flex mx-16 gap-3 my-5 ">
                            <button onClick={handleConfirmOp} className="grad text-white px-2 py-1 rounded-xl ">Konfirmasi</button>
                            <button onClick={() => { setEdit2(e => !e) }} className="grad text-white px-2 py-1 rounded-xl">Cancel</button>
                        </div> : <button onClick={() => { setEdit2(e => !e) }} className="grad text-white px-2 py-1 rounded-xl mx-16 my-5">Edit</button>}
                    </div>
                    {
                        edit2 ? <div className="w-full flex flex-col justify-center items-center gap-3 ">

                            <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px] ">
                                <p className="font-semibold my-auto " >Nama User</p>
                                <p >Operator</p>
                            </div>
                            <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold my-auto">Email</p>
                                <input className="input-style-lki" type="text" name="email" onChange={handleChangeOperator} defaultValue={operator?.email} />
                            </div>
                            <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold my-auto">Password Baru</p>
                                <input className="input-style-lki" type="text" name="password" onChange={handleChangeOperator} />
                            </div>
                        </div> :
                            <>
                                <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12   w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px] ">
                                    <p className="font-semibold my-auto">Nama user</p>
                                    <p className="md:text-lg sm:text-base text-xs">Operator</p>
                                </div>
                                <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                    <p className="font-semibold my-auto">Email</p>
                                    <p className="md:text-lg sm:text-base text-xs">{operator?.email}</p>
                                </div>

                            </>
                    }
                  
                    <div className="w-screen flex justify-end items-end md:mr-20">

                        {edit3 ? <div className="flex mx-16 gap-3 my-5 ">
                            <button onClick={handleConfirmPj} className="grad text-white px-2 py-1 rounded-xl ">Konfirmasi</button>
                            <button onClick={() => { setEdit3(e => !e) }} className="grad text-white px-2 py-1 rounded-xl">Cancel</button>
                        </div> : <button onClick={() => { setEdit3(e => !e) }} className="grad text-white px-2 py-1 rounded-xl mx-16 my-5">Edit</button>}
                    </div>
                    {
                        edit3 ? <div className="w-full flex flex-col justify-center items-center gap-3 ">

                            <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px] ">
                                <p className="font-semibold my-auto " >Nama User</p>
                                <p>PJ</p>
                            </div>
                            <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold my-auto">Email</p>
                                <input className="input-style-lki" type="text" name="email" onChange={handleChangePj} defaultValue={pj?.email} />
                            </div>
                            <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                <p className="font-semibold my-auto">Password Baru</p>
                                <input className="input-style-lki" type="text" name="password" onChange={handleChangePj} />
                            </div>
                        </div> :
                            <>
                                <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12   w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px] ">
                                    <p className="font-semibold my-auto">Nama user</p>
                                    <p className="md:text-lg sm:text-base text-xs">Operator</p>
                                </div>
                                <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:w-11/12  w-full border-2 rounded-xl p-2 border-b-3 shadow-[rgba(0,0,10,0.3)_3px_2px_2px_0px]">
                                    <p className="font-semibold my-auto">Email</p>
                                    <p className="md:text-lg sm:text-base text-xs">{pj?.email}</p>
                                </div>

                            </>
                    }
                </form>

            </div>
        </>
    )
}