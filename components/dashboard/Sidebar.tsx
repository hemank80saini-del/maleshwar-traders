"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const menus = [
    {
      title: "🏠 Dashboard",
      link: "/",
    },

    {
      title: "🎨 Paint Sales",
      link: "/paints",
    },

    {
      title: "🧱 POP Sales",
      link: "/pop",
    },

    {
      title: "🪵 Timber Sales",
      link: "/timbers",
    },

    {
      title: "📦 Stock Management",
      link: "/stock",
    },

    {
      title: "👥 Customers",
      link: "/customers",
    },

    {
      title: "💰 Pending Payments",
      link: "/pending",
    },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-green-700 flex flex-col">
      
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-400">
          🏪 MALESHWAR
        </h1>

        <p className="text-gray-400 text-sm">
          Paints & Timbers
        </p>
      </div>

      <div className="px-4 space-y-2 flex-1">
        {menus.map((menu) => (
          <Link
            key={menu.link}
            href={menu.link}
            className={`
              block
              rounded-xl
              px-4
              py-3
              font-semibold
              transition
              ${
                pathname === menu.link
                  ? "bg-green-500 text-black"
                  : "text-white hover:bg-slate-800"
              }
            `}
          >
            {menu.title}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-xl px-4 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>
      </div>

    </aside>
  );
}