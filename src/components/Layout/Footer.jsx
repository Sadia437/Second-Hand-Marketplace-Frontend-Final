import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Footer() {
  
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const socialLinks = [
    { Icon: FaFacebookF, url: "https://www.facebook.com/yourprofile", color: "hover:text-[#1877F2]" },
    { Icon: FaTwitter, url: "https://www.twitter.com/yourprofile", color: "hover:text-[#1DA1F2]" },
    { Icon: FaInstagram, url: "https://www.instagram.com/yourprofile", color: "hover:text-[#E4405F]" },
    { Icon: FaLinkedinIn, url: "https://www.linkedin.com/in/yourprofile", color: "hover:text-[#0A66C2]" }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white pt-16 mt-20 pb-10 overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <Particles
          id="footer-particles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            particles: {
              number: { value: 60, density: { enable: true, value_area: 800 } },
              color: { value: "#ffffff" },
              shape: { type: "circle" },
              opacity: { value: 0.4, random: true },
              size: { value: 2, random: true },
              links: {
                enable: true,
                distance: 120,
                color: "#ffffff",
                opacity: 0.2,
                width: 1,
              },
              move: { enable: true, speed: 1.2, out_mode: "out" },
            },
            interactivity: {
              events: { onHover: { enable: true, mode: "grab" } },
            },
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          <div className="space-y-5">
            <Link to="/" className="text-2xl font-black text-white flex items-center gap-2">
              <span className="p-2 bg-white/20 backdrop-blur-md rounded-xl shadow-sm">🛍️</span> Secondhand
            </Link>
            <p className="text-sm leading-relaxed font-medium text-white/90">
              আপনার বিশ্বস্ত সেকেন্ড হ্যান্ড মার্কেটপ্লেস। আমরা টেকসই কেনাকাটা এবং পুরনো পণ্যের সঠিক মূল্য নিশ্চিত করি।
            </p>
          </div>

         
          <div>
            <h3 className="text-white font-bold mb-6 tracking-tight text-lg">Quick Links</h3>
            <ul className="space-y-3 text-sm font-semibold text-white/80">
           
              <li>
                <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-all">
                  Home
                </Link>
              </li>
              
              <li><Link to="/products" className="hover:text-white transition-all">Products</Link></li>
              
             
              <li><Link to="/blog" className="hover:text-white transition-all">Blog</Link></li>
              
              <li><Link to="/dashboard" className="hover:text-white transition-all">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 tracking-tight text-lg">Help & Support</h3>
            <ul className="space-y-3 text-sm font-semibold text-white/80">
              <li><Link to="/terms" className="hover:text-white transition-all">Terms of Use</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-all">Privacy Policy</Link></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-all">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 tracking-tight text-lg">Stay Connected</h3>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full bg-white/10 border border-white/30 rounded-xl py-3 px-4 text-white placeholder-white/60 text-sm outline-none focus:bg-white/20 transition-all" 
              />
              <button className="w-full bg-white text-blue-600 font-black py-3 rounded-xl text-sm hover:bg-blue-50 transition-all uppercase tracking-widest">
                Subscribe
              </button>
            </div>
            
            <div className="flex gap-4 mt-6">
              {socialLinks.map((item, index) => (
                <a 
                  key={index} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-10 h-10 bg-white/10 flex items-center justify-center rounded-full text-white hover:bg-white ${item.color} transition-all backdrop-blur-sm shadow-sm`}
                >
                  <item.Icon />
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/20 text-center">
          <p className="text-sm text-white/60 font-bold">
            © {new Date().getFullYear()} Secondhand Marketplace — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}