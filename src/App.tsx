
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import Arquivos from "./pages/Arquivos";
import NotFound from "./pages/NotFound";
import { SecureAuthProvider } from "./hooks/useSecureAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecureAuthProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/servicos" element={<Services />} />
                <Route path="/quem-somos" element={<About />} />
                <Route path="/suporte" element={<Support />} />
                <Route path="/contato" element={<Contact />} />
          <Route path="/arquivos" element={<Arquivos />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </HashRouter>
      </SecureAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
