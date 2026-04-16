"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronLeft, CheckCircle, Circle, Clock,
  FileText, User, Calendar, AlertCircle,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    "Selesai": "bg-green-100 text-green-700",
    "Menunggu Pembayaran": "bg-amber-100 text-amber-700",
    "Menunggu Konfirmasi Pembayaran": "bg-amber-100 text-amber-700",
    "Order Dibatalkan": "bg-red-100 text-red-600",
    "Form Dikonfirmasi": "bg-blue-100 text-blue-700",
    "Sample Diterima Admin": "bg-blue-100 text-blue-700",
    "Sample Dikerjakan Operator": "bg-purple-100 text-purple-700",
    "Menunggu Verifikasi": "bg-orange-100 text-orange-700",
    "Menunggu Form Dikonfirmasi": "bg-gray-100 text-gray-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

// ── Sub-components ─────────────────────────────────────────
const InfoCard = ({ icon: Icon, label, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4">
    <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" /> {label}
    </p>
    <div className="text-sm font-semibold text-gray-800">{children}</div>
  </div>
);

// ── Main Component ─────────────────────────────────────────
export default function OrderTracking({ setActivePage, idInvoice }) {
  const id = idInvoice;
  const [invoice, setInvoice] = useState({});

  // ── Fetch ────────────────────────────────────────────────
  useEffect(() => {
    async function getInvoice() {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          { withCredentials: true }
        );
        if (data.data.success) setInvoice(data.data.data);
      } catch (err) {
        console.log(err.message);
      }
    }
    getInvoice();
  }, []);

  // ── Timeline steps ────────────────────────────────────────
  const steps = [
    {
      label: "Form Dikirim",
      sub: "Menunggu Konfirmasi Admin",
      date: invoice.s1_date,
      activeOn: [
        "Menunggu Form Dikonfirmasi", "Form Dikonfirmasi", "Sample Diterima Admin",
        "Sample Dikerjakan Operator", "Menunggu Verifikasi", "Menunggu Pembayaran",
        "Menunggu Konfirmasi Pembayaran", "Selesai", "Order Dibatalkan",
      ],
    },
    {
      label: "Form Dikonfirmasi",
      sub: "Menunggu Sample Diterima oleh Admin",
      date: invoice.s2_date,
      activeOn: [
        "Form Dikonfirmasi", "Sample Diterima Admin", "Sample Dikerjakan Operator",
        "Menunggu Verifikasi", "Menunggu Pembayaran", "Menunggu Konfirmasi Pembayaran",
        "Selesai", "Order Dibatalkan",
      ],
    },
    {
      label: "Sample Diterima Admin",
      sub: "Sample Sedang Dikirim ke Operator",
      date: invoice.s3_date,
      activeOn: [
        "Sample Diterima Admin", "Sample Dikerjakan Operator", "Menunggu Verifikasi",
        "Menunggu Pembayaran", "Menunggu Konfirmasi Pembayaran", "Selesai", "Order Dibatalkan",
      ],
    },
    {
      label: "Sample Diterima Operator",
      sub: "Sedang Dikerjakan oleh Operator",
      date: invoice.s4_date,
      activeOn: [
        "Sample Dikerjakan Operator", "Menunggu Verifikasi", "Menunggu Pembayaran",
        "Menunggu Konfirmasi Pembayaran", "Selesai", "Order Dibatalkan",
      ],
    },
    {
      label: "Selesai Dikerjakan Operator",
      sub: "Menunggu Verifikasi",
      date: invoice.s5_date,
      activeOn: [
        "Menunggu Verifikasi", "Menunggu Pembayaran",
        "Menunggu Konfirmasi Pembayaran", "Selesai", "Order Dibatalkan",
      ],
    },
    {
      label: "Selesai Verifikasi",
      sub: "Menunggu Pembayaran",
      date: invoice.s6_date,
      activeOn: ["Menunggu Pembayaran", "Menunggu Konfirmasi Pembayaran", "Selesai"],
    },
    {
      label: "Pembayaran Diterima",
      sub: "Menunggu Konfirmasi Pembayaran",
      date: invoice.s7_date,
      activeOn: ["Menunggu Konfirmasi Pembayaran", "Selesai"],
    },
    {
      label: "Selesai",
      sub: invoice.status === "Order Dibatalkan" ? "Order Dibatalkan" : "Order telah selesai",
      date: invoice.s8_date,
      activeOn: ["Selesai"],
      cancelOn: ["Order Dibatalkan"],
    },
  ];

  const isCancelled = invoice.status === "Order Dibatalkan";

  const getStepState = (step) => {
    if (step.cancelOn?.includes(invoice.status)) return "cancelled";
    if (step.activeOn?.includes(invoice.status)) return "done";
    return "pending";
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setActivePage("order")}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress Order</h1>
            <p className="text-sm text-gray-500 mt-0.5">Riwayat dan status pengerjaan order</p>
          </div>
        </div>

        {/* ── Info Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <InfoCard icon={FileText} label="No. Invoice">
            <span className="font-mono">{invoice?.no_invoice || "—"}</span>
          </InfoCard>
          <InfoCard icon={User} label="Pelanggan">
            {invoice?.nama_lengkap || "—"}
          </InfoCard>
          <InfoCard icon={Calendar} label="Status Saat Ini">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge(invoice?.status)}`}>
              {invoice?.status || "—"}
            </span>
          </InfoCard>
        </div>

        {/* ── Cancelled Banner ── */}
        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Order Dibatalkan</p>
              <p className="text-xs text-red-500 mt-0.5">{invoice.s8_date || ""}</p>
            </div>
          </div>
        )}

        {/* ── Timeline (read-only) ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
            Riwayat Progress
          </p>
          <div className="flex flex-col">
            {steps.map((step, i) => {
              const state = getStepState(step);
              const isLast = i === steps.length - 1;
              return (
                <div key={i} className="flex gap-4">
                  {/* Icon & connector */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      state === "done"      ? "bg-red-600 text-white"
                      : state === "cancelled" ? "bg-red-100 text-red-500"
                      : "bg-gray-100 text-gray-400"
                    }`}>
                      {state === "done"      ? <CheckCircle className="w-4 h-4" />
                        : state === "cancelled" ? <AlertCircle className="w-4 h-4" />
                        : <Circle className="w-4 h-4" />}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 my-1 ${state === "done" ? "bg-red-200" : "bg-gray-100"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-semibold ${
                          state === "done"       ? "text-gray-900"
                          : state === "cancelled"  ? "text-red-600"
                          : "text-gray-400"
                        }`}>
                          {step.label}
                        </p>
                        <p className={`text-xs mt-0.5 ${
                          state === "done"       ? "text-gray-500"
                          : state === "cancelled"  ? "text-red-400"
                          : "text-gray-300"
                        }`}>
                          {step.sub}
                        </p>
                      </div>
                      {step.date && (
                        <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0 mt-0.5 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {step.date}
                        </span>
                      )}
                    </div>

                    {/* Active indicator */}
                    {invoice.status === step.activeOn?.[0] && !isCancelled && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-100 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-red-600 font-medium">Status saat ini</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}