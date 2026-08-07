import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { LogIn, Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';
import GheeBottle from '../../assets/ghee-bottle.png';

/* ================= ANIMATIONS ================= */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

interface ProductItem {
  name: string;
  icon: React.ReactNode;
}

/* ================= SOCIAL LINKS ================= */
function SocialLinks() {
  return (
    <div className="flex items-center gap-4 mt-6">
      <a
        href="https://wa.me/7806807919"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center
                   hover:scale-110 hover:shadow-lg hover:shadow-green-500/40 transition-all"
      >
        <FaWhatsapp size={20} />
      </a>

      <a
        href="https://www.instagram.com/aksharafoods_999"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500
                   text-white flex items-center justify-center
                   hover:scale-110 hover:shadow-lg hover:shadow-pink-500/40 transition-all"
      >
        <FaInstagram size={20} />
      </a>

      <a
        href="https://www.facebook.com/share/1FXC6FGzXX/?mibextid=wwXIfr&wa_status_inline=true"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center
                   hover:scale-110 hover:shadow-lg hover:shadow-blue-500/40 transition-all"
      >
        <FaFacebookF size={18} />
      </a>
    </div>
  );
}

/* ================= LANDING PAGE ================= */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features: FeatureItem[] = [
    {
      icon: '🥛',
      title: 'Fresh Essentials',
      desc: 'Fresh milk, yogurt, cheese, butter and more crafted daily.',
    },
    {
      icon: '🤝',
      title: 'Trusted Partners',
      desc: 'Collaborating with local farmers to ensure ethical sourcing.',
    },
    {
      icon: '🧼',
      title: 'Clean Handling',
      desc: 'Hygiene protocols at every processing touchpoint.',
    },
    {
      icon: '🏡',
      title: 'Family Focus',
      desc: 'Nutrient-dense products designed for every generation.',
    },
  ];

  const products: ProductItem[] = [
    { name: 'Fresh Milk', icon: <span className="text-6xl">🥛</span> },
    { name: 'Curd & Buttermilk', icon: <span className="text-6xl">🍶</span> },
    {
      name: 'Fresh Paneer',
      icon: (
        <div className="flex justify-center items-center">
          <div className="w-16 h-12 bg-slate-100 border-2 border-slate-200 rounded-md shadow-inner relative">
            <div className="absolute top-1 left-1 w-2 h-2 bg-slate-300 rounded-full opacity-50"></div>
          </div>
        </div>
      ),
    },
    { name: 'Butter', icon: <span className="text-6xl">🧈</span> },
    {
      name: 'Pure Ghee',
      icon: (
        <div className="relative flex justify-center items-center h-20">
          <img
            src={GheeBottle}
            alt="Pure Ghee"
            className="h-full w-auto object-contain drop-shadow-md"
          />
        </div>
      ),
    },
    { name: 'Cheese', icon: <span className="text-6xl">🧀</span> },
    {
      name: 'Flavoured Milk',
      icon: (
        <div className="flex gap-1 items-end justify-center">
          <span className="text-4xl filter hue-rotate-[280deg] saturate-150">🥛</span>
          <span className="text-5xl filter sepia saturate-[5] hue-rotate-[10deg]">🥛</span>
          <span className="text-4xl filter hue-rotate-[60deg] saturate-150">🥛</span>
        </div>
      ),
    },
    { name: 'Traditional Sweets', icon: <span className="text-6xl">🍮</span> },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-slate-800 overflow-x-hidden font-sans antialiased">
      {/* ================= HEADER / NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-green-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                AKSHARA FOODS
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-green-600 uppercase block">
                Pure Dairy Craft
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-green-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('why-akshara')}
              className="hover:text-green-600 transition-colors"
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="hover:text-green-600 transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-green-600 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Staff Login Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-green-700 hover:shadow-lg transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-5 shadow-xl space-y-4 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left font-medium text-slate-700 hover:text-green-600 py-1"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('why-akshara')}
              className="block w-full text-left font-medium text-slate-700 hover:text-green-600 py-1"
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="block w-full text-left font-medium text-slate-700 hover:text-green-600 py-1"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left font-medium text-slate-700 hover:text-green-600 py-1"
            >
              Contact
            </button>
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-green-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Staff / ERP Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section
        id="hero"
        className="relative px-6 pt-36 pb-28 bg-gradient-to-br from-green-50/80 via-white to-amber-50/50 overflow-hidden"
      >
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-green-200/60 rounded-full blur-3xl opacity-40 pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-200/60 rounded-full blur-3xl opacity-40 pointer-events-none"
        />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-green-100/80 border border-green-200 text-green-800 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>100% Pure &amp; Responsibly Sourced Dairy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-slate-900"
          >
            Dairy That Feels{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
              Fresh. Honest. Reliable.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Akshara Foods delivers a complete range of high-quality dairy products — crafted with
            precision for families who value purity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button
              onClick={() => scrollToSection('products')}
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-green-600/20
                         hover:bg-green-700 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Our Dairy Range</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-lg
                         hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Staff / ERP Login</span>
            </Link>

            <button
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold border-2 border-slate-200 text-slate-700
                         hover:border-green-600 hover:text-green-600 transition-all"
            >
              Get in Touch
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= BRAND STRIP ================= */}
      <section className="py-6 border-y border-slate-100 bg-white/80 backdrop-blur-sm sticky top-16 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs md:text-sm font-bold uppercase tracking-wider text-slate-500">
          <div>🌿 Responsibly Sourced</div>
          <div>🧪 Quality Checked</div>
          <div>🏭 Hygienic Hubs</div>
          <div>❤️ Family Grade</div>
        </div>
      </section>

      {/* ================= WHY AKSHARA ================= */}
      <motion.section
        id="why-akshara"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 py-24 bg-slate-50/60"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            The Akshara Foods Edge
          </h2>
          <div className="w-20 h-1.5 bg-green-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100
                         hover:shadow-xl hover:shadow-green-500/10 transition-all"
            >
              <div className="text-5xl mb-5">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= PRODUCTS ================= */}
      <section id="products" className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Our Dairy Portfolio
          </h2>
          <p className="text-base md:text-lg text-slate-500">
            A premium selection of essentials, crafted for consistency and purity.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
        >
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ scale: 1.04 }}
              className="group bg-white border border-slate-100
                         rounded-3xl p-8 text-center
                         hover:border-green-200 transition-all
                         shadow-xs hover:shadow-xl"
            >
              <div className="mb-5 h-20 flex justify-center items-center group-hover:scale-110 transition-transform">
                {product.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base tracking-tight">
                {product.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= FOOTER / CONTACT ================= */}
      <footer id="contact" className="bg-slate-950 text-slate-400 px-6 pt-20 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-white text-2xl font-black mb-4 tracking-tight">AKSHARA FOODS</h3>
            <p className="max-w-md text-sm text-slate-400 leading-relaxed">
              Redefining dairy standards with a focus on quality, transparency, and modern
              nutrition for every household.
            </p>
            <SocialLinks />
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-xs">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="hover:text-green-400 transition-colors"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('products')}
                  className="hover:text-green-400 transition-colors"
                >
                  Our Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('why-akshara')}
                  className="hover:text-green-400 transition-colors"
                >
                  Quality Process
                </button>
              </li>
              <li>
                <Link to="/login" className="text-green-400 font-semibold hover:underline">
                  Staff / ERP Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-xs">
              Contact Us
            </h4>
            <p className="text-sm leading-relaxed text-slate-400 space-y-2">
              <span>📍 Settikarai, Dharmapuri, TamilNadu - 636704</span>
              <br />
              <span>📧 admin@aksharafoods.com</span>
              <br />
              <span>📞 +91 7806807919</span>
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Akshara Foods Group. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-400 hover:text-green-400 transition-colors">
              DairyFlow ERP Login
            </Link>
          </div>
        </div>
      </footer>

      {/* ================= FLOATING WHATSAPP ================= */}
      <a
        href="https://wa.me/7806807919"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-600 text-white
                   flex items-center justify-center shadow-2xl
                   hover:scale-110 hover:shadow-green-500/50 transition-all"
      >
        <FaWhatsapp size={26} />
      </a>
    </div>
  );
}
