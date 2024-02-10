'use client'
import React, { useState, useMemo,useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import CardPengujiAdmin from '../../../../components/CardPengujiAdmin';
import axios from 'axios';

export default function Adminn() {
  const [tambah, setTambah] = useState({
    title:"",foto:{},contoh_hasil:{}
  });
  const [sub_title, setSub_title] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [layananCard, setLayananCard] = useState([]);
  const [carousel, setCarousel] = useState(["efrfwef", "asdfsdf", "sdfae"]);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setTambah(prev => ({ ...prev, [name]: value }))

  }

  const handleConfirm = (e)=>{
    e.preventDefault()
     async function getData(){
      try{
         const data = await axios.post(`http://localhost:5000/api/content`,{
          title:tambah.title,
          sub_title:sub_title,
          deskripsi:deskripsi,
          foto:tambah.foto,
          contoh_hasil:tambah.contoh_hasil        
         },{
         withCredentials: true,
         headers:  {"Content-Type": 'multipart/form-data'}
         })
         if(data.data=='success'){
          alert('success')
          window.location.reload()
         }
       
        }catch(err){
          alert(err.message)
        }
     }
     getData()
   }

  useEffect(()=>{
    async function getData(){
        const data = await axios.get(`http://localhost:5000/api/content?resize=true`,{
         withCredentials: true
         })
        if(data.data.success){
         setLayananCard(data.data.data)
         
        }
    }
    getData()
},[])



  return (
    <div className='h-full'>
      <p className='text-center text-4xl font-bold text-gray-800 mt-7'>WRITE CONTENT</p>
      <div className='flex justify-center'>
        <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
      </div>
      <div className="">
        {/* <div className='border-2 mx-20 items-center'>
          <br/>
            <h2 className='text-center text-xl font-semibold'>Carousel</h2>
            <br/>
            <br/>
            <div className='flex justify-evenly'>{carousel.map((e,i)=>{
                return <img src="/lab.jpg"  className="w-56" alt={"foto"} key={i}/>
            })}</div>
            <br/>
            <div className='m-auto items-center flex'>
            <input type='file' name='file'  className='mx-auto content-center px-auto items-center'/>
            
            </div>
            <br/>
        <br/>
            <Button className='m-auto'>Submit</Button>
            <br/>
        <br/>
            
        </div> */}
        <br />
        <br />
        {/* card alat */}
        <div>

        </div>

        <div className=" px-20 rounded-lg">
          <br />
          <h2 className='text-center text-xl font-semibold'>Card Layanan</h2>
          <br />
          <div>
            <div>
              <form onSubmit={handleConfirm}>
                <div>
                
                  <input type="file" name="foto" onChange={(e) => setTambah((a)=>({...a,foto:e.target.files[0]}))} />
                </div>
                <div>
                  <p>judul</p>
                  <input type="text" name="title" onChange={handleChange} />
                </div>
                <div className='mb-10'>
                  <p>sub judul</p>
                  <ReactQuill className='h-48' theme="snow" value={sub_title}  onChange={setSub_title} />
                </div>
                <div className='mb-10'>
                  <p>deskripsi</p>
                  <ReactQuill className='h-48' theme="snow" value={deskripsi} onChange={setDeskripsi} />
                </div>
                <div>
                 
                  <input type="file" name="contoh_hasil" onChange={(e) => setTambah((a)=>({...a,contoh_hasil:e.target.files[0]}))} />
                </div>
                <button className="border-2" type="submit">submit edit</button>
              </form>

            </div>
          </div>
          <br />
          <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center'>
            {
              layananCard.map((e, i) => {
                return (
                  <CardPengujiAdmin key={i} id={e._id} title={e.title} src={`data:${e.foto.contentType};base64,${e.foto.data.toString('base64')}`} />
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