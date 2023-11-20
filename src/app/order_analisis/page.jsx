"use client"
import { useState } from 'react'




export default function order_analisis() {
    const [countForm, setCountForm] = useState(1);
    const jenis_pengujian = [[]]
    const nama_sample = [""]
    const jumlah_sample = [0]
    const wujud_sample = [""]
    const pelarut = [""]
    const preparasi_sample = [""]
    const target_senyawa = [""]
    const metode_parameter = [""]
    const jurnal_pendukung = [""]
    const keterangan = [""]
    const [verifikasi, setVerifikasi] = useState(false)

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



    const increment = () => {
        setCountForm(a => a + 1)
        console.log(nama_sample)

        
        jenis_pengujian.push([""]);
        nama_sample.push("")
        jumlah_sample.push(0)
        wujud_sample.push("")
        pelarut.push("")
        preparasi_sample.push("")
        target_senyawa.push("")
        metode_parameter.push("")
        jurnal_pendukung.push("")
        keterangan.push("")
        console.log(jenis_pengujian)


    }

    const handleSubmit = () => {

    }

    function CustomForm({ i }) {
        return (
            <>
                <div>

                    <h2 >Jenis pengujian</h2>
                    {
                        kode.map((a, b) => {
                            return (
                                <div key={b}>
                                    <input type="checkbox" id={`jenis_alat${b}${i}`} name={`jenis_alat${b}${i}`} value={a.jenis_alat} onChange={(e) => {
                                        console.log(jenis_pengujian[i])
                                        const arr = [...jenis_pengujian]
                                        const jp = arr[i]
                                        if(jp){
                                            if (jp?.includes(e.target.value)) {
                                                let index = jp?.indexOf(e.target.value);
                                                jenis_pengujian[i]?.splice(index, 1)
                                            } else {
                                                jenis_pengujian[i]?.push(e.target.value)
                                            }
                                        }else{
                                            console.log(jenis_pengujian[i])
                                        }


                                        

                                    }} />
                                    <label htmlFor="vehicle1"> {a.jenis_alat}</label><br />

                                </div>



                            )
                        })
                    }



                </div>
                <div>e
                    <h2 >Nama sample</h2>
                    <input name="nama_sample" required type="text" onChange={(e) => {
                        e.preventDefault()
                        nama_sample[i] = e.target.value

                    }} />
                </div>
                <div>
                    <h2 >Jumlah sample</h2>
                    <input name="jumlah_sample" required type="number" onChange={(e) => {
                        e.preventDefault()
                        jumlah_sample[i] = e.target.value
                    }} />
                </div>
                <div>
                    <p>Wujud sample</p>
                    <label htmlFor="wujud_sample1">Padat</label>
                    <input type="radio" id="wujud_sample1" name="wujud_sample" onChange={(e) => {
                        e.preventDefault()
                        wujud_sample[i] = e.target.value
                    }} value="padat" />
                    <br />
                    <label htmlFor="wujud_sample2">Cair</label>
                    <input type="radio" id="wujud_sample2" name="wujud_sample" onChange={(e) => {
                        e.preventDefault()
                        wujud_sample[i] = e.target.value
                    }} value="cair" />
                    <br />
                    <label htmlFor="wujud_sample3">Gas</label>
                    <input type="radio" id="wujud_sample3" name="wujud_sample" onChange={(e) => {
                        e.preventDefault()
                        wujud_sample[i] = e.target.value
                    }} value="gas" />

                </div>
                <div>
                    <h2 >Pelarut</h2>
                    <input name="pelarut" required type="text" onChange={(e) => {
                        e.preventDefault()
                        pelarut[i] = e.target.value
                    }} />
                </div>
                <div>
                    <p>Wujud sample</p>
                    <input type="radio" name="preparasi_sample" onChange={(e) => {
                        e.preventDefault()
                        preparasi_sample[i] = e.target.value
                    }} value={true} />
                    <h2 htmlFor="preparasi_sample">Ya (esterifikasi/destruksi)</h2><br />
                    <input type="radio" name="preparasi_sample" onChange={(e) => {
                        e.preventDefault()
                        preparasi_sample[i] = e.target.value
                    }} value={false} />
                    <h2 htmlFor="preparasi_sample">Tidak</h2><br />
                </div>
                <div>
                    <h2>Target senyawa/logam yang di cari
                    </h2>
                    <input name="target_senyawa" required type="text" onChange={(e) => {
                        e.preventDefault()
                        target_senyawa[i] = e.target.value
                    }} />
                </div>
                <div>
                    <h2 >Metode Parameter (Suhu/flow/panjang gelombang/fasa gerak, gas, dsb)
                    </h2>
                    <input name="metode_parameter" required type="text" onChange={(e) => {
                        e.preventDefault()
                        metode_parameter[i] = e.target.value
                    }} />
                </div>
                <div>
                    <h2 >Jurnal pendukung
                    </h2>
                    <input name="jurnal_pendukung" type="file" onChange={(e) => {
                        e.preventDefault()
                        jurnal_pendukung[i] = e.target.value
                    }} />
                </div>
                <div>
                    <h2 >Keterangan
                    </h2>
                    <input name="keterangan" type="text" onChange={(e) => {
                        e.preventDefault()
                        keterangan[i] = e.target.value
                    }} />
                </div>

            </>
        )
    }

    return (
        <>
            <div>
                <button onClick={() => console.log(jenis_pengujian)}>asd</button>
                <h1>Order analisis</h1>
                <form onSubmit={handleSubmit}>
                    {

                        (() => {
                            let rows = []
                            for (let i = 0; i < countForm; i++) {
                                rows.push(<CustomForm i={i} key={i} />)
                            }
                            return rows
                        })(

                        )
                    }
                    <div>
                        <input type="radio" id="verifikasi" name="verifikasi" value={true} required onClick={(e) => setVerifikasi(e.target.value)} />
                        <h2 htmlFor="verifikasi">Saya telah memahami proses pengujian yang akan dilakukan dan memahami syarat dan ketentuan yang telah dijelaskan oleh staff/pengelola laboratorium
                        </h2><br />
                    </div>

                    <button type="submit">Kirim</button>

                </form>
                <button onClick={increment}>+</button>
            </div>
        </>
    )
}