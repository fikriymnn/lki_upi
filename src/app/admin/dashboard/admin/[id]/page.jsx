"use client"

import axios from "axios"
import { useEffect, useState,useMemo } from "react"
import Image from "next/image"
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

export default function detailCardAdmin({searchParams}){
  const {id} = searchParams
   const [cardData,setCardData] = useState({})
   const [foto,setFoto] = useState("")
   const [contoh_hasil,setContoh_hasil] = useState("")
   const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);


   useEffect(()=>{
       async function getData(){
           const data = await axios.get(`http://localhost:5000/api/content/${id}`,{
            withCredentials: true
            })
           if(data.data.success){
            setCardData(data.data.data)
            const base64Image = cardData.foto.data.toString('base64');
            const contentType =  cardData.foto.contentType
            const src = `data:${contentType};base64,${base64Image}`;
            setFoto(src)
            const base64Image2 = cardData.contoh_hasil.data.toString('base64');
            const contentType2 =  cardData.contoh_hasil.contentType
            const src2 = `data:${contentType2};base64,${base64Image2}`;
            setContoh_hasil(src2)
           }
       }
       getData()
   },[foto,contoh_hasil])

   const handleConfirm = (e)=>{
    e.preventDefault()
     async function getData(){
      try{
         await axios.put(`http://localhost:5000/api/content/${id}`,cardData,{
         withCredentials: true,
         headers:  {"Content-Type": 'multipart/form-data'}
         })
         await axios.put(`http://localhost:5000/api/content_foto/${id}`,{foto:foto},{
         withCredentials: true,
         headers:  {"Content-Type": 'multipart/form-data'}
         })
         await axios.put(`http://localhost:5000/api/content_contoh_hasil/${id}`,{contoh_hasil:contoh_hasil},{
         withCredentials: true,
         headers:  {"Content-Type": 'multipart/form-data'}
         })
         alert('update success')
        }catch(err){
          alert(err.message)
        }
     }
     getData()
   }

   const handleChange = (e) => {
     e.preventDefault()
     const { name, value } = e.target
     setCardData(prev => ({ ...prev, [name]: value }))

   }


    return(
        <>
        <div>
            <form onSubmit={handleConfirm}>
          <div>
            <Image src={foto}/>
            <input type="file" name="foto" onChange={(e)=>setFoto(e.target.files[0])}/>
          </div>
          <div>
          <p>judul</p>
          <input type="text" name="title" value={title} onChange={handleChange}/>
          </div>
          <div>
          <p>sub judul</p>
          <ReactQuill className='h-48' theme="snow" value={cardData.sub_title} onChange={(e)=>setCardData(a=>({...a,sub_title:e.target.value}))} />
          </div>
          <div>
          <p>deskripsi</p>
          <ReactQuill className='h-48' theme="snow" value={cardData.deskripsi} onChange={(e)=>setCardData(a=>({...a,deskripsi:e.target.value}))} />
          </div>
          <div>
            <Image src={contoh_hasil}/>
            <input type="file" name="contoh_hasil" onChange={(e)=>setContoh_hasil(e.target.files[0])}/>
          </div>
          <button className="border-2" type="submit">submit edit</button>
          </form>
          
        </div>  
        </>
    )
}