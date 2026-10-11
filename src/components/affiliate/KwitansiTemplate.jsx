"use client";

const convertRupiah = (angka = 0) => {
  const number = Number(angka) || 0;

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(number);
};

// ─────────────────────────────────────────────────────────────
// KWITANSI TEMPLATE
//
// Paper:
// A5 Landscape
// 210 × 148 mm
//
// Design canvas:
// 1120 × 790 px
//
// Background watermark:
// /logo/image.png
//
// Signature:
// /logo/kuitansi/image.png
// ─────────────────────────────────────────────────────────────
export default function KwitansiTemplate({ data, printId }) {
  return (
    <div
      id={printId}
      style={{
        width: "1120px",
        height: "790px",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        color: "#111111",
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          WATERMARK BACKGROUND
          
          Image diulang / repeat sampai memenuhi seluruh
          halaman kuitansi.
          Ukuran tile = lebar kertas / 9 sehingga pas
          memenuhi seluruh lebar tanpa terpotong.
      ====================================================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('/logo/kuitansi/image.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "calc(100% / 9) auto",
          backgroundPosition: "0 0",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          padding: "28px 38px",
        }}
      >
        {/* =================================================
            MAIN CONTENT
        ================================================== */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* =================================================
              LEFT VERTICAL BOX
              (tinggi disesuaikan agar sejajar garis merah)
          ================================================== */}
          <div
            style={{
              width: "145px",
              minWidth: "145px",
              height: "510px",
              border: "2px solid #222",
              boxSizing: "border-box",
            }}
          />

          {/* =================================================
              RIGHT CONTENT
          ================================================== */}
          <div
            style={{
              flex: 1,
              paddingLeft: "18px",
              boxSizing: "border-box",
              position: "relative",
              height: "100%",
            }}
          >
            {/* ===============================================
                HEADER
            ================================================ */}
            <div
              style={{
                position: "relative",
                height: "78px",
                boxSizing: "border-box",
              }}
            >
              {/* NOMOR */}
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  top: "14px",
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                <span>No.</span>

                <span
                  style={{
                    marginLeft: "14px",
                    borderBottom: "1px solid #333",
                    paddingBottom: "3px",
                    display: "inline-block",
                    minWidth: "220px",
                  }}
                >
                  {data.no_kwitansi}
                </span>
              </div>

              {/* TITLE */}
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  paddingTop: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "29px",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    lineHeight: "1",
                  }}
                >
                  KWITANSI
                </div>
              </div>
            </div>

            {/* ===============================================
                TRANSACTION INFORMATION
            ================================================ */}
            <div
              style={{
                width: "100%",
                marginTop: "5px",
              }}
            >
              {/* TELAH TERIMA */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  minHeight: "45px",
                }}
              >
                <div
                  style={{
                    width: "185px",
                    flexShrink: 0,
                    fontSize: "17px",
                  }}
                >
                  Telah terima
                </div>

                <div
                  style={{
                    width: "18px",
                    flexShrink: 0,
                    fontSize: "17px",
                  }}
                >
                  :
                </div>

                <div
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #444",
                    minHeight: "27px",
                    padding: "0 10px 5px",
                    fontSize: "17px",
                    boxSizing: "border-box",
                  }}
                >
                  {data.telah_terima}
                </div>
              </div>

              {/* UANG SEJUMLAH */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  minHeight: "45px",
                }}
              >
                <div
                  style={{
                    width: "185px",
                    flexShrink: 0,
                    fontSize: "17px",
                  }}
                >
                  Uang sejumlah
                </div>

                <div
                  style={{
                    width: "18px",
                    flexShrink: 0,
                    fontSize: "17px",
                  }}
                >
                  :
                </div>

                <div
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #444",
                    minHeight: "27px",
                    padding: "0 10px 5px",
                    fontSize: "17px",
                    boxSizing: "border-box",
                  }}
                >
                  {data.uang_sejumlah_terbilang}
                </div>
              </div>

              {/* UNTUK PEMBAYARAN */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  minHeight: "45px",
                }}
              >
                <div
                  style={{
                    width: "185px",
                    flexShrink: 0,
                    fontSize: "17px",
                  }}
                >
                  Untuk pembayaran
                </div>

                <div
                  style={{
                    width: "18px",
                    flexShrink: 0,
                    fontSize: "17px",
                  }}
                >
                  :
                </div>

                <div
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #444",
                    minHeight: "27px",
                    padding: "0 10px 5px",
                    fontSize: "17px",
                    boxSizing: "border-box",
                  }}
                >
                  {data.untuk_pembayaran}
                </div>
              </div>
            </div>

            {/* ===============================================
                EXTRA LINES
            ================================================ */}
            <div
              style={{
                marginTop: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  height: "27px",
                  borderBottom: "1px solid #444",
                  boxSizing: "border-box",
                }}
              />

              <div
                style={{
                  height: "27px",
                  borderBottom: "1px solid #444",
                  boxSizing: "border-box",
                }}
              />

              <div
                style={{
                  height: "27px",
                  borderBottom: "1px solid #444",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* =================================================
                FOOTER

                Footer sengaja ditempatkan di area tengah
                antara:
                
                1. Garis terakhir bagian pembayaran
                2. Batas bawah kuitansi

                Tidak menggunakan bottom: 0 sehingga tidak
                terlalu menempel ke bagian bawah.
            ================================================== */}
            <div
              style={{
                position: "absolute",

                // Posisi horizontal
                left: "18px",
                right: "0",

                // Posisi vertikal
                //
                // Nilai ini membuat footer berada di area
                // tengah kosong antara data pembayaran
                // dan batas bawah.
                top: "390px",

                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",

                boxSizing: "border-box",
              }}
            >
              {/* =============================================
                  NOMINAL
              ============================================== */}
              <div
                style={{
                  width: "470px",
                  height: "54px",
                  border: "1.5px solid #333",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "21px",
                }}
              >
                {/* RP */}
                <div
                  style={{
                    width: "95px",
                    paddingLeft: "18px",
                    fontWeight: "bold",
                    boxSizing: "border-box",
                  }}
                >
                  Rp.
                </div>

                {/* NOMINAL */}
                <div
                  style={{
                    flex: 1,
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    paddingLeft: "20px",
                  }}
                >
                  {convertRupiah(data.uang_sejumlah_angka)}
                </div>
              </div>

              {/* =============================================
                  DATE + SIGNATURE
              ============================================== */}
              <div
                style={{
                  width: "300px",
                  textAlign: "center",
                  fontSize: "16px",
                  marginRight: "20px",
                  marginTop: "-5px",
                }}
              >
                {/* DATE */}
                <div
                  style={{
                    whiteSpace: "nowrap",
                    marginBottom: "5px",
                  }}
                >
                  {data.kota}, {data.tanggal}
                </div>

                {/* DATE UNDERLINE */}
                <div
                  style={{
                    width: "250px",
                    margin: "0 auto",
                    borderBottom: "1px solid #333",
                  }}
                />

                {/* =========================================
                    SIGNATURE IMAGE

                    TTD + nama sudah terdapat di dalam
                    gambar /logo/kuitansi/image.png
                ========================================== */}
                <div
                  style={{
                    height: "92px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/logo/ttd/image.png"
                    alt="Tanda tangan"
                    style={{
                      width: "250px",
                      maxWidth: "250px",
                      maxHeight: "90px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}