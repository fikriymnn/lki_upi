"use client"

import axios from "axios"
import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { ref, deleteObject, getStorage, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { storage } from '../../../../../firebase/firebase'
import Navigasi from '@/components/Navigasi'

export default function DetailCardAdmin({ params }) {
  const { id } = params
  const [cardData, setCardData] = useState({})
  const [sub_title, setSub_title] = useState("")
  const [title, setTitle] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [foto, setFoto] = useState("")
  const [newfoto, setNewFoto] = useState("")
  const [contoh_hasil, setContoh_hasil] = useState("")
  const [newcontoh_hasil, setNewContoh_hasil] = useState("")
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);


  useEffect(() => {
    async function getData() {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/content/${id}`, {
        withCredentials: true
      })
      if (data.data.success) {
        const obj = data.data.data
        setTitle(obj.title)
        setSub_title(obj.sub_title)
        setDeskripsi(obj.deskripsi)
        setFoto(obj.foto)
        setContoh_hasil(obj.contoh_hasil)
      }
    }
    getData()
  }, [])

  const handleConfirm = (e) => {
    e.preventDefault()
    async function getData() {
      try {

        const res = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/content/${id}`, {
          title: title,
          sub_title: sub_title, deskripsi: deskripsi, contoh_hasil: contoh_hasil, foto: foto
        }, {
          withCredentials: true,
        })
        if (res) {
          alert('update success')
          window.location.reload()
        }

      } catch (err) {
        alert(err.message)
      }
    }
    getData()
  }



  const handleFoto = async (file) => {
    try {
      const downloadURL = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=files`,
        { file: file },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (downloadURL.data.filename) {
        setFoto(downloadURL.data.filename)
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleContohHasil = async (file) => {
    try {
      const downloadURL = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=files`,
        { file: file },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (downloadURL.data.filename) {
        setContoh_hasil(downloadURL.data.filename)
      }
    } catch (err) {
      alert(err.message);
    }
  };



  return (
    <>
      {/* <p className='text-center text-4xl font-bold text-gray-800 mt-7'>EDIT CONTENT</p> */}
      <Navigasi text1={"admin"} text2={'edit content'} />
      <div className=" md:mx-20 mx-5 rounded-lg  mt-24 border-2 border-black p-7 h-full mb-24">

        <form onSubmit={handleConfirm} className="flex flex-col ">
          <div className="md:grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <Image src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${foto}`} width={400} height={400} />
              <input type="file" name="foto" onChange={(e) => handleFoto(e.target.files[0])} />
            </div>
            <div className="mt-10 mb-5">
              <p className="font-semibold">Judul</p>
              <input className="rounded" type="text" name="title" value={title} onChange={(e) => { setTitle(e.target.value) }} />
            </div>
          </div>

          <div className="my-10">
            <p className="font-semibold">Sub Judul</p>
            <ReactQuill className='h-48' theme="snow" value={sub_title} onChange={setSub_title} />
          </div>
          <div className="my-10">
            <p className="font-semibold">Deskripsi</p>
            <ReactQuill className='h-48' theme="snow" value={deskripsi} onChange={setDeskripsi} />
          </div>
          <div className="my-10">
            <Image src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${contoh_hasil}`} width={400} height={400} className="mb-6 mt-6" />
            <input type="file" name="contoh_hasil" onChange={(e) => handleContohHasil(e.target.files[0])} />
          </div>
          <button className="border-2 w-60 mx-auto grad text-white rounded-md mt-5" type="submit">Submit Edit</button>
        </form>

      </div>
    </>
  )
}