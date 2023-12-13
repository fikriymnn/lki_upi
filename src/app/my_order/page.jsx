"use client"
import InvoiceCard from "@/components/InvoiceCard"
import { Table } from 'flowbite-react';

export default function My_order(){
    return(
        <>
        <div>
        <h1 className="text-2xl font-bold text-center">My Order</h1>
            <br/>
            <br/>
            <div className=" px-20">
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
              <a href="/my_order/detail/12312" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                RP.300000
              </a>
            </Table.Cell>
            <Table.Cell>
              <a href="/my_order/detail/12312" className="font-medium text-white bg-blue-400 py-1 px-2 hover:underline dark:text-cyan-500">
               detail
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
              <a href="/my_order/detail/12312" className="font-medium text-white bg-blue-400 py-1 px-2 hover:underline dark:text-cyan-500">
               detail
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
            <br/>


            {/* <div>
                <InvoiceCard list_sample={["asa","bbd"]} invoice={"12asndaj23"} tanggal={"17 agustus"} index={1}/>
                <InvoiceCard list_sample={["asa","tt ","aaks"]} invoice={"1se2asndaj2e3"} tanggal={"20 agustus"} index={2}/>

            </div> */}
        </div>
        </>
    )
}