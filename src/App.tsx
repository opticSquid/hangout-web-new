import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home";
import BottomBarComponent from "./components/bottom-bar";
import { ThemeProvider } from "./lib/hooks/theme-provider";
function App() {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen">
        <main className="h-11/12">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </main>
        <footer>
          <BottomBarComponent />
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
