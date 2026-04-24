import Link from "next/link";
import { TrendingUp, MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 mb-12">
        <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
          <TrendingUp size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold gradient-accent-text">CoinPulse</span>
      </Link>

      {/* 404 */}
      <div className="relative mb-6">
        <p className="text-[120px] font-bold leading-none gradient-accent-text opacity-10 select-none">
          404
        </p>
        <p className="absolute inset-0 flex items-center justify-center text-[120px] font-bold leading-none gradient-accent-text select-none">
          404
        </p>
      </div>

      <h1 className="text-2xl font-bold text-text-primary mb-3">
        Page not found
      </h1>
      <p className="text-text-muted text-sm max-w-xs mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 gradient-accent text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
      >
        <MoveLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}
