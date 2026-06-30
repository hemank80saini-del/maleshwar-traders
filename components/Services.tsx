export default function Services() {

  const services = [
    "Premium Paints",
    "Timbers"
  ];

  return (
    <section className="py-24 bg-gray-100">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center text-green-900">
          Our Services
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mt-16">

          {services.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-10 text-center hover:scale-105 duration-300"
            >
              <h3 className="text-3xl font-bold text-green-900">
                {item}
              </h3>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}