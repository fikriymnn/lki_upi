"use client"
import { Table } from 'flowbite-react';
import { Button } from 'flowbite-react';
export default function Report() {
    return (
        <>
            <p className='text-2xl text-center font-bold'>Report</p>
       
      <br/>
      <br/>
   
            <Button color="blue" size={5} className='ml-10'>download laporan excel</Button>
            <br/>
        <div className='px-10'>
        <Table>
        <Table.Head>
          <Table.HeadCell>No</Table.HeadCell>
          <Table.HeadCell>Tanggal</Table.HeadCell>
          <Table.HeadCell>Nama </Table.HeadCell>
          <Table.HeadCell>Departement</Table.HeadCell>
          <Table.HeadCell>Jenis Analisis</Table.HeadCell>
          <Table.HeadCell>
           Harga
          </Table.HeadCell>
          <Table.HeadCell>
           Invoice
          </Table.HeadCell>
          <Table.HeadCell>
            Example
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'1'}
            </Table.Cell>
            <Table.Cell>19 Desember 2023</Table.Cell>
            <Table.Cell>Jajang Nurjaman</Table.Cell>
            <Table.Cell>UPI/KIMIA</Table.Cell>
            <Table.Cell>GCFID</Table.Cell>
            <Table.Cell>
              
              RP.300000
           
          </Table.Cell>
            <Table.Cell>FID/12/12/2023</Table.Cell>
         
            <Table.Cell>
             Example
            </Table.Cell>
         </Table.Row>
         <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'2'}
            </Table.Cell>
            <Table.Cell>19 Desember 2023</Table.Cell>
            <Table.Cell>Jajang Nurjaman</Table.Cell>
            <Table.Cell>UPI/KIMIA</Table.Cell>
            <Table.Cell>GCFID</Table.Cell>
            <Table.Cell>
              
              RP.300000
           
          </Table.Cell>
            <Table.Cell>FID/12/12/2023</Table.Cell>
         
            <Table.Cell>
             Example
            </Table.Cell>
         </Table.Row>
         <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'3'}
            </Table.Cell>
            <Table.Cell>19 Desember 2023</Table.Cell>
            <Table.Cell>Jajang Nurjaman</Table.Cell>
            <Table.Cell>UPI/KIMIA</Table.Cell>
            <Table.Cell>GCFID</Table.Cell>
            <Table.Cell>
              
              RP.300000
           
          </Table.Cell>
            <Table.Cell>FID/12/12/2023</Table.Cell>
         
            <Table.Cell>
             Example
            </Table.Cell>
         </Table.Row>
         <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'4'}
            </Table.Cell>
            <Table.Cell>19 Desember 2023</Table.Cell>
            <Table.Cell>Jajang Nurjaman</Table.Cell>
            <Table.Cell>UPI/KIMIA</Table.Cell>
            <Table.Cell>GCFID</Table.Cell>
            <Table.Cell>
              
              RP.300000
           
          </Table.Cell>
            <Table.Cell>FID/12/12/2023</Table.Cell>
         
            <Table.Cell>
             Example
            </Table.Cell>
         </Table.Row>
        </Table.Body>
      </Table>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      
        </>
    )
}