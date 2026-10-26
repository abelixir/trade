import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold">
            <span className="text-emerald-400">Trade</span>Journal
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white transition">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full mb-6 border border-emerald-500/20">
          Built for serious traders
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
          Journal your trades.<br />
          <span className="text-emerald-400">Master your edge.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          The professional trading journal that helps you track performance,
          understand your psychology, and follow a clear path to improvement.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-3.5 rounded-xl font-medium transition shadow-lg shadow-emerald-500/20"
          >
            Start Journaling Free
          </Link>
          <Link
            to="/roadmap"
            className="bg-slate-800 hover:bg-slate-700 text-white px-7 py-3.5 rounded-xl font-medium transition border border-slate-700"
          >
            View Learning Roadmap
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Smart Trade Log",
              desc: "Record every trade with context, emotions, and screenshots in seconds.",
              icon: "📈",
            },
            {
              title: "Deep Analytics",
              desc: "Win rate, R-multiples, best setups, and performance by day or strategy.",
              icon: "📊",
            },
            {
              title: "Learning Roadmap",
              desc: "A clear path from beginner to advanced with actionable milestones.",
              icon: "🗺️",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap Preview */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Your Path to Mastery</h2>
          <p className="text-slate-400">A structured roadmap to become a consistent trader</p>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {[
            { stage: "01", title: "Foundations", items: ["Risk Management", "Trading Psychology", "Market Basics"] },
            { stage: "02", title: "Strategy", items: ["Price Action", "Setup Building", "Backtesting"] },
            { stage: "03", title: "Execution", items: ["Trade Plan", "Journaling", "Discipline"] },
            { stage: "04", title: "Mastery", items: ["Edge Refinement", "Psychology Deep Dive", "Scaling"] },
          ].map((item) => (
            <div
              key={item.stage}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="text-5xl font-bold text-slate-800 absolute -right-2 -top-2">{item.stage}</div>
              <h3 className="text-lg font-semibold mb-4 relative">{item.title}</h3>
              <ul className="space-y-2 relative">
                {item.items.map((i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take your trading seriously?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join traders who journal with purpose and improve with clarity.
          </p>
          <Link
            to="/register"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-medium transition shadow-lg shadow-emerald-500/25"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>
            <span className="text-emerald-400 font-medium">Trade</span>Journal
          </div>
          <div>Built for traders who want to improve.</div>
        </div>
      </footer>
    </div>
  );
}