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

        await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/content/${id}`, {
          title: title,
          sub_title: sub_title, deskripsi: deskripsi, contoh_hasil: contoh_hasil, foto: foto
        }, {
          withCredentials: true,
        })
        alert('update success')
      } catch (err) {
        alert(err.message)
      }
    }
    getData()
  }

  const handleFoto = async (e) => {
    const directory = 'files/'
    const fileName = `${e.name + new Date().toISOString()}`

    const storageRef = ref(storage, directory + fileName);

    // Create file metadata including the content type
    const metadata = {
      contentType: e.type,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, e, metadata);
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);
    if (downloadURL) {

      setFoto(downloadURL)

    }

  }

  const handleContohHasil = async (e) => {
    const directory = 'files/'
    const fileName = `${e.name + new Date().toISOString()}`

    const storageRef = ref(storage, directory + fileName);

    // Create file metadata including the content type
    const metadata = {
      contentType: e.type,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, e, metadata);
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);
    if (downloadURL) {

      setContoh_hasil(downloadURL)

    }
  }



  return (
    <>
      {/* <p className='text-center text-4xl font-bold text-gray-800 mt-7'>EDIT CONTENT</p> */}
      <Navigasi text1={"admin"} text2={'edit content'}/>
      <div className=" md:mx-20 mx-5 rounded-lg  mt-24 border-2 border-black p-7 h-full mb-24">

        <form onSubmit={handleConfirm} className="flex flex-col ">
          <div className="md:grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <Image src={foto} width={400} height={400} />
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
            <Image src={contoh_hasil} width={400} height={400} className="mb-6 mt-6" />
            <input type="file" name="contoh_hasil" onChange={(e) => handleContohHasil(e.target.files[0])} />
          </div>
          <button className="border-2 w-60 mx-auto grad text-white rounded-md mt-5" type="submit">Submit Edit</button>
        </form>

      </div>
    </>
  )
}
