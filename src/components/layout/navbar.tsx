/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Navbar({ toggleTheme, theme }: any) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-md flex justify-between items-center px-6 py-3 z-50">
      <div className="font-bold text-xl text-red-700">HabTrack</div>
      <div className="space-x-6 hidden md:flex text-red-700 font-medium">
        <a href="#about" className="hover:underline">About</a>
        <a href="#contact" className="hover:underline">Contact Us</a>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-red-700 hover:text-red-900 transition"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <a
          href="/signup"
          className="bg-red-700 text-white px-4 py-2 rounded-md shadow hover:bg-red-800 transition"
        >
          Inizia Ora
        </a>
      </div>
    </nav>
  );
}