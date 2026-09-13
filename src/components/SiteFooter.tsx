export default function SiteFooter() {
  return (
    <footer className="relative mx-auto w-full max-w-7xl px-6 pb-10 text-sm text-white/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
        <div>
          <p>© {new Date().getFullYear()} Devnetiks LLC. All rights reserved.</p>
          <p className="mt-1 text-xs">Devnetiks is owned and operated by Devnetiks LLC.</p>
        </div>
        <a href="mailto:devnetiks@gmail.com" className="py-2 text-white/80 underline decoration-white/25 underline-offset-4 hover:text-white">devnetiks@gmail.com</a>
      </div>
    </footer>
  );
}
