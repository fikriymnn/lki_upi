"use client"
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Lupapasswords({params}) {
    const {id} = params
    console.log(id)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleLupaPassword = async () => {
        try {
            if (!email) {
                alert('email kosong!')
            }else if(!password){
                alert('password baru kosong!')
            } else {
                const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/lupaPassword/${email}`,{
                    password
                },{
                    withCredentials: true,
                })
                console.log(data)
                if (data.data.success) {
                    setMessage('sukses')
                } else {
                    setMessage('gagal')
                }
            }

        } catch (err) {
            alert(err.message)
        }
    }

    useEffect(()=>{
        async function cek(){
            try{
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/verifyToken/${id}`,{
                    withCredentials: true,
                })                   
                if(data.data){
                    setEmail(data.data.payload.email)
                }
            }catch(err){
                router.replace('/')
            }
        }
        cek()
    }
    ,[])
    return (
        <>
            <div className="md:h-screen sm:h-screen h-[550px]  m-auto flex align-center items-center justify-center">

                <div className='m-auto text-center border-2 md:p-10 sm:p-10 py-10 '>
                    <p className="text-center md:px-20 sm:px-14 px-10 font-semibold md:text-xl sm:text-xl text-xs mb-1 ">Masukan password baru</p>
                    <p className="text-center md:text-base sm:text-base text-xs mb-5 ">pastikan anda ingat dengan yang password baru</p>
                    <form className='m-auto'>
                        {
                            message == 'sukses' ? '' : <div className='mx-auto mb-5'>
                                <input type="email" name="email" placeholder="masukan password baru..." className=' w-9/12' onChange={(e)=>setPassword(e.target.value)}/>
                            </div>
                        }

                        {
                            !message ? '' : message == 'sukses' ? <center className='text-xs text-green-600 font-semibold text-center my-3'>
                                Ganti password berhasil!
                            </center> : <center className='text-xs text-red-600 font-semibold text-center my-3'>
                                Password tidak valid
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