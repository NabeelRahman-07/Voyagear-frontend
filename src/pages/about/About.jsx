import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaMountain, FaUsers, FaRecycle, FaAward, FaShippingFast,FaHeart,FaGlobeAmericas,FaLeaf,FaShieldAlt} from 'react-icons/fa';
import { motion } from 'framer-motion';

function About() {
  // Core values for the business
  const coreValues = [
    {
      icon: <FaCompass className="text-2xl" />,
      title: "Adventure First",
      description: "Every product is designed with real adventures in mind. We test gear in extreme conditions so you don't have to.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: <FaMountain className="text-2xl" />,
      title: "Quality Built",
      description: "Premium materials and craftsmanship ensure your gear lasts through countless journeys and memories.",
      color: "from-emerald-500 to-green-400"
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Community Driven",
      description: "We listen to our adventurers' feedback to constantly improve and innovate our products.",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: <FaRecycle className="text-2xl" />,
      title: "Sustainable Practices",
      description: "Eco-friendly materials and ethical manufacturing are at the heart of our production process.",
      color: "from-teal-500 to-emerald-400"
    }
  ];

  // Stats
  const stats = [
    { icon: <FaGlobeAmericas />, value: "50K+", label: "Adventurers Served" },
    { icon: <FaLeaf />, value: "85%", label: "Eco-Friendly Products" },
    { icon: <FaAward />, value: "4.9/5", label: "Customer Rating" },
    { icon: <FaShippingFast />, value: "3-5 Days", label: "Avg. Delivery" }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Mountain landscape"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Our Journey Begins With Yours
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
          >
            Empowering adventures with premium, sustainable travel gear since 2020
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
              <div className="space-y-4">
                <p className="text-gray-700 text-lg leading-relaxed">
                  At <span className="font-bold text-secondary">Voyagear</span>, we believe that great adventures start with great gear. 
                  Our mission is to provide explorers with equipment that's not only durable and functional 
                  but also environmentally responsible.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  We're committed to making quality outdoor gear accessible while minimizing our ecological 
                  footprint. Every product is designed to enhance your journey and withstand the test of time.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white p-3 rounded-full">
                    <FaCompass className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-3">Our Vision</h3>
                    <p className="text-gray-700">
                      To become the most trusted adventure gear brand in Asia, inspiring a generation 
                      of responsible explorers who value quality, sustainability, and authentic experiences.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/*  Values section*/}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from product design to customer service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${value.color} text-white mb-4`}>
                  {value.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-primary mb-2 flex justify-center">
                  <div className="text-3xl">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
                    <FaLeaf className="text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Our Green Promise</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-emerald-500 mt-1">✓</div>
                    <p className="text-gray-700">Recycled materials in 85% of our products</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-emerald-500 mt-1">✓</div>
                    <p className="text-gray-700">Carbon-neutral shipping with offset programs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-emerald-500 mt-1">✓</div>
                    <p className="text-gray-700">Ethical manufacturing partners worldwide</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-emerald-500 mt-1">✓</div>
                    <p className="text-gray-700">Repair & recycle program for old gear</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">Why Choose Voyagear?</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <FaShieldAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">2-Year Warranty</h3>
                    <p className="text-gray-600">Comprehensive warranty on all products</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <FaHeart className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Adventurer Support</h3>
                    <p className="text-gray-600">24/7 customer care for gear advice</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <FaShippingFast className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Free Shipping</h3>
                    <p className="text-gray-600">On orders above ₹1999 across India</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Join Our Adventure Community</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Be part of thousands of explorers who trust Voyagear for their adventures
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
              >
                Shop Our Gear
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-primary transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;