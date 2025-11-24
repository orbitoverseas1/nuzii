"use client";
import { CATEGORIES_QUERYResult, Category } from "@/sanity.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const HeaderMenu = ({ categories }: { categories: CATEGORIES_QUERYResult }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="hidden md:inline-flex items-center gap-8 text-sm font-medium text-nuziiText tracking-wide">
      <Link
        href={"/"}
        className={`hover:text-nuziiRoseGoldDark transition-colors duration-300 ${isActive("/") ? "text-nuziiRoseGoldDark" : ""
          }`}
      >
        Home
      </Link>

      <div className="relative group">
        <button
          className={`flex items-center gap-1 hover:text-nuziiRoseGoldDark transition-colors duration-300 ${pathname.startsWith("/shop") || pathname.startsWith("/category")
              ? "text-nuziiRoseGoldDark"
              : ""
            }`}
        >
          Shop
          <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
        </button>

        <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-nuziiBeige p-4 min-w-[200px] flex flex-col gap-2">
            <Link
              href="/shop"
              className="px-4 py-2 hover:bg-nuziiCream rounded-lg text-nuziiText hover:text-nuziiRoseGoldDark transition-colors"
            >
              All Products
            </Link>
            {categories?.map((category: Category) => (
              <Link
                key={category?._id}
                href={`/category/${category?.slug?.current}`}
                className="px-4 py-2 hover:bg-nuziiCream rounded-lg text-nuziiText hover:text-nuziiRoseGoldDark transition-colors capitalize"
              >
                {category?.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Link
        href={"/about"}
        className={`hover:text-nuziiRoseGoldDark transition-colors duration-300 ${isActive("/about") ? "text-nuziiRoseGoldDark" : ""
          }`}
      >
        About
      </Link>

      <Link
        href={"/contact"}
        className={`hover:text-nuziiRoseGoldDark transition-colors duration-300 ${isActive("/contact") ? "text-nuziiRoseGoldDark" : ""
          }`}
      >
        Contact
      </Link>
    </div>
  );
};

export default HeaderMenu;
