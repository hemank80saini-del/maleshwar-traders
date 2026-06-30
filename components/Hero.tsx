import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white pt-36 pb-28">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">

        {/* Left Side */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Welcome to
            <br />
            <span className="text-yellow-400">
              Maleshwar Traders
            </span>
          </h1>

          <p className="mt-8 text-xl text-gray-200 leading-8">
            We provide premium quality Paints, Timbers, Plywood,
            Laminates, MDF Boards and Hardware Products with trusted
            service and best market prices.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link href="/paints">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl transition duration-300 shadow-lg">
                🎨 Premium Paints
              </button>
            </Link>

            <Link href="/timbers">
              <button className="bg-white hover:bg-gray-200 text-green-900 font-bold px-8 py-4 rounded-xl transition duration-300 shadow-lg">
                🌲 Timbers
              </button>
            </Link>

          </div>
        </div>

        {/* Right Side */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900"
            alt="Maleshwar Traders"
            className="rounded-3xl shadow-2xl w-full"
          />
        </div>

      </div>
    </section>
  );
}