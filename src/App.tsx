import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { Home } from "./pages/Home";
import { Menu } from "./pages/Menu";
import { Visit } from "./pages/Visit";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar onOpenCart={() => setCartOpen(true)} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/visit" element={<Visit />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </BrowserRouter>
    </CartProvider>
  );
}
