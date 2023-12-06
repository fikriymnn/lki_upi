'use client'
import {useState} from 'react'
export default function JenisPengujian(){
    const [jenisPengujian,setJenisPengujian] = useState([{jenis_alat:"Frezer",kode:"AACH"},{jenis_alat:"Pemanas",kode:"AAGD"}])
    return(
        <>
        <h1>Jenis pengujian</h1>

        <form>
            <div>
                <p>Jenis alat :</p>
            <input type="text" name="jenis_alat"/>
            </div>
            <div>
                <p>Kode :</p>
            <input type="text" name="kode"/>
            </div>
            <button >kirim</button>
        </form>

        

        <table className='w-full text-left'>
            <tbody>
            <tr>
                <th>No.</th>
                <th>Jenis Alat</th>
                <th>Kode</th>
                <th>Delete</th>
            </tr>
    
                {jenisPengujian.map((e,i)=>{
                    return <tr>
                    <td>{++i}</td>
                    <td>{e.jenis_alat}</td>
                    <td>{e.kode}</td>
                    <td><button>delete</button></td>
                </tr>
                })}
            </tbody>
            
    
        </table>
        </>
    )
}