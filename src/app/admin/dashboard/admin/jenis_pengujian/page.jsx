'use client'
import {useState} from 'react'
import { Table, Button, Checkbox, Label, TextInput } from 'flowbite-react';

const kode = [
    {
        jenis_alat: "GCFID",
        kode: "FID",
    },
    {
        jenis_alat: "GCMS",
        kode: "MS"
    },
    {
        jenis_alat: "NMR Proton 1D",
        kode: "NMR"
    },
    {
        jenis_alat: "NMR Carbon 1D",
        kode: "NMR"
    },
    {
        jenis_alat: "NMR 2D",
        kode: "NMR"
    },
    {
        jenis_alat: "AAS Flame",
        kode: "AS"
    },
    {
        jenis_alat: "AAS Furnace",
        kode: "AS"
    },
    {
        jenis_alat: "FTIR",
        kode: "IR"
    },
    {
        jenis_alat: "TG DTA",
        kode: "TG"
    },
    {
        jenis_alat: "HPLC",
        kode: "HP"
    },
    {
        jenis_alat: "UV VIS",
        kode: "UV"
    },
    {
        jenis_alat: "Freezdry",
        kode: "FD"
    },
    {
        jenis_alat: "LCMSMS",
        kode: "LC"
    },

]
export default function JenisPengujian(){
    const [jenisPengujian,setJenisPengujian] = useState([{jenis_alat:"Frezer",kode:"AACH"},{jenis_alat:"Pemanas",kode:"AAGD"}])
    return(
        <>
        <p className='text-center text-4xl font-bold text-gray-800 mt-7'>JENIS PENGUJIAN</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>
        <form className="flex max-w-md flex-col gap-4 m-auto border-2 rounded-lg p-8">
        <h1 className='text-md text-center font-bold'>Tambah data</h1>
        
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Jenis alat" />
        </div>
        <TextInput id="email1" type="text" placeholder="jenis alat" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Kode" />
        </div>
        <TextInput id="password1" type="text" placeholder="kode" required />
      </div>
      <Button type="submit" color='failure'>Tambah</Button>
    </form>

        
<br/>
<br/>
<br/>
<div className="px-40 pb-10">
        <Table>
        <Table.Head>
          <Table.HeadCell>No</Table.HeadCell>
          <Table.HeadCell>Jenis alat</Table.HeadCell>
          <Table.HeadCell>Kode</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>

        
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'1'}
            </Table.Cell>
            <Table.Cell>GCFID</Table.Cell>
            <Table.Cell>FID</Table.Cell>
            <Table.Cell><a href="/admin/dashboard/jenis_pengujian" className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
               Delete
              </a></Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'2'}
            </Table.Cell>
            <Table.Cell>GCMS</Table.Cell>
            <Table.Cell>MS</Table.Cell>
            <Table.Cell><a href="/admin/dashboard/jenis_pengujian" className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
               Delete
              </a></Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'3'}
            </Table.Cell>
            <Table.Cell>FTIR</Table.Cell>
            <Table.Cell>IR</Table.Cell>
            <Table.Cell><a href="/admin/dashboard/jenis_pengujian" className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
               Delete
              </a></Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'4'}
            </Table.Cell>
            <Table.Cell>HPLC</Table.Cell>
            <Table.Cell>HP</Table.Cell>
            <Table.Cell><a href="/admin/dashboard/jenis_pengujian" className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
               Delete
              </a></Table.Cell>
            
          </Table.Row>
          
        </Table.Body>
      </Table>
      </div>
        </>
    )
}