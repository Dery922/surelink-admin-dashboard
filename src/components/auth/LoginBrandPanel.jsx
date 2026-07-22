export default function LoginBrandPanel() {
  return (
    <div className="hidden md:flex md:w-[42%] bg-gradient-to-br from-[#0057FF] to-blue-600 flex-col items-center justify-center p-10 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-white/[0.03] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
        <img src="/Logo.png" alt="SureLink" className="h-20 w-auto mb-6 drop-shadow-lg" />

        <h1 className="text-2xl font-bold mb-1 tracking-tight">SureLink</h1>
        <p className="text-blue-100 text-sm font-medium mb-8">Admin Portal</p>

        <div className="space-y-3 text-left w-full">
          {[
            { icon: 'fa-solid fa-lock', text: 'Secure role-based access control' },
            { icon: 'fa-solid fa-eye', text: 'Real-time operations visibility' },
            { icon: 'fa-solid fa-chart-line', text: 'Provider management at scale' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <i className={`${icon} text-xs`} />
              </div>
              <span className="text-blue-100 text-xs font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 mt-auto text-blue-200/50 text-[11px]">
        © {new Date().getFullYear()} SureLink. All rights reserved.
      </p>
    </div>
  );
}
