import React, { useState, useEffect } from "react";
import Product from "../pages/product/Product";
import Banner from "../component/banner/Banner";
import CartBox from "../component/cartbox/CartBox";
import OfferModal from "../component/modal/OfferModal";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    
    if (!hasVisited) {
      // First time visitor - show offer modal
      setShowOfferModal(true);
      // Set flag in localStorage to not show on future visits
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseOfferModal = () => setShowOfferModal(false);

  return (
    <>
      <Banner />
      <Product onCartOpen={handleOpenCart} />
      {isCartOpen && <CartBox />} {/* using isCartOpen */}
      
      {/* Offer Modal for first-time visitors */}
      <OfferModal 
        showModal={showOfferModal} 
        onClose={handleCloseOfferModal} 
      />
    </>
  );
}
