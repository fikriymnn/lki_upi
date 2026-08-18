"use client";

import Image from 'next/image';

const convertRupiah = (angka = 0) => {
  const parts = angka?.toString().split('').reverse().join('').match(/\d{1,3}/g);
  return parts?.join('.').split('').reverse().join('') ?? '0';
};

const formatTanggalPanjang = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return d;
  }
};

const formatTanggalPendek = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' });
  } catch {
    return d;
  }
};

// ── Template ini dirender tersembunyi di DOM (lihat penggunaan di AffiliateOrder.jsx),
// lalu di-capture jadi PDF via html2canvas + jsPDF. Tidak ada file yang disimpan di server.
export default function InvoiceTemplate({ order, printId }) {
  const lab = order.id_affiliate || {};
  const rows = order.rincian_harga_invoice || [];
  const total = rows.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const tahun = new Date(order.date).getFullYear();

  return (
    <div
      id={printId}
      style={{
        width: '900px',
        padding: '32px',
        background: '#fff',
        color: '#111',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '13px',
      }}
    >
      {/* Header dengan Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ width: '60px', height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src="/images/logo/image.png"
            alt="Logo Laboratorium"
            width={56}
            height={56}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            {(lab.nama_laboratorium || 'LABORATORIUM').toUpperCase()}
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '12px' }}>{lab.alamat || '-'}</p>
        </div>
      </div>

      {/* Judul invoice */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px' }}>
          INVOICE PELAYANAN ANALISIS {(lab.nama_laboratorium || '').toUpperCase()}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '13px' }}>No. {order.no_invoice}</p>
      </div>

      {/* Info pemohon */}
      <table style={{ marginBottom: '16px', fontSize: '13px' }}>
        <tbody>
          <tr>
            <td style={{ width: '110px', padding: '2px 0' }}>Tanggal</td>
            <td style={{ width: '10px' }}>:</td>
            <td>{formatTanggalPanjang(order.date)}</td>
          </tr>
          <tr>
            <td style={{ padding: '2px 0' }}>Kepada</td>
            <td>:</td>
            <td>{order.nama_lengkap} dkk</td>
          </tr>
          <tr>
            <td style={{ padding: '2px 0' }}>Asal Instansi</td>
            <td>:</td>
            <td>{order.nama_institusi || '-'}</td>
          </tr>
          <tr>
            <td style={{ padding: '2px 0' }}>Alamat</td>
            <td>:</td>
            <td>{order.alamat_institusi || '-'}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabel rincian */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            {['No', 'Tanggal', 'Deskripsi', 'Keterangan', 'Jumlah', 'Satuan', 'Harga Satuan', 'Total'].map((h) => (
              <th key={h} style={{ border: '1px solid #333', padding: '5px 6px', textAlign: h === 'Jumlah' || h === 'Harga Satuan' || h === 'Total' ? 'right' : 'left' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r._id || idx}>
              <td style={{ border: '1px solid #333', padding: '4px 6px' }}>{idx + 1}</td>
              <td style={{ border: '1px solid #333', padding: '4px 6px' }}>{formatTanggalPendek(r.tanggal)}</td>
              <td style={{ border: '1px solid #333', padding: '4px 6px' }}>{r.deskripsi}</td>
              <td style={{ border: '1px solid #333', padding: '4px 6px' }}>{r.keterangan || ''}</td>
              <td style={{ border: '1px solid #333', padding: '4px 6px', textAlign: 'right' }}>{r.jumlah}</td>
              <td style={{ border: '1px solid #333', padding: '4px 6px' }}>{r.satuan}</td>
              <td style={{ border: '1px solid #333', padding: '4px 6px', textAlign: 'right' }}>Rp {convertRupiah(r.harga_satuan)}</td>
              <td style={{ border: '1px solid #333', padding: '4px 6px', textAlign: 'right' }}>Rp {convertRupiah(r.total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7} style={{ border: '1px solid #333', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
              TOTAL KESELURUHAN
            </td>
            <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
              Rp {convertRupiah(total)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Footer tanda tangan */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', fontSize: '13px' }}>
        <div style={{ textAlign: 'center', width: '220px' }}>
          <p style={{ margin: 0 }}>Bandung, {tahun}</p>
          <p style={{ margin: '2px 0 0' }}>Penerima Kas</p>
          <div style={{ height: '56px' }} />
          <p style={{ margin: 0, borderTop: '1px solid #333', paddingTop: '4px' }}>( ................................. )</p>
        </div>
      </div>
    </div>
  );
}