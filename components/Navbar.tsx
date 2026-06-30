"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {

  const pathname = usePathname();

  const menus = [

  {
    name: "🏠 Home",
    link: "/",
  },

  {
    name: "🎨 Paint Sales",
    link: "/paints",
  },

  {
    name: "🪵 Timber Sales",
    link: "/timbers",
  },

  {
    name: "📦 Stock",
    link: "/stock",
  },

  {
    name: "👥 Customers",
    link: "/customers",
  },

  {
    name: "💰 Pending",
    link: "/pending",
  },

  {
    name: "📊 Reports",
    link: "/reports",
  },

];
    return (

    <nav className="bg-slate-900 border-b border-green-600 shadow-lg">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between h-16">

          <h1 className="text-2xl font-extrabold text-green-400 tracking-wide">
  🏪 MALESHWAR PAINTS & TIMBERS
</h1>

         <div className="flex items-center gap-2 overflow-x-auto">

            {menus.map((menu) => (

              <Link
                key={menu.link}
                href={menu.link}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold transition-all duration-300

                ${
                  pathname === menu.link
                    ? "bg-green-500 text-black"
                    : "text-white hover:bg-slate-700"
                }`}
              >
                {menu.name}
              </Link>

            ))}

          </div>

        </div>

      </div>

    </nav>

  );

}