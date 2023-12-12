import Link from "next/link";

export default function AdminInvoiceCard({list_sample,invoice,tanggal,index}) {

    return (
        <>
            <div>

                <div className='w-full h-24 bg-slate-100 border-1 flex'>
                    <span className='px-10 py-3'>{index}</span>
                    <span className='px-10 py-3'>{invoice}</span>
                    <span className='px-10 py-3'>{tanggal}</span>
                    <span>
                        <p>1. {list_sample[0]}</p>
                        {list_sample[1]&& <p>2. {list_sample[1]}</p>}      
                        <p>...</p>
                    </span>
                    <span>
                        <Link href={`/admin/dashboard/order/${invoice}`} className="bg-blue-200">detail order</Link>
                    </span>
                </div>


            </div>
        </>
    )
}