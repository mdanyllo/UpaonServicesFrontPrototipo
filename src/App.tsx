import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Cadastro } from "./pages/cadastro";
import { Prestador } from "./pages/cadastro/prestador";
import { Cliente } from "./pages/cadastro/cliente";
import { LoginPage } from "./pages/login";
import { ResultadosPesquisa } from "./pages/resultadospesquisa";
import { CentralDeAjuda } from "./pages/suporte/centraldeajuda";
import { TermosDeUso } from "./pages/suporte/termosdeuso";
import { PoliticaDePrivacidade } from "./pages/suporte/politicadeprivacidade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/cadastro/prestador" element={<Prestador />} />
          <Route path="/cadastro/cliente" element={<Cliente />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/resultados"element={<ResultadosPesquisa />}/>
          <Route path="/suporte/centraldeajuda" element={<CentralDeAjuda />} />
          <Route path="/suporte/termosdeuso" element={<TermosDeUso/>} />
          <Route path="/suporte/politicadeprivacidade" element={<PoliticaDePrivacidade/>} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
