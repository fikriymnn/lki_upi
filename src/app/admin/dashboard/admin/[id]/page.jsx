"use client"

import axios from "axios"
import { useEffect, useState,useMemo } from "react"
import Image from "next/image"
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

export default function detailCardAdmin({searchParams}){
  const {id} = searchParams
   const [cardData,setCardData] = useState({})
   const [foto,setFoto] = useState({})
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
           }
       }
       getData()
   },[])

   const handleConfirm = ()=>{
     async function getData(){
        const data = await axios.put(`http://localhost:5000/api/content/${id}`,cardData,{
         withCredentials: true,
         headers:  {"Content-Type": 'multipart/form-data'}
         })
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
            <form>
          <div>
            <Image src={foto}/>
            <input type="file" name="image" onChange={(e)=>setCardData(a=>({...a,foto:e.target.files[0]}))}/>
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
          </form>
          
        </div>  
        </>
    )
}