"use client";

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

// ── Teks kop surat institusi utama (Laboratorium Kimia Instrumen UPI) — tampil tetap di semua invoice
// terlepas dari lab affiliate mana yang diorder; hanya baris "INVOICE PELAYANAN ANALISIS ..."
// di bawahnya yang dinamis mengikuti lab.nama_laboratorium ──
const LAB_UTAMA_NAMA = 'LABORATORIUM KIMIA INSTRUMEN';
const LAB_UTAMA_INSTANSI = 'UNIVERSITAS PENDIDIKAN INDONESIA';
const LAB_UTAMA_ALAMAT = 'Gedung JICA (FPMIPA-A) Lt. 5. Jl. Setiabudhi No.229 Bandung – 40154.';

// Font kop surat & watermark — dipasang langsung di tiap elemen supaya tidak tertimpa CSS global
const FONT_TIMES = "'Times New Roman', Times, 'Liberation Serif', serif";

// Teks watermark di latar belakang invoice
const WATERMARK_TEXT = 'BUKAN BUKTI PEMBAYARAN';

// Tinggi minimum invoice = tinggi kertas A4 pada lebar 900px (900 x 297/210 ≈ 1273px).
// Dibuat sedikit di bawah 1273 supaya hasil capture tidak melebihi 1 halaman PDF.
// Dengan ini watermark (top: 50%) berada tepat di tengah-tengah kertas, bukan di tengah isi.
const A4_MIN_HEIGHT = '1270px';

// ── Template ini dirender tersembunyi di DOM (lihat penggunaan di AffiliateOrder.jsx),
// lalu di-capture jadi PDF via html2canvas + jsPDF. Tidak ada file yang disimpan di server.
//
// ⚠️ PENTING: sengaja pakai <img> biasa, BUKAN next/image. Komponen ini dirender di luar
// viewport (position: fixed; left: -9999px) supaya bisa di-capture html2canvas tanpa
// terlihat user. next/image lazy-load gambar berdasarkan visibility (IntersectionObserver),
// jadi kalau elemen tidak pernah masuk viewport, gambar logo TIDAK PERNAH dimuat sama
// sekali. <img> biasa memuat langsung tanpa syarat visibility.
export default function InvoiceTemplate({ order, printId }) {
  const lab = order.id_affiliate || {};
  const rows = order.rincian_harga_invoice || [];
  const total = rows.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const tahun = new Date(order.date).getFullYear();

  return (
    <div
      id={printId}
      style={{
        position: 'relative',
        zIndex: 0,
        boxSizing: 'border-box',
        width: '900px',
        minHeight: A4_MIN_HEIGHT,
        padding: '32px',
        background: '#fff',
        color: '#111',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '13px',
      }}
    >
      {/* Watermark latar belakang — dipusatkan secara vertikal terhadap seluruh kertas (root punya minHeight A4)
          dan z-index -1 di dalam stacking context root, jadi tampil di belakang semua teks & tabel. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: -1,
          textAlign: 'center',
          fontFamily: FONT_TIMES,
          fontSize: '48px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          color: 'rgba(0, 0, 0, 0.12)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {WATERMARK_TEXT}
      </div>

      {/* Kop Surat: logo di kiri, teks institusi rata kiri di sebelahnya (3 baris, Times New Roman),
          ditutup garis ganda (tebal+tipis) khas letterhead resmi. */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="/logo/image.png"
            alt="Logo Laboratorium Kimia Instrumen UPI"
            crossOrigin="anonymous"
            style={{ height: '64px', width: '170px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ flex: 1, textAlign: 'left', fontFamily: FONT_TIMES }}>
            <h1 style={{ margin: 0, fontFamily: FONT_TIMES, fontSize: '22px', fontWeight: 'bold', lineHeight: 1.15 }}>
              {LAB_UTAMA_NAMA}
            </h1>
            <h1 style={{ margin: 0, fontFamily: FONT_TIMES, fontSize: '22px', fontWeight: 'bold', lineHeight: 1.15 }}>
              {LAB_UTAMA_INSTANSI}
            </h1>
            <p style={{ margin: '3px 0 0', fontFamily: FONT_TIMES, fontSize: '13px' }}>{LAB_UTAMA_ALAMAT}</p>
          </div>
        </div>
        {/* Garis kop surat ganda: tebal lalu tipis, jarak rapat */}
        <div style={{ borderBottom: '3px solid #000', marginTop: '10px' }} />
        <div style={{ borderBottom: '1px solid #000', marginTop: '2px' }} />
      </div>

      {/* Judul invoice — nama lab affiliate & no. invoice tetap dinamis mengikuti order */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
          <tr style={{ background: '#d1d5db' }}>
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
          <p style={{ margin: '2px 0 0' }}></p>

          {/* TTD + Nama menggunakan image */}
          <div
            style={{
              height: '56px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src="/logo/ttd/image.png"
              alt="Tanda tangan dan nama Penerima Kas"
              crossOrigin="anonymous"
              style={{
                width: '190px',
                height: '56px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}