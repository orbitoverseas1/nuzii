import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles, ShieldCheck, Palette, Camera, ShoppingBag, Crown } from "lucide-react";

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
      <section className="w-full bg-[#c8a19c]">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left Column - Image */}
          <div className="relative h-[400px] md:h-full w-full">
            <Image
              src="/images/about-left.png"
              alt="Nuzii Woman"
              fill
              className="object-cover object-top"
            />
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 text-white space-y-8">
            <h1 className="text-3xl md:text-5xl font-light text-white">
              Made with Love, NUZI
            </h1>

            <blockquote className="text-lg md:text-xl font-light italic text-white/90 border-l-2 border-white pl-4">
              “We believe modest fashion is more than style — it is confidence, comfort, and self-expression.” — NUZI
            </blockquote>

            <div className="space-y-4 text-white/90 font-light leading-relaxed">
              <p>
                At NUZI, we pour intention into every piece we create.
                Our mission is to deliver quality, elegance, and modesty in every shawl—crafted to reflect our brand’s timeless values.
              </p>
              <p>
                We design with the modern woman in mind, offering pieces that uplift confidence and bring effortless beauty to your everyday moments.
                Because at NUZI, you deserve to feel graceful, empowered, and uniquely you.
              </p>
            </div>

            {/* Icons Section */}
            <div className="pt-8 border-t border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-3 group">
                  <div className="p-3 rounded-full border border-white/30 group-hover:border-white transition-colors">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-light tracking-wide text-white">Be Elegant</span>
                </div>
                <div className="flex flex-col items-center gap-3 group">
                  <div className="p-3 rounded-full border border-white/30 group-hover:border-white transition-colors">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-light tracking-wide text-white">Stay Modest</span>
                </div>
                <div className="flex flex-col items-center gap-3 group">
                  <div className="p-3 rounded-full border border-white/30 group-hover:border-white transition-colors">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-light tracking-wide text-white">Feel NUZI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Mission */}
      <section className="py-24 bg-nuziiCream">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-[#6B514B] mb-6">
              Our Mission
            </h2>
            <div className="w-24 h-[1px] bg-nuziiRoseGold mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 border border-nuziiSand/20 group">
              <p className="text-lg text-[#6B514B]/80 leading-relaxed group-hover:text-[#6B514B] transition-colors">
                To make quality modest friendly fashion <span className="font-medium text-nuziiRoseGoldDark">accessible to every woman</span>.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 border border-nuziiSand/20 group">
              <p className="text-lg text-[#6B514B]/80 leading-relaxed group-hover:text-[#6B514B] transition-colors">
                To help you feel <span className="font-medium text-nuziiRoseGoldDark">confident, feminine, and put together</span>.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 border border-nuziiSand/20 group">
              <p className="text-lg text-[#6B514B]/80 leading-relaxed group-hover:text-[#6B514B] transition-colors">
                To keep things <span className="font-medium text-nuziiRoseGoldDark">simple, honest, and stylish</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: What Makes Nuzii Different */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-[#6B514B] mb-6">
              What Makes Nuzii <span className="font-medium text-nuziiRoseGoldDark">Different</span>
            </h2>
            <div className="w-24 h-[1px] bg-nuziiRoseGold mx-auto mb-8" />
            <p className="text-lg text-[#6B514B]/70 max-w-2xl mx-auto font-light">
              We choose every piece with intention.
              <br />
              If it does not feel good, it does not make it into our store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {differentiators.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 bg-nuziiCream/50 rounded-sm hover:bg-nuziiCream transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-nuziiRoseGoldDark mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-medium text-[#6B514B] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B514B]/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Our Values */}
      <section className="py-24 bg-[#c8a19c]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
              Our Values
            </h2>
            <div className="w-24 h-[1px] bg-white/50 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <h3 className="text-xl font-medium text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xl md:text-2xl text-white font-light italic opacity-90">
              &ldquo;We stand for fashion that lasts longer and feels better.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Join the Nuzii Community - CTA */}
      <section className="py-24 bg-nuziiBeige">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-[#6B514B] mb-6">
            Join the Nuzii <span className="font-medium text-nuziiRoseGoldDark">Community</span>
          </h2>
          <div className="w-24 h-[1px] bg-nuziiRoseGold mx-auto mb-8" />
          <p className="text-lg md:text-xl text-[#6B514B]/80 mb-4 leading-relaxed font-light">
            Be part of a growing group of women who love effortless, modest style.
          </p>
          <p className="text-lg text-[#6B514B] mb-10 font-medium">
            Get early access to new drops and exclusive offers.
          </p>
          <Link
            href="/shop"
            className="inline-block px-10 py-3 bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark text-white rounded-md text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Browse Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
