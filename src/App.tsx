import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";

const App = () => (
  <TooltipProvider>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="*" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
