import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShippingFast, FaShieldAlt, FaLeaf, FaTag, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../../api/axiosInstance';

function Hero() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero carousel slides with better images
  const heroSlides = [
    {
      id: 1,
      title: "Explore The World",
      subtitle: "Premium Travel Gear",
      description: "Durable, lightweight equipment for every adventure.",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      cta: "Shop Now",
      path: "/products",
      bgColor: "from-primary to-secondary"
    },
    {
      id: 2,
      title: "Adventure Awaits",
      subtitle: "Outdoor Essentials",
      description: "Everything you need for camping and hiking trips.",
      image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      cta: "Explore Gear",
      path: "/products",
      bgColor: "from-secondary to-accent"
    },
    {
      id: 3,
      title: "Travel In Style",
      subtitle: "Smart Packing",
      description: "Organized travel solutions for modern explorers.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      cta: "View Collection",
      path: "/products",
      bgColor: "from-accent to-primary"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const products = response.data;
        setFeaturedProducts(products.slice(0, 6));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const features = [
    {
      icon: <FaShippingFast className="text-2xl" />,
      title: 'Free Shipping',
      description: 'On orders above ₹1999'
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: '2-Year Warranty',
      description: 'Quality guaranteed'
    },
    {
      icon: <FaLeaf className="text-2xl" />,
      title: 'Eco-Friendly',
      description: 'Sustainable materials'
    },
    {
      icon: <FaTag className="text-2xl" />,
      title: 'Best Price',
      description: 'Price match guarantee'
    }
  ];

  const brands = [
    { name: 'American Tourister', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Logo_American_Tourister.png' },
    { name: 'Coleman', logo: 'https://1000logos.net/wp-content/uploads/2021/05/Coleman-logo.png' },
    { name: 'Emmi', logo: 'https://static.wixstatic.com/media/1a7e28_7616456a71cf4fa3938b64ab1d98fbf1~mv2.jpg' },
    { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png' },
    { name: 'Quechua', logo: 'https://wp.logos-download.com/wp-content/uploads/2016/06/Quechua_logo-700x100.png' },
    { name: 'Columbia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Columbia_Sportswear_Co_logo.svg/1280px-Columbia_Sportswear_Co_logo.svg.png' },
    { name: 'North Face', logo: 'https://1000logos.net/wp-content/uploads/2017/05/North-Face-Logo-768x408.png' },
    { name: 'Patagonia', logo: 'https://logos-world.net/wp-content/uploads/2020/05/Patagonia-Mountain-logo.png' }
  ];

  return (
    <div className="bg-background">
      <section className="relative h-[80vh] md:h-[85vh] overflow-hidden animate-fadeIn">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-70`}></div>
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center animate-slideIn">
              <div className="text-white max-w-xl">
                <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 text-white/90 animate-pulse">
                  {slide.subtitle}
                </h2>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slideUp">
                  {slide.title}
                </h1>
                <p className="text-lg mb-8 text-white/90 animate-slideUp delay-100">
                  {slide.description}
                </p>
                <Link
                  to={slide.path}
                  className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all duration-300 hover:scale-105 animate-bounceIn"
                >
                  {slide.cta}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
        >
          <FaChevronLeft className="text-xl" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
        >
          <FaChevronRight className="text-xl" />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </section>

      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/5 transition-all duration-300 hover:scale-105 group animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-secondary group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">Popular picks from our collection</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slideUp group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-500 text-sm mb-1">{product.category}</p>
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">₹{product.price}</span>
                      <span className="text-secondary font-medium group-hover:translate-x-1 transition-transform">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8 animate-fadeIn">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105"
            >
              View All Products
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Explore Our Brands
            </h2>
            <p className="text-gray-600">Trusted by adventurers worldwide</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex items-center justify-center">
                <div className="w-full h-64 md:h-full rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <img
                    src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Adventure"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="p-8 text-white">
                <h2 className="text-2xl font-bold mb-4 animate-slideUp">
                  Our Story
                </h2>
                <p className="text-white/90 mb-6 leading-relaxed animate-slideUp delay-100">
                  Voyagear was born from a passion for exploration. We curate the finest travel essentials
                  to make every journey memorable. From urban adventures to wilderness expeditions,
                  we've got you covered with gear that combines style, durability, and functionality.
                </p>
                <p className="text-white/90 mb-8 leading-relaxed animate-slideUp delay-200">
                  Our mission is simple: equip adventurers with reliable gear that lets them focus on
                  what matters most - the experience.
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all duration-300 hover:scale-105 animate-bounceIn"
                >
                  Learn About Us
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Why Choose Voyagear?
            </h2>
            <p className="text-gray-600">Experience the difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '🌍', title: 'Adventure Ready', desc: 'Gear tested by explorers worldwide' },
              { emoji: '💎', title: 'Premium Quality', desc: 'Durable materials built to last' },
              { emoji: '🚚', title: 'Fast Delivery', desc: 'Get your gear in 3-5 days' }
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 animate-bounce">{item.emoji}</div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white animate-fadeIn">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-slideUp">
            Start Your Adventure Today
          </h2>
          <p className="text-lg mb-8 text-white/90 animate-slideUp delay-100">
            Join thousands of explorers who trust Voyagear
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105 animate-pulse"
          >
            Shop now.
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Hero;