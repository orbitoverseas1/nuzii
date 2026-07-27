import Link from "next/link";
import Logo from "./new/Logo";
import SocialMedia from "./new/SocialMedia";
import { customerCareLinks } from "@/constants";
import { getAllCategories } from "@/sanity/helpers";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/sanity.types";

const Footer = async () => {
  // Fetch categories from Sanity
  const categories = await getAllCategories();

  return (
    <footer className="bg-nuziiCream border-t border-nuziiSand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About Nuzii */}
          <div className="space-y-6">
            <Logo className="w-24 mb-2" />
            <p className="text-nuziiText text-sm leading-relaxed">
              Nuzii brings soft, modest friendly, everyday fashion to women who love simple and elegant style.
              <br />
              <span className="font-medium text-nuziiRoseGoldDark">Quality you can trust. Prices you can love.</span>
            </p>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg group"
            >
              Discover Your Style
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="font-semibold text-nuziiText text-lg mb-6">Shop</h3>
            <ul className="space-y-3">
              {categories && categories.length > 0 ? (
                categories.map((category: Category) => (
                  <li key={category.slug?.current || category._id}>
                    <Link
                      href={`/category/${category.slug?.current}`}
                      className="text-nuziiTextLight hover:text-nuziiRoseGoldDark text-sm font-medium hoverEffect inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">
                        {category.title}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/category/shawls"
                      className="text-nuziiTextLight hover:text-nuziiRoseGoldDark text-sm font-medium hoverEffect inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">
                        Shawls
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/bags"
                      className="text-nuziiTextLight hover:text-nuziiRoseGoldDark text-sm font-medium hoverEffect inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">
                        Bags
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/jewellery"
                      className="text-nuziiTextLight hover:text-nuziiRoseGoldDark text-sm font-medium hoverEffect inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">
                        Jewellery
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/hijab-accessories"
                      className="text-nuziiTextLight hover:text-nuziiRoseGoldDark text-sm font-medium hoverEffect inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">
                        Hijab Accessories
                      </span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="font-semibold text-nuziiText text-lg mb-6">Customer Care</h3>
            <ul className="space-y-3">
              {customerCareLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-nuziiTextLight hover:text-nuziiRoseGoldDark text-sm font-medium hoverEffect inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect With Us */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-nuziiText text-lg mb-6">Connect With Us</h3>
              <SocialMedia
                className="justify-start"
                iconClassName="border-nuziiRoseGold/40 text-nuziiRoseGoldDark hover:border-nuziiRoseGoldDark hover:bg-nuziiRoseGold/10"
                tooltipClassName="bg-nuziiRoseGoldDark"
              />
            </div>

            <div>
              <p className="text-nuziiText text-sm mb-4 leading-relaxed">
                Stay updated with new drops and style edits.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-nuziiSand rounded-lg focus:outline-none focus:ring-2 focus:ring-nuziiRoseGold focus:border-transparent bg-white text-nuziiText placeholder:text-nuziiTextLight transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  Join the Community
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="py-6 border-t border-nuziiSand">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-nuziiTextLight">
            <p>© {new Date().getFullYear()} Nuzii. All rights reserved.</p>
            <p className="text-nuziiText font-medium">
              Designed for women who love soft, elegant, everyday style.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
