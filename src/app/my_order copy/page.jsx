"use client"
import InvoiceCard from "@/components/InvoiceCard"
import { Table } from 'flowbite-react';
import { useEffect, useState } from "react";
import axios from "axios";

export default function My_order(){
    const [invoice,setInvoice] = useState([])

    useEffect(()=>{
       async function getInvoice(){
        try{
          const dataUser = await axios.get("http://localhost:5000/api/user",{withCredentials:true})
          console.log(dataUser)
          if(dataUser.data.success){
            console.log(dataUser)
            const data = await axios.get(`http://localhost:5000/api/invoice?id_user=${dataUser.data.data._id}&skip=0&limit=10`,{withCredentials:true})
            console.log(data)
            if(data.data.success){
              setInvoice(data.data.data)
            }
          }
        }catch(err){
          console.log(err.message)
        }
       }
       getInvoice()
    },[])
    return(
        <>
        <div>
        <p className='text-center text-4xl font-bold text-gray-800 mt-7'>MY ORDER</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>
            <div className=" px-20">
      <Table>
        <Table.Head>
          <Table.HeadCell>No</Table.HeadCell>
          <Table.HeadCell>Tanggal</Table.HeadCell>
          <Table.HeadCell>No Invoice</Table.HeadCell>
          <Table.HeadCell>
           Harga
          </Table.HeadCell>
          <Table.HeadCell>
           Keterangan
          </Table.HeadCell>
          <Table.HeadCell>
           Status
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
        {
              invoice.map((value,i)=>{
                return(
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {i+1}
                  </Table.Cell>
                  <Table.Cell>{`${value.date_format}`}</Table.Cell>
                  <Table.Cell>{value.no_invoice}</Table.Cell>
                  <Table.Cell>    
                      {value.total_harga!==0?value.total_harga:"-"}   
                  </Table.Cell>
                  <Table.Cell>
                    <a href={`/my_order/detail/${value._id}?no_invoice=${value.no_invoice}`} className="font-medium text-white bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                     detail
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{value.status}</p>
                    <br/>
                    <a href={`/my_order/tracking/${value._id}?no_invoice=${value.no_invoice}`} className="font-medium text-white bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                     detail
                    </a>
                  </Table.Cell>
                </Table.Row>
                )
              })
            }
        </Table.Body>
      </Table>
    </div>
    <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>


            {/* <div>
                <InvoiceCard list_sample={["asa","bbd"]} invoice={"12asndaj23"} tanggal={"17 agustus"} index={1}/>
                <InvoiceCard list_sample={["asa","tt ","aaks"]} invoice={"1se2asndaj2e3"} tanggal={"20 agustus"} index={2}/>

            </div> */}
        </div>
        </>
    )
}