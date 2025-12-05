import Link from "next/link";
import React from "react";
import Container from "./Container";
import { getAllCategories } from "@/sanity/helpers";
import HeaderMenu from "./new/HeaderMenu";
import Logo from "./new/Logo";
import { ListOrdered } from "lucide-react";
import CartIcon from "./new/CartIcon";
import MobileMenu from "./new/MobileMenu";
import SearchBar from "./new/SearchBar";
import UserMenu from "./new/UserMenu";

const Header = async () => {
  // Orders fetching will need to be moved to a client component or handled differently with Firebase
  // For now, we'll pass null and handle it in the client component if possible, 
  // or we can't fetch orders server-side easily without cookies.
  // Let's assume for now we just render the header and orders will be fetched client-side or we'll fix this later.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders: any[] = [];
  const categories = await getAllCategories(3);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-nuziiRoseGold/20 py-4 transition-all duration-300">
      <Container className="flex items-center justify-between gap-4">
        {/* Left: Navigation Menu */}
        <div className="hidden xl:block w-1/3">
          <HeaderMenu categories={categories} />
        </div>

        {/* Mobile Menu Trigger (Visible on mobile only) */}
        <div className="xl:hidden w-1/3">
          <MobileMenu categories={categories} />
        </div>

        {/* Center: Logo */}
        <div className="w-1/3 flex justify-center">
          <Logo className="w-28 -mt-1.5 xl:mt-0" />
        </div>

        {/* Right: Utility Icons */}
        <div className="w-1/3 flex items-center justify-end gap-6">
          <SearchBar />

          <CartIcon />

          <Link href={"/orders"} className="hidden md:block group relative text-nuziiText hover:text-nuziiRoseGoldDark transition-colors">
            <ListOrdered className="w-5 h-5" />
            {orders && orders.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-nuziiRoseGold text-white h-4 w-4 rounded-full text-[10px] font-medium flex items-center justify-center">
                {orders.length}
              </span>
            )}
          </Link>

          <UserMenu />
        </div>
      </Container>
    </header>
  );
};

export default Header;
