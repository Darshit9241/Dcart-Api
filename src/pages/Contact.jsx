import React from 'react';

function Contact() {
  return (
    <section className="bg-white py-20 px-6 md:px-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Get in Touch</h2>
        <p className="text-center text-gray-600 mb-12">
          We'd love to hear from you! Whether you have a question about a product, shipping, or anything else, our team is ready to help.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form className="bg-gray-100 p-8 rounded-2xl shadow-md space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                rows="5"
                placeholder="Tell us how we can help..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Store</h3>
              <p>CozyNest Furniture</p>
              <p>123 Comfort Street</p>
              <p>Design City, DC 45678</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
              <p>📞 +1 (123) 456-7890</p>
              <p>Mon - Sat: 10:00am - 6:00pm</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
              <p>📧 support@cozynestfurniture.com</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Follow Us</h3>
              <p>🌐 Instagram, Facebook, Pinterest</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
