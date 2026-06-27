export default function AboutPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto font-sans min-h-screen bg-gray-50/30 mt-6 antialiased">
      
      {/* SECTION HEADER */}
      <div className="mb-12 border-b border-gray-100 pb-5 text-center md:text-left">
        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
          System Core Spec
        </span>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-2">
          Architecture Manifesto
        </h1>
      </div>

      {/* BENTO BLOCK STRUCTURE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Pillar Block */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-3">
          <div className="text-xl">📡</div>
          <h2 className="text-md font-black text-gray-900 tracking-tight">The Decentralized Multi-Vendor Vision</h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Our marketplace architecture handles peer-to-peer transactional nodes seamlessly. Built on high-density performance stacks, we empower individual store mechanics to plug in their inventory grids and process trade aggregates instantly without middleware processing lag.
          </p>
        </div>

        {/* Dynamic Metric Grid Item */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-sm">
          <div className="text-xs font-bold tracking-widest uppercase opacity-70">Processing Yield</div>
          <div className="space-y-1">
            <div className="text-4xl font-black tracking-tight">99.9%</div>
            <p className="text-[10px] opacity-80 font-medium">Uptime telemetry response index maintained across global routing points.</p>
          </div>
        </div>

        {/* Core Metric Node 2 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-gray-50 p-3 rounded-2xl text-md">⚡</div>
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase">Sub-100ms Latency</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Dynamic query matching engine updates viewports in real-time.</p>
          </div>
        </div>

        {/* Core Metric Node 3 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-gray-50 p-3 rounded-2xl text-md">🔒</div>
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase">Cryptographic Layer</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Session isolation nodes guarantee credential payload safety blocks.</p>
          </div>
        </div>

        {/* Core Metric Node 4 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-gray-50 p-3 rounded-2xl text-md">📦</div>
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase">Automated Pipeline</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Direct integration parameters straight from verified terminal hubs.</p>
          </div>
        </div>

      </div>
    </div>
  );
}