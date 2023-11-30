import { useState } from "react"

export default function tracking({ params }) {
    const { id } = params
    const [invoice, setInvoice] = useState({ status: "" })
    return (
        <>
            <div>
                <p>tracking</p>
                <div>
                    <div>
                        {invoice.status == "menunggu form dikonfirmasi" ? <div><p className="text-blue-200">form dikirim</p></div> : <div><p className="">form dikirim</p></div>}
                        {invoice.status == "menunggu form dikonfirmasi" ? <div><p className="">menunggu acc</p></div> : <div><p className="">menunggu acc</p></div>}
                        {invoice.status == "form dikonfirmasi" ? <div><p className="text-blue-200">form diterima</p></div> : <div><p className="">form diterima</p></div>}
                        {invoice.status == "form dikonfirmasi" ? <div><p className="">menunggu sample diterima oleh admin</p></div> : <div><p className="">menunggu sample diterima oleh admin</p></div>}
                        {invoice.status == "sample diterima admin" ? <div><p className="text-blue-200">sample diterima oleh admin</p></div> : <div><p className="">sample diterima oleh admin</p></div>}
                        {invoice.status == "sample diterima admin" ? <div><p className="">menunggu sample diterima oleh operator</p></div> : <div><p className="">sedang dikerjakan oleh operator</p></div>}
                        {invoice.status == "sample dikerjakan operator" ? <div><p className="text-blue-200">sample diterima oleh operator</p></div> : <div><p className="">sample diterima oleh operator </p></div>}
                        {invoice.status == "sample dikerjakan operator" ? <div><p className="">sedang dikerjakan oleh operator</p></div> : <div><p className="">sedang dikerjakan oleh operator</p></div>}
                        {invoice.status == "menunggu pembayaran" ? <div><p className="text-blue-200">selesai dikerjakan oleh operator</p></div> : <div><p className="">selesai dikerjakan oleh operator </p></div>}
                        {invoice.status == "menunggu pembayaran" ? <div><p className="">menunggu pembayaran</p></div> : <div><p className="">menunggu pembayaran</p></div>}
                        {invoice.status == "pembayaran selesai" ? <div><p className="text-blue-200">pembayaran selesai</p></div> : <div><p className="">pembayaran selesai</p></div>}
                        {invoice.status == "pembayaran selesai" ? <div><p className="">menunggu pembayaran dikonfirmasi</p></div> : <div><p className="">menunggu pembayaran dikonfirmasi</p></div>}
                        {invoice.status == "selesai" ? <div><p className="text-blue-200">selesai</p></div> : <div><p className="">selesai</p></div>}
                    </div>
                </div>
            </div>
        </>
    )
}

