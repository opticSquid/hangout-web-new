import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home";
import BottomBarComponent from "./components/bottom-bar";
import { ThemeProvider } from "./lib/hooks/theme-provider";
import CreatePage from "./pages/create";
function App() {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen">
        <BrowserRouter>
          <main className="h-16/17">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePage />} />
            </Routes>
          </main>
          <footer className="fixed bottom-0">
            <BottomBarComponent />
          </footer>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
