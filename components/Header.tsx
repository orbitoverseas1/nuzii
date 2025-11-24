import Link from "next/link";
import React from "react";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Container from "./Container";
import { getAllCategories, getMyOrders } from "@/sanity/helpers";
import HeaderMenu from "./new/HeaderMenu";
import Logo from "./new/Logo";
import { ListOrdered, User } from "lucide-react";
import CartIcon from "./new/CartIcon";
import MobileMenu from "./new/MobileMenu";
import SearchBar from "./new/SearchBar";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }
  const categories = await getAllCategories(3);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-nuziiRoseGold/20 py-4 transition-all duration-300">
      <Container className="flex items-center justify-between gap-4">
        {/* Left: Navigation Menu */}
        <div className="hidden md:block w-1/3">
          <HeaderMenu categories={categories} />
        </div>

        {/* Mobile Menu Trigger (Visible on mobile only) */}
        <div className="md:hidden w-1/3">
          <MobileMenu categories={categories} />
        </div>

        {/* Center: Logo */}
        <div className="w-1/3 flex justify-center">
          <Logo className="text-3xl tracking-[0.2em] font-light">NUZII</Logo>
        </div>

        {/* Right: Utility Icons */}
        <div className="w-1/3 flex items-center justify-end gap-6">
          <SearchBar />

          <CartIcon />

          <ClerkLoaded>
            <SignedIn>
              <Link href={"/orders"} className="group relative text-nuziiText hover:text-nuziiRoseGoldDark transition-colors">
                <ListOrdered className="w-5 h-5" />
                {orders && orders.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-nuziiRoseGold text-white h-4 w-4 rounded-full text-[10px] font-medium flex items-center justify-center">
                    {orders.length}
                  </span>
                )}
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border border-nuziiRoseGold/30"
                  }
                }}
              />
            </SignedIn>
            {!user && (
              <Link
                href="/signin"
                className="text-nuziiText hover:text-nuziiRoseGoldDark transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
