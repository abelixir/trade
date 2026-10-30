import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Solid full-page background */}
      <div className="fixed inset-0 bg-slate-950 -z-20" />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative border-b border-slate-800/60 backdrop-blur sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-emerald-400">Trade</span>
            <span className="text-white">Vibe</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-slate-300 hover:text-white transition px-3 py-1.5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-full font-semibold transition shadow-lg shadow-emerald-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

            {/* Hero */}
        <section className="relative max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-emerald-500/20">
            Built for traders who want real consistency
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-5">
            Welcome to{" "}
            <span className="text-emerald-400">Trade</span>
            <span className="text-white">Vibe</span>
          </h1>

          <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-200 mb-6 leading-tight">
            Stop guessing.{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Start journaling.
            </span>
          </p>

          <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The trading journal that helps you track every trade, understand your
            patterns, and build the discipline that separates amateurs from
            professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-semibold text-lg transition shadow-xl shadow-emerald-500/30"
            >
              Start Free →
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-medium transition border border-slate-700"
            >
              I already have an account
            </Link>
          </div>
        </section>

      {/* Features */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Everything you need to improve
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Simple tools. Clear insights. Built around how real traders actually work.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Log trades in seconds",
              desc: "Capture symbol, direction, entry, exit and size — then reflect later in the journal.",
              emoji: "⚡",
            },
            {
              title: "See the real numbers",
              desc: "Win rate, profit factor, equity curve and calendar heatmaps — honest performance data.",
              emoji: "📊",
            },
            {
              title: "Journal with intention",
              desc: "Add notes, emotions and lessons to every trade. Spot the habits that cost you money.",
              emoji: "📓",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-8 transition-all hover:-translate-y-1"
            >
              <div className="text-4xl mb-5">{item.emoji}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              A complete trading journal system
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              TradeVibe is designed to take you from random results to a clear,
              repeatable process — without spreadsheets or complicated tools.
            </p>
            <ul className="space-y-4">
              {[
                "Dashboard with live P&L, win rate and equity curve",
                "Full trade journal with filters and emotion tracking",
                "Weekly analysis with chart uploads",
                "Analytics calendar and performance breakdown",
                "Certificates vault for your achievements",
                "Clear learning roadmap from beginner to mastery",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5">
            {[
              { label: "Trade logging", value: "Fast & focused" },
              { label: "Reflection", value: "Notes + emotion" },
              { label: "Analytics", value: "Real performance" },
              { label: "Progress", value: "Roadmap guided" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0"
              >
                <span className="text-slate-400">{row.label}</span>
                <span className="font-medium text-emerald-400">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap teaser */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Your path to consistency</h2>
          <p className="text-slate-400">Four stages. Clear focus. Real progress.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { stage: "01", title: "Foundations", items: ["Risk", "Psychology", "Basics"] },
            { stage: "02", title: "Strategy", items: ["Price Action", "Setups", "Backtesting"] },
            { stage: "03", title: "Execution", items: ["Plan", "Journal", "Discipline"] },
            { stage: "04", title: "Mastery", items: ["Edge", "Mindset", "Scaling"] },
          ].map((item) => (
            <div
              key={item.stage}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition"
            >
              <div className="text-6xl font-black text-slate-800/80 absolute -right-1 -top-3 group-hover:text-emerald-500/10 transition">
                {item.stage}
              </div>
              <h3 className="text-lg font-semibold mb-4 relative">{item.title}</h3>
              <ul className="space-y-2 relative">
                {item.items.map((i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
        <div className="bg-gradient-to-br from-emerald-500/20 via-slate-900 to-cyan-500/10 border border-emerald-500/20 rounded-[2rem] p-10 md:p-16 text-center">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-wide mb-3">
            Welcome to TradeVibe
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to trade with intention?
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg">
            Create your free account and start building the habits that lead to
            consistent results.
          </p>
          <Link
            to="/register"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-4 rounded-2xl font-semibold text-lg transition shadow-xl shadow-emerald-500/30"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="font-medium">
            <span className="text-emerald-400">Trade</span>Vibe
          </div>
          <div>Made for traders who are done with random results.</div>
        </div>
      </footer>
    </div>
  );
}