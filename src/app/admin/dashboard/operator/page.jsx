"use client"
import { Table } from 'flowbite-react';
import { useState,useEffect } from "react"
import axios from "axios"
export default function Order_Operator(){
  const [invoice, setInvoice] = useState([])

  useEffect(() => {
    async function getInvoice() {
      try {
          const data = await axios.get(`http://localhost:5000/api/invoice?status=sample dikerjakan operator&skip=0&limit=20`, { withCredentials: true })
          if (data.data.success) {
            setInvoice(data.data.data)
          }
      } catch (err) {
        console.log(err.message)
      }
    }
    getInvoice()
  }, [])
    return(
      <>
      <p className='text-center text-4xl font-bold text-gray-800 mt-7'>OPERATOR ORDER</p>
      <div className='flex justify-center'>
        <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
      </div>
      <div className="mx-20">
        <Table>
          <Table.Head>
            <Table.HeadCell>No</Table.HeadCell>
            <Table.HeadCell>Tanggal</Table.HeadCell>
            <Table.HeadCell>Invoice</Table.HeadCell>
            <Table.HeadCell>
              status
            </Table.HeadCell>
            <Table.HeadCell>
              detail
            </Table.HeadCell>
            <Table.HeadCell>
              konfirmasi
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              invoice.map((v, i) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {i+1}
                    </Table.Cell>
                    <Table.Cell>{v.date}</Table.Cell>
                    <Table.Cell>{v.no_invoice}</Table.Cell>
                    <Table.Cell>
                    <p>{v.status}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <a href={`/admin/dashboard/operator/detail/${v._id}?no_invoice=${v.no_invoice}`} className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                        keterangan
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                      <a href={`/admin/dashboard/operator/${v._id}`} className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
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
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
    )
}