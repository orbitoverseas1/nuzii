import React from "react";
import Container from "./Container";
import { getAllCategories } from "@/sanity/helpers";
import HeaderMenu from "./new/HeaderMenu";
import Logo from "./new/Logo";
import MobileMenu from "./new/MobileMenu";
import SearchBar from "./new/SearchBar";
import UserMenu from "./new/UserMenu";
import CartIcon from "./new/CartIcon";
import WishlistIcon from "./new/WishlistIcon";
import OrdersIcon from "./new/OrdersIcon";

const Header = async () => {
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
          <WishlistIcon />
          <CartIcon />
          <OrdersIcon />
          <UserMenu />
        </div>
      </Container>
    </header>
  );
};

export default Header;
