"use client";

const convertRupiah = (angka = 0) => {
  const parts = angka?.toString().split('').reverse().join('').match(/\d{1,3}/g);
  return parts?.join('.').split('').reverse().join('') ?? '0';
};

// ── Template ini dirender tersembunyi di DOM (lihat penggunaan di AffiliateOrder.jsx),
// lalu di-capture jadi PDF via html2canvas + jsPDF. Data sudah dihitung on-the-fly oleh
// BE (get_kwitansi_order_affiliate), tidak ada file yang disimpan di server.
export default function KwitansiTemplate({ data, printId }) {
  return (
    <div
      id={printId}
      style={{
        width: '700px',
        padding: '40px',
        background: '#fff',
        color: '#111',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '14px',
        border: '2px solid #000',
      }}
    >
      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>KWITANSI</h1>
        <p style={{ margin: '4px 0 0', fontSize: '12px' }}>{data.nama_laboratorium}</p>
        <p style={{ margin: '2px 0 0', fontSize: '12px' }}>No. {data.no_kwitansi}</p>
      </div>

      <table style={{ width: '100%', fontSize: '13px' }}>
        <tbody>
          <tr>
            <td style={{ width: '160px', padding: '6px 0', verticalAlign: 'top' }}>Telah terima dari</td>
            <td style={{ width: '10px', verticalAlign: 'top' }}>:</td>
            <td style={{ padding: '6px 0', fontWeight: 'bold' }}>{data.telah_terima}</td>
          </tr>
          <tr>
            <td style={{ padding: '6px 0', verticalAlign: 'top' }}>Uang sejumlah</td>
            <td style={{ verticalAlign: 'top' }}>:</td>
            <td style={{ padding: '6px 0', fontStyle: 'italic' }}>{data.uang_sejumlah_terbilang}</td>
          </tr>
          <tr>
            <td style={{ padding: '6px 0', verticalAlign: 'top' }}>Untuk pembayaran</td>
            <td style={{ verticalAlign: 'top' }}>:</td>
            <td style={{ padding: '6px 0' }}>{data.untuk_pembayaran}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1.5px solid #000', borderRadius: '6px', padding: '8px 20px' }}>
          <span style={{ fontSize: '11px', color: '#555', marginRight: '10px' }}>Rp</span>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{convertRupiah(data.uang_sejumlah_angka)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', fontSize: '13px' }}>
        <div style={{ textAlign: 'center', width: '220px' }}>
          <p style={{ margin: 0 }}>{data.kota}, {data.tanggal}</p>
          <p style={{ margin: '2px 0 0' }}>Penerima Kas</p>
          <div style={{ height: '56px' }} />
          <p style={{ margin: 0, borderTop: '1px solid #333', paddingTop: '4px' }}>( ................................. )</p>
        </div>
      </div>
    </div>
  );
}