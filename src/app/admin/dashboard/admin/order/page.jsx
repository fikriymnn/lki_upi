'use client'
import AdminInvoiceCard from "@/components/AdminInvoiceCard"
import { useState, useEffect } from "react"
import { Table } from 'flowbite-react';
import axios from "axios"
import ReactPaginate from 'react-paginate';
import { Pagination } from 'flowbite-react';

const kode = [
  {
    jenis_pengujian: "GCFID",
    kode_pengujian: "FID",
  },
  {
    jenis_pengujian: "GCMS",
    kode_pengujian: "MS"
  },
  {
    jenis_pengujian: "NMR",
    kode_pengujian: "NMR"
  },
  {
    jenis_pengujian: "AAS",
    kode_pengujian: "AS"
  },
  {
    jenis_pengujian: "FTIR",
    kode_pengujian: "IR"
  },
  {
    jenis_pengujian: "TG",
    kode_pengujian: "TG"
  },
  {
    jenis_pengujian: "DTA",
    kode_pengujian: "DTA"
  },
  {
    jenis_pengujian: "HPLC",
    kode_pengujian: "HP"
  },
  {
    jenis_pengujian: "UV VIS",
    kode_pengujian: "UV"
  },
  {
    jenis_pengujian: "Freezdry",
    kode_pengujian: "FD"
  },
  {
    jenis_pengujian: "LCMSMS",
    kode_pengujian: "LC"
  },
  {
    jenis_pengujian: "XRD",
    kode_pengujian: "XRD"
  },



]

const monthOption = [

  "Januari",

  "Februari",

  "Maret",

  "April",

  "Mei",

  "Juni",

  "Juli",

  "Agustus",

  "September",

  "Oktober",

  "November",

  "desember"
]

export default function Order() {

  const [invoice, setInvoice] = useState([])
  const [page, setPage] = useState(0)
  const [length, setLength] = useState(0)
  const [year, setYear] = useState(0)
  const [month, setMonth] = useState(0)
  const [jenis_pengujian, setJenis_pengujian] = useState('')
  const [yearOption, setYearOption] = useState([])


  useEffect(() => {
    let arr = []
    const yearMax = (new Date().getFullYear() - 2023)
    for (let i = 0; i < yearMax; i++) {
      arr.push(2024 + i)
      setYearOption(arr)
    }
    async function getInvoice() {
      try {
        const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/invoice?success=false&skip=${page * 15}&limit=15${year ? `&year=${year}` : ''}${month ? `&month=${month}` : ''}${jenis_pengujian ? `&jenis_pengujian=${jenis_pengujian}` : ''}`, { withCredentials: true })
        console.log(data.data)
        if (data.data.success) {
          setInvoice(data.data.data)
          setLength(data.data.length_total)
        }
      } catch (err) {
        alert(err.message)
      }
    }
    getInvoice()
  }, [page, month, year, jenis_pengujian])
  return (
    <>
      <p className='text-center text-4xl font-bold text-gray-800 mt-7'>ORDER</p>
      <div className='flex justify-center'>
        <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
      </div>
      <div className='flex flex-wrap justify-center gap-3 mb-10'>
        <div className='md:flex grid grid-cols-2 p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 md:w-72 sm:w-64 w-52 '><p className="md:text-lg sm:text-base text-xs font-semibold text-white p-2 ">Tahun :</p> <select className='ml-3' name="year" id="year" onChange={(e) => setYear(e.target.value)}>
          <option value="" defaultChecked className="input-style-lki text-black">all</option>
          {yearOption.map((v, i) => {
            return <option value={v} key={i}>{v}</option>

          })}
        </select></div>
        <div className='md:flex grid grid-cols-2 p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 md:w-72 sm:w-64 w-52'> <p className="md:text-lg sm:text-base text-xs font-semibold text-white p-2 ">Bulan :</p> <select className='ml-3' name="bulan" id="bulan" onChange={(e) => setMonth(e.target.value)}>
          <option value="" className="input-style-lki " defaultChecked>all</option>
          {monthOption.map((v, i) => {
            return <option value={i} key={i} defaultValue>{v}</option>
          })}
        </select></div>
        <div className='md:flex grid grid-cols-2 p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 md:w-72 sm:w-64 w-52'><p className='md:text-lg sm:text-base text-xs font-semibold text-white p-2 '>Jenis Pengujian : </p> <select className='p-1 ' name="jenis_pengujian" id="jp" onChange={(e) => setJenis_pengujian(e.target.value)}>
          <option value="" className='input-style-lki' defaultChecked>all</option>
          {kode.map((v, i) => {
            return <option value={v.jenis_pengujian} key={i} >{v.jenis_pengujian}</option>
          })}
        </select></div>
      </div>
      <div className="m-auto md:w-full sm:w-full w-11/12">
        <div className=" overflow-scroll w-full">
          <Table>
            <Table.Head>
              <Table.HeadCell>No</Table.HeadCell>
              <Table.HeadCell>Tanggal</Table.HeadCell>
              <Table.HeadCell>Invoice</Table.HeadCell>
              <Table.HeadCell>Jenis Pengujian</Table.HeadCell>
              <Table.HeadCell>Nama</Table.HeadCell>
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
                invoice.map((v, i) => {
                  return (
                    <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {i + 1}
                      </Table.Cell>
                      <Table.Cell>{v.date_format}</Table.Cell>
                      <Table.Cell>{v.no_invoice}</Table.Cell>
                      <Table.Cell>{v.jenis_pengujian}</Table.Cell>
                      <Table.Cell>{v?.id_user?.nama_lengkap}</Table.Cell>
                      <Table.Cell>{v.total_harga}</Table.Cell>
                      <Table.Cell>
                        <a href={`/admin/dashboard/admin/order/${v._id}?no_invoice=${v.no_invoice}`} className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                          keterangan
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{v.status}</p>
                        <br />
                        <a href={`/admin/dashboard/admin/order/tracking/${v._id}`} className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                          keterangan
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }

            </Table.Body>
          </Table>
        </div>
      </div>
      <br />
      <p className=' text-center mb-2 text-red-600'>page : {page + 1}</p>
      <div className="flex justify-center items-center">
        <div className='m-auto flex items-center justify-center'>
          <div className="flex overflow-x-auto sm:justify-center">
            <Pagination currentPage={page} totalPages={parseInt(Math.ceil(length / 15).toFixed())} onPageChange={(a) => { console.log(a); setPage(a - 1) }} />
          </div>
        </div>

      </div>

      <br />
      <br />
      <br />
      <br />
    </>
  )
}

