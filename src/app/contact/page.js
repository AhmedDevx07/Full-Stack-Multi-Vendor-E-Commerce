"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [ticket, setTicket] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSendTicket = async (e) => {
    e.preventDefault();
    setSending(true);

    // Simulating message routing pipeline drop
    setTimeout(() => {
      toast.success("Comms relay logged!", {
        description: "Support response coordinates generated.",
      });
      setTicket({ name: "", email: "", message: "" });
      setSending(false);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans min-h-screen bg-gray-50/30 mt-6 antialiased">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        
        {/* LEFT COMPONENT: DIRECT INSTRUCTIONS */}
        <div className="space-y-4 md:col-span-1">
          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Comms Relay Hub
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-2">
            Connect Vector Coordinates
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            Drop operational feedback parameters or systemic integration inquiries directly inside our central mail queues.
          </p>
          <div className="pt-4 space-y-2 text-xs font-bold text-gray-600">
            <p>🛰️ Core Terminal: <span className="text-gray-900">Karachi Node</span></p>
            <p>📧 Secure Endpoint: <span className="text-indigo-600">matrix@devx.io</span></p>
          </div>
        </div>

        {/* RIGHT COMPONENT: MESSAGE FORM MATRIX */}
        <form onSubmit={handleSendTicket} className="md:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Identity Tag</label>
              <input 
                type="text" placeholder="Full Name" required
                value={ticket.name} onChange={e => setTicket({...ticket, name: e.target.value})}
                className="w-full text-xs font-semibold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Return Mail Path</label>
              <input 
                type="email" placeholder="name@domain.com" required
                value={ticket.email} onChange={e => setTicket({...ticket, email: e.target.value})}
                className="w-full text-xs font-semibold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Payload Message Core</label>
            <textarea 
              rows="4" placeholder="Type transmission specifications here..." required
              value={ticket.message} onChange={e => setTicket({...ticket, message: e.target.value})}
              className="w-full text-xs font-semibold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white transition resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" disabled={sending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-2xl transition shadow-sm tracking-wide"
          >
            {sending ? "Routing Message Signal..." : "Broadcast Packet Transmission ➔"}
          </button>
        </form>

      </div>
    </div>
  );
}