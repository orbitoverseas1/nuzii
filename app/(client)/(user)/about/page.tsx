import Link from "next/link";
import { Heart, Sparkles, ShieldCheck, Palette, Camera, ShoppingBag } from "lucide-react";

const differentiators = [
  {
    icon: Sparkles,
    title: "Quality fabrics",
    description: "Soft, premium materials selected for comfort and durability."
  },
  {
    icon: Palette,
    title: "Soft neutral tones",
    description: "Timeless colors that complement any wardrobe."
  },
  {
    icon: ShieldCheck,
    title: "Comfortable modest fits",
    description: "Thoughtfully designed for coverage and confidence."
  },
  {
    icon: Heart,
    title: "Fair pricing",
    description: "Luxury feel without the luxury markup."
  },
  {
    icon: Camera,
    title: "Reliable product photos",
    description: "What you see is what you get—no surprises."
  },
  {
    icon: ShoppingBag,
    title: "Smooth experience",
    description: "Easy browsing, secure checkout, hassle-free returns."
  }
];

const values = [
  { title: "Honesty", description: "Transparent pricing and authentic products" },
  { title: "Quality", description: "Premium fabrics that last" },
  { title: "Simplicity", description: "Effortless style, easy shopping" },
  { title: "Timeless style", description: "Fashion that transcends trends" }
];

const AboutPage = () => {
  return (
    <div className="w-full">
      {/* Section 1: Our Story - Hero */}
      <section className="relative w-full py-24 md:py-32 bg-nuziiBeige overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-light text-nuziiText leading-tight">
              Our <span className="font-medium text-nuziiRoseGoldDark">Story</span>
            </h1>
            <div className="w-20 h-1 bg-nuziiRoseGold mx-auto rounded-full" />
            <div className="space-y-4 text-lg md:text-xl text-nuziiTextLight font-light leading-relaxed pt-4">
              <p>Nuzii was created for women who want to look stylish without overspending.</p>
              <p>We saw a gap in the market. Pretty outfits online, poor quality in real life.</p>
              <p className="text-nuziiText font-medium">Our vision is to build a brand that women can trust.</p>
              <p>Soft fabrics. Elegant pieces. Honest pricing.</p>
              <p className="text-nuziiRoseGoldDark font-medium">Fashion that feels good every day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-light text-nuziiText mb-4">
              Our Mission
            </h2>
            <div className="w-20 h-1 bg-nuziiRoseGold mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-nuziiCream rounded-2xl hover:shadow-lg transition-all duration-300">
              <p className="text-lg text-nuziiText leading-relaxed">
                To make quality modest friendly fashion <span className="font-medium text-nuziiRoseGoldDark">accessible to every woman</span>.
              </p>
            </div>
            <div className="text-center p-6 bg-nuziiCream rounded-2xl hover:shadow-lg transition-all duration-300">
              <p className="text-lg text-nuziiText leading-relaxed">
                To help you feel <span className="font-medium text-nuziiRoseGoldDark">confident, feminine, and put together</span>.
              </p>
            </div>
            <div className="text-center p-6 bg-nuziiCream rounded-2xl hover:shadow-lg transition-all duration-300">
              <p className="text-lg text-nuziiText leading-relaxed">
                To keep things <span className="font-medium text-nuziiRoseGoldDark">simple, honest, and stylish</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: What Makes Nuzii Different */}
      <section className="py-20 bg-nuziiBeige">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-light text-nuziiText mb-4">
              What Makes Nuzii <span className="font-medium text-nuziiRoseGoldDark">Different</span>
            </h2>
            <div className="w-20 h-1 bg-nuziiRoseGold mx-auto rounded-full mb-6" />
            <p className="text-lg text-nuziiTextLight max-w-2xl mx-auto">
              We choose every piece with intention.
              <br />
              If it does not feel good, it does not make it into our store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {differentiators.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-nuziiRoseGold/20 rounded-full flex items-center justify-center text-nuziiRoseGoldDark mb-4">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium text-nuziiText mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-nuziiTextLight leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-light text-nuziiText mb-4">
              Our Values
            </h2>
            <div className="w-20 h-1 bg-nuziiRoseGold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 bg-nuziiCream rounded-2xl hover:bg-nuziiRoseGold/10 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-2xl font-medium text-nuziiRoseGoldDark mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-nuziiTextLight">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xl text-nuziiText font-light italic">
              We stand for fashion that lasts longer and feels better.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Join the Nuzii Community - CTA */}
      <section className="py-24 bg-gradient-to-br from-nuziiRoseGold/20 via-nuziiBeige to-nuziiRoseGold/10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-nuziiText mb-6">
            Join the Nuzii <span className="font-medium text-nuziiRoseGoldDark">Community</span>
          </h2>
          <div className="w-20 h-1 bg-nuziiRoseGold mx-auto rounded-full mb-8" />
          <p className="text-lg md:text-xl text-nuziiTextLight mb-4 leading-relaxed">
            Be part of a growing group of women who love effortless, modest style.
          </p>
          <p className="text-lg text-nuziiText mb-10">
            Get early access to new drops and exclusive offers.
          </p>
          <Link
            href="/shop"
            className="inline-block px-10 py-4 bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark text-white rounded-full text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Discover Your Style
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
