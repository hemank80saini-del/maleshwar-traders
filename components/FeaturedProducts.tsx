import Link from "next/link";

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center text-green-900 mb-16">
          Featured Products
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Premium Paints */}

          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">

            <img
              src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600"
              alt="Premium Paints"
              className="w-full h-72 object-cover"
            />

            <div className="p-6">

              <h3 className="text-3xl font-bold text-green-900">
                Premium Paints
              </h3>

              <p className="mt-4 text-gray-600">
                High-quality interior & exterior paints from trusted brands.
              </p>

              <Link href="/paints">
                <div className="mt-6 inline-block bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-lg cursor-pointer transition">
                  Open Paint Form
                </div>
              </Link>

            </div>

          </div>

          {/* Timbers */}

          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">

            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600"
              alt="Quality Timbers"
              className="w-full h-72 object-cover"
            />

            <div className="p-6">

              <h3 className="text-3xl font-bold text-green-900">
                Quality Timbers
              </h3>

              <p className="mt-4 text-gray-600">
                Premium plywood, MDF, laminates and timber products.
              </p>

              <Link href="/timbers">
                <div className="mt-6 inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg cursor-pointer transition">
                  Open Timber Form
                </div>
              </Link>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}