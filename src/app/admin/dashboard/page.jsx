'use client'
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Dashboard() {
  const [value, setValue] = useState('');
  const [carousel, setCarousel] = useState(["efrfwef","asdfsdf","sdfae"]);


  return(
    <>
      <h1>Content</h1>
      <div>
        <div>
            <h2>Carousel</h2>
            <div className='flex justify-evenly'>{carousel.map((e,i)=>{
                return <img src={e} alt={"foto"} key={i}/>
            })}</div>
            <input type='file' name='file' />
        </div>
      <div>
        <h2>Write Home</h2>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      </div>
      </div>
      
    </>
  )
}