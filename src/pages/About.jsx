import React from 'react';

function About() {
  return (
    <section className="bg-gray-50 py-20 px-6 md:px-24">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-8">About Us</h2>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to <span className="font-semibold text-orange-600">CozyNest Furniture</span>, where comfort meets elegance.
        </p>
        <p className="text-md text-gray-600 mb-6">
          We are passionate about transforming houses into beautiful homes with our exquisite collection of handcrafted furniture.
          Established in 2015, CozyNest has grown from a small workshop into a leading name in the world of modern, sustainable furniture.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 text-left">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to deliver high-quality, stylish, and sustainable furniture that enhances everyday living.
              We are committed to excellence in craftsmanship and dedicated to helping our customers create spaces they love.
              Every design we offer is built with intention, passion, and care.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              We envision a world where every home reflects the uniqueness of its owner.
              By blending tradition with innovation, we aim to inspire better living through functional, aesthetic, and eco-conscious furniture.
              We see furniture not just as pieces—but as experiences that elevate lifestyle.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose CozyNest?</h3>
          <ul className="text-gray-700 space-y-2 list-disc list-inside max-w-xl mx-auto text-left">
            <li>100% handcrafted using ethically sourced wood and fabrics</li>
            <li>Custom furniture options tailored to your taste</li>
            <li>Free delivery & professional installation services</li>
            <li>Reliable customer support & easy returns</li>
            <li>Trusted by over 10,000 happy homeowners</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
    