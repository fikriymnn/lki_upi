'use client'
import React, { useState,useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

export default function Dashboard() {
  const [value, setValue] = useState('');
  const [carousel, setCarousel] = useState(["efrfwef","asdfsdf","sdfae"]);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);

  return(
    <div className='h-full'>
      <h1 className='text-center text-2xl font-bold'>Content</h1>
       <br/>
        <br/>
      <div className="">
        <div className='border-2 mx-20 items-center'>
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
            
        </div>
        <br/>
        <br/>
      
        <div className=" px-20 rounded-lg">
        <br/>
        <h2 className='text-center text-xl font-semibold'>Write page</h2>
        <br/>
      <ReactQuill className='h-48' theme="snow" value={value} onChange={setValue} />
        </div>
        <br/>
        <br/>
        <br/>
      
      </div>
      
    </div>
  )
}