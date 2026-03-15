export default function ProtectedLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 120}ms`, animationDuration: "800ms" }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-500/40">
        Cargando
      </span>
    </div>
  );
}
