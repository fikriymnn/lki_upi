'use client'
import AdminInvoiceCard from "@/components/AdminInvoiceCard"
import { useState } from "react"
import { Table } from 'flowbite-react';

export default function Order(){
    const [invoice,setInvoice] = useState([{list_sample:["asa","bbd"],invoice:"12asndaj23",tanggal:"17 agustus",index:1}])
    return (
        <>
        <h1 className='text-center text-2xl font-bold'>Order</h1>
        <br/>
        <br/>
        <div className="mx-20">
        <Table>
        <Table.Head>
          <Table.HeadCell>No</Table.HeadCell>
          <Table.HeadCell>Tanggal</Table.HeadCell>
          <Table.HeadCell>Sample</Table.HeadCell>
          <Table.HeadCell>Invoice</Table.HeadCell>
          <Table.HeadCell>
           Harga
          </Table.HeadCell>
          <Table.HeadCell>
           Action
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'1'}
            </Table.Cell>
            <Table.Cell>19 Desember 2023</Table.Cell>
            <Table.Cell>GCFID</Table.Cell>
            <Table.Cell>FID/12/12/2023</Table.Cell>
            <Table.Cell>
              
                RP.300000
             
            </Table.Cell>
            <Table.Cell>
              <a href="/admin/dashboard/order/123" className="font-medium text-white bg-blue-400 py-1 px-2 hover:underline dark:text-cyan-500">
               edit
              </a>
              <br/>
              <br/>
              <a href="/my_order/tracking/12312" className="font-medium text-white bg-blue-400 py-1 px-2 hover:underline dark:text-cyan-500">
               progress
              </a>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'2'}
            </Table.Cell>
            <Table.Cell>25 Desember 2023</Table.Cell>
            <Table.Cell>GCMS</Table.Cell>
            <Table.Cell>MS/12/12/2023</Table.Cell>
            <Table.Cell> RP.400000</Table.Cell>

            <Table.Cell>
              <a href="/admin/dashboard/order/123" className="font-medium text-white bg-blue-400 py-1 px-2 hover:underline dark:text-cyan-500">
               edit
              </a>
              <br/>
              <br/>
              <a href="/my_order/tracking/12312" className="font-medium text-white bg-blue-400 py-1 px-2 hover:underline dark:text-cyan-500">
               progress
              </a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
         {/* {
            invoice.map((e,i)=>{
                return <AdminInvoiceCard list_sample={e.list_sample} invoice={e.invoice} tanggal={e.tanggal} index={++i} key={i}/>

            })
         } */}
        </>
    )
}

