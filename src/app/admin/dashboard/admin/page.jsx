'use client'
import React, { useState, useMemo, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import CardPengujiAdmin from '../../../../components/CardPengujiAdmin';
import axios from 'axios';

import { ref, deleteObject,getStorage, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import {storage} from '../../../../firebase/firebase'
import Navigasi from '@/components/Navigasi'



export default function Adminn() {
  const [tambah, setTambah] = useState({
    title: "", foto: "", contoh_hasil: "" 
  });
  const [sub_title, setSub_title] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [layananCard, setLayananCard] = useState([]);
  const [carousel, setCarousel] = useState(["efrfwef", "asdfsdf", "sdfae"]);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setTambah(prev => ({ ...prev, [name]: value }))

  }

  const handleConfirm = (e) => {
    e.preventDefault()
    async function getData() {
      try {
        const data = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/content`, {
          title: tambah.title,
          sub_title: sub_title,
          deskripsi: deskripsi,
          foto: tambah.foto,
          contoh_hasil: tambah.contoh_hasil
        }, {
          withCredentials: true
        })
        if (data.data == 'success') {
          alert('success')
          window.location.reload()
        }

      } catch (err) {
        alert(err.message)
      }
    }
    getData()
  }

  useEffect(() => {
    async function getData() {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/content`, {
        withCredentials: true
      })
      if (data.data.success) {
        setLayananCard(data.data.data)

      }
    }
    getData()
  }, [])

  const handleFoto = async (e) => {
    const downloadURL = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=files`,
        { file: e },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    if (downloadURL.data.filename) {

      setTambah((a) => ({ ...a, foto: downloadURL.data.filename }))

    }

  }

  const handleContohHasil = async (e) => {
    const downloadURL = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=files`,
        { file: e },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    if (downloadURL.data.filename) {

      setTambah((a) => ({ ...a, contoh_hasil: downloadURL.data.filename }))

    }
  }



  return (
    <div className='h-full'>
      <Navigasi text1={"admin"} text2={'content'}/>
      {/* <p className='text-center text-4xl font-bold text-gray-800 mt-7'>WRITE CONTENT</p>
      <div className='flex justify-center'>
        <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
      </div> */}
      <div className="">
        <div className=" md:px-20 px-5 rounded-lg">
          <div className='my-5'>
            <div>
              <form onSubmit={handleConfirm}>
                <div className='flex flex-col gap-5 border-2 border-black p-7 rounded-md'>


                  <h2 className='text-center md:text-3xl text-2xl font-bold text-red-600 mb-5'>Card Layanan</h2>

                  <div>

                    <input type="file" name="foto" onChange={(e) => handleFoto(e.target.files[0])} />
                  </div>
                  <div>
                    <p className='font-semibold'>Judul</p>
                    <input className='rounded-sm' type="text" name="title" onChange={handleChange} />
                  </div>
                  <div className='mb-10'>
                    <p className='font-semibold'>Sub judul</p>
                    <ReactQuill className='h-48 rounded-sm' theme="snow" value={sub_title} onChange={setSub_title} />
                  </div>
                  <div className='mb-10'>
                    <p className='font-semibold'>Deskripsi</p>
                    <ReactQuill className='h-48 rounded-sm' theme="snow" value={deskripsi} onChange={setDeskripsi} />
                  </div>
                  <div>

                    <input type="file" name="contoh_hasil" onChange={(e) => handleContohHasil(e.target.files[0])} />
                  </div>
                  <button className="border-2 w-60 mx-auto grad text-white rounded-md mt-5" type="submit">Submit</button>
                </div>
              </form>

            </div>
          </div>
          <br />
          <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center gap-5'>
            {
              layananCard.map((e, i) => {
                return (
                  <CardPengujiAdmin key={i} id={e._id} title={e.title} src={e.foto} />
                )
              }
              )
            }
          </div>
        </div>
        <br />


      </div>

    </div>
  )
}