"use client"
import Link from "next/link";
import { Button } from 'flowbite-react';
export default function OrderCard({ jenis_pengujian, nama_sample, jumlah_sample, index, wujud_sample, pelarut, preparasi_khusus, target_senyawa, metode_parameter, jurnal_pendukung, deskripsi,hasil_analisis,foto_sample,kode_pengujian
}) {

    return (
        <><div>
            <br/>
        <h1 className="bg-red-600 rounded p-2 text-white">{index}</h1>
        <br/>
        </div>
        
            <div className="border-1 rounded grid grid-cols-2">
                
                
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">nama sample : </h1>
                    <h1>{nama_sample}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">jumlah sample : </h1>
                    <h1>{jumlah_sample}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">jenis pengujian sample : </h1>
                    <h1>{jenis_pengujian}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">kode pengujian sample : </h1>
                    <h1>{kode_pengujian}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">wujud sample : </h1>
                    <h1>{wujud_sample}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">pelarut : </h1>
                    <h1>{pelarut}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">preparasi khusus : </h1>
                    <h1>{preparasi_khusus}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">target senyawa : </h1>
                    <h1>{target_senyawa}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">metode parameter : </h1>
                    <h1>{metode_parameter}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">deskripsi : </h1>
                    <h1>{deskripsi}</h1>
                </div>

            </div>
            <div>
                    <h1 className="text-lg font-semibold text-grey-600">foto sample : </h1>
                    <h1>{foto_sample}</h1>
                </div>
            <div>
                    <h1 className="text-lg font-semibold text-grey-600">jurnal pendukung : </h1>
                    <h1>{jurnal_pendukung}</h1>
                </div>
           
            <div>
                    <h1 className="text-lg font-semibold text-grey-600">Hasil analisis : </h1>
                    <h1><Button color="failure" size={5}>download</Button></h1>
                </div>
        </>
    )
}