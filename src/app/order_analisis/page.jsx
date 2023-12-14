"use client"
import { useState } from 'react'

// export default function order_analisis() {

//     const [jenis_pengujian,setJenis_pengujian] = useState([]);
//     const [nama_sample,setNama_sample] = useState("")
//     const [jumlah_sample,setJumlah_sample] = useState(1)
//     const [wujud_sample,setWujud_sample] = useState("")
//     const [pelarut,setPelarut] = useState("")
//     const [preparasi_sample,setPreparasi_sample] =useState("")
//     const [target_senyawa,setTarget_senyawa] =useState("")
//     const [metode_parameter,setMetode_parameter] = useState("")
//     const [jurnal_pendukung,setJurnal_pendukung] = useState("")
//     const [keterangan,setKeterangan] = useState("")
//     const [verifikasi, setVerifikasi] = useState(false)

//     const kode = [
//         {
//             jenis_alat: "GCFID",
//             kode: "FID",
//         },
//         {
//             jenis_alat: "GCMS",
//             kode: "MS"
//         },
//         {
//             jenis_alat: "NMR Proton 1D",
//             kode: "NMR"
//         },
//         {
//             jenis_alat: "NMR Carbon 1D",
//             kode: "NMR"
//         },
//         {
//             jenis_alat: "NMR 2D",
//             kode: "NMR"
//         },
//         {
//             jenis_alat: "AAS Flame",
//             kode: "AS"
//         },
//         {
//             jenis_alat: "AAS Furnace",
//             kode: "AS"
//         },
//         {
//             jenis_alat: "FTIR",
//             kode: "IR"
//         },
//         {
//             jenis_alat: "TG DTA",
//             kode: "TG"
//         },
//         {
//             jenis_alat: "HPLC",
//             kode: "HP"
//         },
//         {
//             jenis_alat: "UV VIS",
//             kode: "UV"
//         },
//         {
//             jenis_alat: "Freezdry",
//             kode: "FD"
//         },
//         {
//             jenis_alat: "LCMSMS",
//             kode: "LC"
//         },

//     ]





//     const handleSubmit = () => {

//     }

//     function CustomForm({ i }) {
//         return (
//             <>
//                 <div>

//                     <h2 >Jenis pengujian</h2>
//                     {
//                         kode.map((a, b) => {
//                             let check = jenis_pengujian[i]?.includes(a.jenis_alat)&&true;
//                             return (
//                                 <div key={b}>
//                                     <input type="checkbox" id={`jenis_alat${b}${i}`} defaultChecked={check} name={`jenis_alat${b}${i}`} value={a.jenis_alat} onChange={(e) => {
//                                         if(jenis_pengujian.includes(e.target.value)){
//                                             const index = jenis_pengujian.indexOf(e.target.value)
//                                             jenis_pengujian.splice(index, 1) 
//                                         }
//                                     }} />
//                                     <label htmlFor="vehicle1"> {a.jenis_alat}</label><br />

//                                 </div>



//                             )
//                         })
//                     }



//                 </div>
//                 <div>e
//                     <h2 >Nama sample</h2>
//                     <input name="nama_sample" required type="text" value={nama_sample[i]?nama_sample[i]:undefined} onChange={(e) => {
//                         e.preventDefault()
//                         nama_sample[i] = e.target.value

//                     }} />
//                 </div>
//                 <div>
//                     <h2 >Jumlah sample</h2>
//                     <input name="jumlah_sample" required type="number" onChange={(e) => {
//                         e.preventDefault()
//                         jumlah_sample[i] = e.target.value
//                     }} />
//                 </div>
//                 <div>
//                     <p>Wujud sample</p>
//                     <label htmlFor="wujud_sample1">Padat</label>
//                     <input type="radio" id="wujud_sample1" name="wujud_sample" onChange={(e) => {
//                         e.preventDefault()
//                         wujud_sample[i] = e.target.value
//                     }} value="padat" />
//                     <br />
//                     <label htmlFor="wujud_sample2">Cair</label>
//                     <input type="radio" id="wujud_sample2" name="wujud_sample" onChange={(e) => {
//                         e.preventDefault()
//                         wujud_sample[i] = e.target.value
//                     }} value="cair" />
//                     <br />
//                     <label htmlFor="wujud_sample3">Gas</label>
//                     <input type="radio" id="wujud_sample3" name="wujud_sample" onChange={(e) => {
//                         e.preventDefault()
//                         wujud_sample[i] = e.target.value
//                     }} value="gas" />

//                 </div>
//                 <div>
//                     <h2 >Pelarut</h2>
//                     <input name="pelarut" required type="text" onChange={(e) => {
//                         e.preventDefault()
//                         pelarut[i] = e.target.value
//                     }} />
//                 </div>
//                 <div>
//                     <p>Wujud sample</p>
//                     <input type="radio" name="preparasi_sample" onChange={(e) => {
//                         e.preventDefault()
//                         preparasi_sample[i] = e.target.value
//                     }} value={true} />
//                     <h2 htmlFor="preparasi_sample">Ya (esterifikasi/destruksi)</h2><br />
//                     <input type="radio" name="preparasi_sample" onChange={(e) => {
//                         e.preventDefault()
//                         preparasi_sample[i] = e.target.value
//                     }} value={false} />
//                     <h2 htmlFor="preparasi_sample">Tidak</h2><br />
//                 </div>
//                 <div>
//                     <h2>Target senyawa/logam yang di cari
//                     </h2>
//                     <input name="target_senyawa" required type="text" onChange={(e) => {
//                         e.preventDefault()
//                         target_senyawa[i] = e.target.value
//                     }} />
//                 </div>
//                 <div>
//                     <h2 >Metode Parameter (Suhu/flow/panjang gelombang/fasa gerak, gas, dsb)
//                     </h2>
//                     <input name="metode_parameter" required type="text" onChange={(e) => {
//                         e.preventDefault()
//                         metode_parameter[i] = e.target.value
//                     }} />
//                 </div>
//                 <div>
//                     <h2 >Jurnal pendukung
//                     </h2>
//                     <input name="jurnal_pendukung" type="file" onChange={(e) => {
//                         e.preventDefault()
//                         jurnal_pendukung[i] = e.target.value
//                     }} />
//                 </div>
//                 <div>
//                     <h2 >Keterangan
//                     </h2>
//                     <input name="keterangan" type="text" onChange={(e) => {
//                         e.preventDefault()
//                         keterangan[i] = e.target.value
//                     }} />
//                 </div>

//             </>
//         )
//     }

//     return (
//         <>
//             <div>
//                 <button onClick={() =>{ console.log(jenis_pengujian); console.log(nama_sample)}}>asd</button>
//                 <h1>Order analisis</h1>
//                 <form onSubmit={handleSubmit}>
//                     {

//                         (() => {
//                             let rows = []
//                             for (let i = 0; i < countForm; i++) {
//                                 rows.push(<CustomForm i={i} key={i} />)
//                             }
//                             return rows
//                         })(

//                         )
//                     }
//                     <div>
//                         <input type="radio" id="verifikasi" name="verifikasi" value={true} required onClick={(e) => setVerifikasi(e.target.value)} />
//                         <h2 htmlFor="verifikasi">Saya telah memahami proses pengujian yang akan dilakukan dan memahami syarat dan ketentuan yang telah dijelaskan oleh staff/pengelola laboratorium
//                         </h2><br />
//                     </div>

//                     <button type="submit">Kirim</button>

//                 </form>
//                 <button onClick={increment}>+</button>
//             </div>
//         </>
//     )
// }




export default function order_analisis() {
    const [countForm, setCountForm] = useState(1);
    const [duplicate, setDuplicate] = useState([<CustomForm i={0} key={0} />]);
    // const [jenis_pengujian,setJenis_pengujian ] = useState([[]])
    const [jenis_pengujian, setJenis_pengujian] = useState([])
    // const jenis_pengujian = []

    const [nama_sample, setNama_sample] = useState([])
    const [jumlah_sample, setJumlah_sample] = useState([])
    const [wujud_sample, setWujud_sample] = useState([])
    const [pelarut, setPelarut] = useState([])
    const [preparasi_sample, setPreparasi_sample] = useState([])
    const [target_senyawa, setTarget_senyawa] = useState([])
    const [metode_parameter, setMetode_parameter] = useState([])
    const [jurnal_pendukung, setJurnal_pendukung] = useState([])
    const [keterangan, setKeterangan] = useState([])
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



    const increment = (e) => {
        setCountForm(a => a + 1)
        console.log(nama_sample)
        console.log(jenis_pengujian)
        e.preventDefault()
        setDuplicate([...duplicate, <CustomForm i={countForm} key={duplicate.length} />])
        // let add = jenis_pengujian
        // add.push([])
        // setJenis_pengujian([...add])
    }

    const handleSubmit = () => {

    }

    function CustomForm({ i }) {
        return (
            <>
            <div className=" border-2 rounded-lg mx-20">
            <p className='text-xl font-semibold text-xl text-white bg-red-600 rounded-lg p-3'>{++i}</p>
                <div className='px-10 py-5'>
                
                <div>

                    <h2 className="text-lg font-semibold">Jenis pengujian</h2>
                    {

                        kode.map((a, b) => {
                            
                            return (
                                <div key={b}>
                                    <input type="radio" id={`preparasi_sample${i}${b}`} onChange={(e) => {
                                        e.preventDefault()
                                jenis_pengujian[i] = e.target.value
                                    }} value={a.jenis_alat} />
                                    
                                    <label htmlFor={`preparasi_sample${i}${b}`}>{a.jenis_alat}</label>
                                    {/* <input type="checkbox" id={`jenis_alat${b}${i}`} name={`jenis_alat${b}${i}`} value={a.jenis_alat} onChange={(e) => {
                                        const {checked,value} = e.target
                                        if(checked){
                                            let copya = jenis_pengujian
                                            let copya2 = copya[i]
                                            copya2.push(value)
                                            copya[i] = copya2
                                            setJenis_pengujian(copya)
                                        }else{
                                            let copy = jenis_pengujian
                                            let copy2 = copy[i]
                                            if(copy2?.includes(value)){
                                                let index = copy2.indexOf(value)
                                                copy2.splice(index,1)
                                                copy[i] = copy2
                                                setJenis_pengujian([...copy])
                                            }else{
                                                return false
                                            }

                                            
                                        }
                                    }} /> */}
                                    

                                </div>



                            )
                        })
                    }



                </div>
                <div>
                    <h2 className="text-lg font-semibold" >Nama sample</h2>
                    <input name="nama_sample" required type="text" onChange={(e) => {
                        setNama_sample([...nama_sample, e.target.value])

                    }} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold" >Jumlah sample</h2>
                    <input name="jumlah_sample" required type="number" onChange={(e) => {
                        setJumlah_sample([...jumlah_sample, e.target.value])
                    }} />
                </div>
                <div>
                    <p className="text-lg font-semibold">Wujud sample</p>
                    
                    <input type="radio" id="wujud_sample1" name="wujud_sample" onChange={(e) => {
                        setWujud_sample([...wujud_sample, e.target.value])
                    }} value="padat" />
                    <label htmlFor="wujud_sample1">Padat</label>
                    <br />
                    
                    <input type="radio" id="wujud_sample2" name="wujud_sample" onChange={(e) => {
                        e.preventDefault()
                        wujud_sample[i] = e.target.value
                    }} value="cair" />
                    <label htmlFor="wujud_sample2">Cair</label>
                    <br />
                    
                    <input type="radio" id="wujud_sample3" name="wujud_sample" onChange={(e) => {
                        e.preventDefault()
                        wujud_sample[i] = e.target.value
                    }} value="gas" />
                    <label htmlFor="wujud_sample3">Gas</label>

                </div>
                <div>
                    <h2 className="text-lg font-semibold" >Pelarut</h2>
                    <input name="pelarut" required type="text" onChange={(e) => {
                        e.preventDefault()
                        pelarut[i] = e.target.value
                    }} />
                </div>
                <div>
                    <p className="text-lg font-semibold">Wujud sample</p>
                    <div className='flex'>
                    <input type="radio" name="preparasi_sample" onChange={(e) => {
                        e.preventDefault()
                        preparasi_sample[i] = e.target.value
                    }} value={true} />
                    <h2 className="" htmlFor="preparasi_sample">Ya (esterifikasi/destruksi)</h2>
                    </div>
                    <br />
                    <div className='flex'>
                    <input type="radio" name="preparasi_sample" onChange={(e) => {
                        e.preventDefault()
                        preparasi_sample[i] = e.target.value
                    }} value={false} />
                    <h2 className="" htmlFor="preparasi_sample">Tidak</h2>
                    </div>
                    <br />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Target senyawa/logam yang di cari
                    </h2>
                    <input name="target_senyawa" required type="text" onChange={(e) => {
                        e.preventDefault()
                        target_senyawa[i] = e.target.value
                    }} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold" >Metode Parameter (Suhu/flow/panjang gelombang/fasa gerak, gas, dsb)
                    </h2>
                    <input name="metode_parameter" required type="text" onChange={(e) => {
                        e.preventDefault()
                        metode_parameter[i] = e.target.value
                    }} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold" >Jurnal pendukung
                    </h2>
                    <input name="jurnal_pendukung" type="file" onChange={(e) => {
                        e.preventDefault()
                        jurnal_pendukung[i] = e.target.value
                    }} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold" >Keterangan
                    </h2>
                    <input name="keterangan" type="text" onChange={(e) => {
                        e.preventDefault()
                        keterangan[i] = e.target.value
                    }} />
                </div>
                </div>
            </div>
            </>
        )
    }

    return (
        <>
            <div>
                {/* <button onClick={() => { console.log(jenis_pengujian); console.log(nama_sample) }}>asd</button> */}
                <p className='text-center text-4xl font-bold text-gray-800 mt-7'>ORDER ANALISIS</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>
                <form onSubmit={handleSubmit}>
                    {duplicate}
                    <br/>
                    <div className='flex mx-20'>
                        <input type="radio" id="verifikasi" name="verifikasi" value={true} required onClick={(e) => setVerifikasi(e.target.value)} />
                        <h2 htmlFor="verifikasi">Saya telah memahami proses pengujian yang akan dilakukan dan memahami syarat dan ketentuan yang telah dijelaskan oleh staff/pengelola laboratorium
                        </h2><br />
                        
                    </div>
                    <br/>
                    
                  
                </form>
                <div className='grid grid-cols-1 justify-items-center'>
                <button onClick={increment} className='bg-blue-800 p-3 text-white rounded-lg'>Tambah order</button>   
                    <br/>
                    <br/>   
                    <button type="submit"  className='bg-blue-800 p-3 text-white rounded-lg'>Kirim</button>
                </div>
                
                
            </div>
        </>
    )
}