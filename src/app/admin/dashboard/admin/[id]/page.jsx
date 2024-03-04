"use client"

import axios from "axios"
import { useEffect, useState,useMemo } from "react"
import Image from "next/image"
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

export default function DetailCardAdmin({params}){
   const {id} = params
   const [cardData,setCardData] = useState({})
   const [sub_title,setSub_title] = useState("")
   const [title,setTitle] = useState("")
   const [deskripsi,setDeskripsi] = useState("")
   const [foto,setFoto] = useState("")
   const [newfoto,setNewFoto] = useState("")
   const [contoh_hasil,setContoh_hasil] = useState("")
   const [newcontoh_hasil,setNewContoh_hasil] = useState("")
   const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);


   useEffect(()=>{
       async function getData(){
           const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/content/${id}`,{
            withCredentials: true
            })
           if(data.data.success){
            const obj = data.data.data
            setTitle(obj.title)
            setSub_title(obj.sub_title)
           setDeskripsi(obj.deskripsi)
            const buffer = Buffer.from(data.data.data.foto.data);
            const base64Image = buffer.toString('base64');
            const contentType =  obj.foto.contentType
            const src = `data:${contentType};base64,${base64Image}`;
            setFoto(src)
            const buffer2 = Buffer.from(data.data.data.contoh_hasil.data);
            const base64Image2 = buffer2.toString('base64');
            const contentType2 =  obj.contoh_hasil.contentType
            const src2 = `data:${contentType2};base64,${base64Image2}`;
            setContoh_hasil(src2)
           }
       }
       getData()
   },[])

   const handleConfirm = (e)=>{
    e.preventDefault()
     async function getData(){
      try{
         await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/content/${id}`,{
           title:title,
           sub_title:sub_title,deskripsi:deskripsi
         },{
         withCredentials: true,
         })
         if(newfoto){
          await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/content_foto/${id}`,{
            foto:newfoto
            },{
            withCredentials: true,
            headers:  {"Content-Type": 'multipart/form-data'}
            })
         }
         if(newcontoh_hasil){
          await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/content_contoh_hasil/${id}`,{
            contoh_hasil:newcontoh_hasil
          },{
          withCredentials: true,
          headers:  {"Content-Type": 'multipart/form-data'}
          })
         }
         
        
         alert('update success')
        }catch(err){
          alert(err.message)
        }
     }
     getData()
   }


    return(
        <>
        <div>
            <form onSubmit={handleConfirm}>
              <div className="grid grid-cols-2">
              <div>
            <Image src={foto} width={400} height={400}/>
            <input type="file" name="foto" onChange={(e)=>setNewFoto(e.target.files[0])}/>
          </div>
          <div>
          <p>judul</p>
          <input type="text" name="title" value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
          </div>
              </div>
          
          <div>
          <p>sub judul</p>
          <ReactQuill className='h-48' theme="snow" value={sub_title} onChange={setSub_title} />
          </div>
          <div>
          <p>deskripsi</p>
          <ReactQuill className='h-48' theme="snow" value={deskripsi} onChange={setDeskripsi} />
          </div>
          <div>
            <Image src={contoh_hasil} width={50} height={50}/>
            <input type="file" name="contoh_hasil" onChange={(e)=>setNewContoh_hasil(e.target.files[0])}/>
          </div>
          <button className="border-2" type="submit">submit edit</button>
          </form>
          
        </div>  
        </>
    )
}