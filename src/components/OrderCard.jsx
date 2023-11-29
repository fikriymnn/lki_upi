import Link from "next/link";

export default function OrderCard({ jenis_pengujian, nama_sample, jumlah_sample, index, wujud_sample, pelarut, preparasi_sample, target_senyawa, metode_parameter, jurnal_pendukung, keterangan,hasil_analisis
}) {

    return (
        <>
            <div className="border-1 rounded">
                <h1>{index}</h1>
                <div>
                    <h1>nama sample : </h1>
                    <h1>{nama_sample}</h1>
                </div>
                <div>
                    <h1>jumlah sample : </h1>
                    <h1>{jumlah_sample}</h1>
                </div>
                <div>
                    <h1>jenis pengujian sample : </h1>
                    <ul>
                        {jenis_pengujian.map((value) => {
                            return <li>{value}</li>
                        })}
                    </ul>
                </div>
                <div>
                    <h1>wujud sample : </h1>
                    <h1>{wujud_sample}</h1>
                </div>
                <div>
                    <h1>pelarut : </h1>
                    <h1>{pelarut}</h1>
                </div>
                <div>
                    <h1>preparasi sample : </h1>
                    <h1>{preparasi_sample}</h1>
                </div>
                <div>
                    <h1>target senyawa : </h1>
                    <h1>{target_senyawa}</h1>
                </div>
                <div>
                    <h1>metode parameter : </h1>
                    <h1>{metode_parameter}</h1>
                </div>
                <div>
                    <h1>jurnal_pendukung : </h1>
                    <h1>{jurnal_pendukung}</h1>
                </div>
                <div>
                    <h1>keterangan : </h1>
                    <h1>{keterangan}</h1>
                </div>
                <br/>
                <div>
                    <h1>Hasil analisis : </h1>
                    <h1>{hasil_analisis}</h1>
                </div>




                

            </div>
        </>
    )
}