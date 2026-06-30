export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-green-900 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

        <div>
          <h1 className="text-3xl font-bold">
            Maleshwar Traders
          </h1>
          <p className="text-xs text-green-200">
            Paints • Timbers • Hardware
          </p>
        </div>

        <ul className="hidden md:flex gap-8 font-medium">
          <li className="cursor-pointer hover:text-yellow-300">Home</li>
          <li className="cursor-pointer hover:text-yellow-300">About</li>
          <li className="cursor-pointer hover:text-yellow-300">Products</li>
          <li className="cursor-pointer hover:text-yellow-300">Services</li>
          <li className="cursor-pointer hover:text-yellow-300">Contact</li>
        </ul>

        <button className="bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400">
          Call Now
        </button>

      </div>
    </nav>
  );
}