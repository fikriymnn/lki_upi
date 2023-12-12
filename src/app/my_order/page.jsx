"use client"
import InvoiceCard from "@/components/InvoiceCard"
export default function My_order(){
    return(
        <>
        <div>
            <p>my order</p>
            <div>
                <InvoiceCard list_sample={["asa","bbd"]} invoice={"12asndaj23"} tanggal={"17 agustus"} index={1}/>
                <InvoiceCard list_sample={["asa","tt ","aaks"]} invoice={"1se2asndaj2e3"} tanggal={"20 agustus"} index={2}/>

            </div>
        </div>
        </>
    )
}