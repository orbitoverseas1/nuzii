import { X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import Logo from "./Logo";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import SocialMedia from "./SocialMedia";
import { CATEGORIES_QUERYResult } from "@/sanity.types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CATEGORIES_QUERYResult;
}


const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const [isShopOpen, setIsShopOpen] = useState(true);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm xl:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            ref={sidebarRef}
            className="fixed inset-y-0 left-0 z-50 w-[80%] max-w-sm bg-white shadow-2xl xl:hidden overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 flex items-center justify-between border-b border-nuziiRoseGold/20">
                <Logo className="w-24" />
                <button
                  onClick={onClose}
                  className="p-2 text-nuziiText hover:text-nuziiRoseGoldDark transition-colors rounded-full hover:bg-nuziiCream"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 py-6 px-4 flex flex-col gap-2">
                <Link
                  onClick={onClose}
                  href="/"
                  className={`px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-between ${pathname === "/"
                    ? "bg-nuziiRoseGold/10 text-nuziiRoseGoldDark"
                    : "text-nuziiText hover:bg-nuziiCream hover:text-nuziiRoseGoldDark"
                    }`}
                >
                  Home
                </Link>

                {/* Shop Accordion */}
                <div className="flex flex-col">
                  <button
                    onClick={() => setIsShopOpen(!isShopOpen)}
                    className={`px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-between w-full ${pathname.startsWith("/shop") || pathname.startsWith("/category")
                      ? "text-nuziiRoseGoldDark"
                      : "text-nuziiText hover:bg-nuziiCream hover:text-nuziiRoseGoldDark"
                      }`}
                  >
                    <span>Shop</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${isShopOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isShopOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pl-4"
                      >
                        <div className="pl-4 border-l-2 border-nuziiRoseGold/20 flex flex-col gap-1 py-2">
                          <Link
                            onClick={onClose}
                            href="/shop"
                            className={`px-4 py-2 rounded-lg text-base transition-colors flex items-center gap-2 ${pathname === "/shop"
                              ? "text-nuziiRoseGoldDark font-medium"
                              : "text-nuziiTextLight hover:text-nuziiRoseGoldDark"
                              }`}
                          >
                            All Products
                          </Link>
                          {categories?.map((item) => (
                            <Link
                              onClick={onClose}
                              key={item?.title}
                              href={`/category/${item?.slug?.current}`}
                              className={`px-4 py-2 rounded-lg text-base transition-colors flex items-center gap-2 capitalize ${pathname === `/category/${item?.slug?.current}`
                                ? "text-nuziiRoseGoldDark font-medium"
                                : "text-nuziiTextLight hover:text-nuziiRoseGoldDark"
                                }`}
                            >
                              {item?.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  onClick={onClose}
                  href="/about"
                  className={`px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-between ${pathname === "/about"
                    ? "bg-nuziiRoseGold/10 text-nuziiRoseGoldDark"
                    : "text-nuziiText hover:bg-nuziiCream hover:text-nuziiRoseGoldDark"
                    }`}
                >
                  About
                </Link>

                <Link
                  onClick={onClose}
                  href="/contact"
                  className={`px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-between ${pathname === "/contact"
                    ? "bg-nuziiRoseGold/10 text-nuziiRoseGoldDark"
                    : "text-nuziiText hover:bg-nuziiCream hover:text-nuziiRoseGoldDark"
                    }`}
                >
                  Contact
                </Link>

                <Link
                  onClick={onClose}
                  href="/orders"
                  className={`px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-between ${pathname === "/orders"
                      ? "bg-nuziiRoseGold/10 text-nuziiRoseGoldDark"
                      : "text-nuziiText hover:bg-nuziiCream hover:text-nuziiRoseGoldDark"
                    }`}
                >
                  My Orders
                </Link>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-nuziiRoseGold/20 bg-nuziiCream/30">
                <SocialMedia />
                <p className="text-center text-xs text-nuziiTextLight mt-4">
                  © {new Date().getFullYear()} NUZII. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Sidebar;
