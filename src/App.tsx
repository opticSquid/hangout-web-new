import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home";
import BottomBarComponent from "./components/bottom-bar";
import { ThemeProvider } from "./lib/hooks/theme-provider";
function App() {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen">
        <main className="h-16/17">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </main>
        <footer className="fixed bottom-0">
          <BottomBarComponent />
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
