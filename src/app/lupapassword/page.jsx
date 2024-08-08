"use client"
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import axios from 'axios';

export default function Lupapassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleLupaPassword = async () => {
        try {
            if (!email) {
                alert('email kosong!')
            } else {
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/lupaPassword/${email}`)
                console.log(data)
                if (data.data.success) {
                    setMessage('sukses')
                } else {
                    setMessage('gagal')
                }
            }

        } catch (err) {
            alert('email tidak valid')
        }
    }
    return (
        <>
            <div className="md:h-screen sm:h-screen h-[550px]  m-auto flex align-center items-center justify-center">

                <div className='m-auto text-center border-2 md:p-10 sm:p-10 py-10 '>
                    <p className="text-center font-semibold md:text-xl sm:text-xl text-xs mb-1 ">Masukan email untuk mengubah password</p>
                    <p className="text-center md:text-base sm:text-base text-xs mb-5 ">pastikan yang inputkan adalah email yang valid dan terdaftar </p>
                    <form className='m-auto'>
                        {
                            message == 'sukses' ? '' : <div className='mx-auto mb-5'>
                                <input type="email" name="email" placeholder="masukan email..." className=' w-9/12' onChange={(e)=>setEmail(e.target.value)}/>
                            </div>
                        }

                        {
                            !message ? '' : message == 'sukses' ? <center className='text-xs text-green-600 font-semibold text-center my-3'>
                                Verifikasi email berhasil terkirim!
                            </center> : <center className='text-xs text-red-600 font-semibold text-center my-3'>
                                Akun/email tidak valid
                            </center>
                        }
                        {
                            message == 'sukses' ? '' : <div className=" mx-auto w-full">
                                <Button
                                   onClick={handleLupaPassword}
                                    color=""
                                    className="mx-auto px-10 text-2xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-rose-300 text-white"
                                >
                                    Submit
                                </Button>
                            </div>

                        }


                    </form>
                </div>



            </div>

        </>
    )
}