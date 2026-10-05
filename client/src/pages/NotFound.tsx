import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-sm text-black/40">
        404
      </p>

      <h1 className="mt-3 text-4xl font-medium tracking-[-0.04em]">
        Page not found
      </h1>

      <Link
        to="/"
        className="mt-6 rounded-full bg-black px-5 py-3 text-sm text-white"
      >
        Back home
      </Link>
    </div>
  );
}