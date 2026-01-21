import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPinterest, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmazonPay } from 'react-icons/fa';
import logo from '../../assets/logo.png'

function Footer() {
  return (
    <footer className="bg-primary text-background mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-background rounded-3xl flex items-center justify-center">
                {/* <span className="text-white text-xl font-bold">✈️</span> */}
                <img 
                    src={logo} 
                    alt="Voyagear Logo" 
                    className="w-full h-full object-contain rounded-3xl "
                />
              </div>
              <span className="text-2xl font-bold tracking-wide">Voyagear</span>
            </Link>
            <p className="text-background/80 text-sm leading-relaxed mb-6">
              Your ultimate destination for premium travel gear and outdoor essentials. 
              We equip adventurers with quality gear for every journey, from weekend 
              camping trips to epic expeditions.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="text-background hover:text-accent transition-colors text-xl">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-background hover:text-accent transition-colors text-xl">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="text-background hover:text-accent transition-colors text-xl">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                 className="text-background hover:text-accent transition-colors text-xl">
                <FaYoutube />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"
                 className="text-background hover:text-accent transition-colors text-xl">
                <FaPinterest />
              </a>
            </div>
          </div>
          {/* Shop Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-background/80 hover:text-accent transition-colors">Backpacks & Bags</Link></li>
              <li><Link to="/products" className="text-background/80 hover:text-accent transition-colors">Tents & Shelters</Link></li>
              <li><Link to="/products" className="text-background/80 hover:text-accent transition-colors">Camp Furniture</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Support</h3>
            <ul className="space-y-2">
              <li className="text-background/80 hover:text-accent transition-colors">Contact Us</li>
              <li><Link to="/faq" className="text-background/80 hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link to="/orders" className="text-background/80 hover:text-accent transition-colors">Orders</Link></li>
              <li className="text-background/80 hover:text-accent transition-colors">Size Guide</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Stay Updated</h3>
            <p className="text-background/80 text-sm mb-4">
              Get exclusive deals, new arrivals, and adventure tips!
            </p>
            <div className="mt-20">
              <p className="text-sm text-secondary font-bold mb-2">We accept</p>
              <div className="flex gap-3 text-2xl">
                <FaCcVisa className="text-background/80" />
                <FaCcMastercard className="text-background/80" />
                <FaCcPaypal className="text-background/80" />
                <FaCcAmazonPay className="text-background/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="mt-12 pt-8 border-t border-secondary/30 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
              <span className="text-secondary">📞</span>
            </div>
            <div>
              <p className="text-sm text-background/60">Call Us</p>
              <p className="font-medium">+91 9000 80 8888</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
              <span className="text-secondary">✉️</span>
            </div>
            <div>
              <p className="text-sm text-background/60">Email Us</p>
              <p className="font-medium">voyagear@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
              <span className="text-secondary">🕒</span>
            </div>
            <div>
              <p className="text-sm text-background/60">Customer Support</p>
              <p className="font-medium">24/7 Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary-dark py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © {new Date().getFullYear()} Voyagear. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
               <p className="text-background/60 hover:text-accent transition-colors"> Privacy Policy
                </p>
                <p className="text-background/60 hover:text-accent transition-colors">
                Terms of Service 
                </p>
            </div>
          </div>
          <p className="text-center text-background/50 text-xs mt-4">
            Voyagear is committed to sustainable outdoor gear. We donate 1% of all sales to environmental conservation.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;