import Link from "next/link";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="w-full">
      {/* Section 1: Simple Contact Intro */}
      <section className="relative w-full py-20 md:py-28 bg-gradient-to-br from-nuziiBeige via-nuziiCream to-nuziiBeige overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-nuziiRoseGold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-nuziiRoseGoldDark/10 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-nuziiRoseGold/20 mb-4">
              <MessageCircle className="w-4 h-4 text-nuziiRoseGold" />
              <span className="text-sm font-medium text-nuziiText tracking-wide">Get in Touch</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-light text-nuziiText leading-tight">
              We are here to{" "}
              <span className="font-medium bg-gradient-to-r from-nuziiRoseGoldDark to-nuziiRoseGold bg-clip-text text-transparent">
                help
              </span>
            </h1>

            <div className="w-20 h-1 bg-nuziiRoseGold mx-auto rounded-full" />

            <div className="space-y-3 text-lg md:text-xl text-nuziiTextLight font-light pt-4">
              <p>Questions about sizing, delivery, or an order?</p>
              <p className="text-nuziiText font-medium">Reach out anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Contact Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="bg-nuziiCream/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-nuziiRoseGold/10 shadow-lg">
            <form className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-nuziiText tracking-wide"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-5 py-4 bg-white border border-nuziiSand/50 rounded-2xl text-nuziiText placeholder-nuziiTextLight/50 focus:outline-none focus:ring-2 focus:ring-nuziiRoseGold/50 focus:border-nuziiRoseGold transition-all duration-300"
                  placeholder="Your name"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-nuziiText tracking-wide"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-5 py-4 bg-white border border-nuziiSand/50 rounded-2xl text-nuziiText placeholder-nuziiTextLight/50 focus:outline-none focus:ring-2 focus:ring-nuziiRoseGold/50 focus:border-nuziiRoseGold transition-all duration-300"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-nuziiText tracking-wide"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-5 py-4 bg-white border border-nuziiSand/50 rounded-2xl text-nuziiText placeholder-nuziiTextLight/50 focus:outline-none focus:ring-2 focus:ring-nuziiRoseGold/50 focus:border-nuziiRoseGold transition-all duration-300 resize-none"
                  placeholder="Tell us how we can help..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-nuziiRoseGold to-nuziiRoseGoldDark hover:from-nuziiRoseGoldDark hover:to-nuziiRoseGold text-white rounded-full text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Send Message
                </button>
                <p className="text-center text-sm text-nuziiTextLight mt-4">
                  We reply within <span className="font-medium text-nuziiRoseGoldDark">24 hours</span>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Section 3: Support Info */}
      <section className="py-20 bg-nuziiBeige">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-nuziiText mb-4">
              Other Ways to <span className="font-medium text-nuziiRoseGoldDark">Connect</span>
            </h2>
            <div className="w-20 h-1 bg-nuziiRoseGold mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Support */}
            <div className="group p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-nuziiRoseGold/20 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-nuziiRoseGold/20 rounded-2xl flex items-center justify-center text-nuziiRoseGoldDark flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-nuziiText mb-2">Email Us</h3>
                  <a
                    href="mailto:support@nuzii.com"
                    className="text-nuziiRoseGoldDark hover:text-nuziiRoseGold transition-colors duration-300 font-medium"
                  >
                    support@nuzii.com
                  </a>
                  <p className="text-sm text-nuziiTextLight mt-2">
                    For order inquiries and general support
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="group p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-nuziiRoseGold/20 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-nuziiRoseGold/20 rounded-2xl flex items-center justify-center text-nuziiRoseGoldDark flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-nuziiText mb-2">Delivery & Returns</h3>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 text-nuziiRoseGoldDark hover:text-nuziiRoseGold transition-colors duration-300 font-medium"
                  >
                    See our FAQ page
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <p className="text-sm text-nuziiTextLight mt-2">
                    Find answers to common questions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="inline-block p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-nuziiRoseGold/10">
              <p className="text-nuziiTextLight">
                Our support team is available{" "}
                <span className="font-medium text-nuziiText">Monday to Friday, 9 AM - 6 PM</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
