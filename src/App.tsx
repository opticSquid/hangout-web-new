import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import BottomBarComponent from "./components/bottom-bar";
import HomePage from "./pages/home";
import { DeviceDetailsProvider } from "./lib/provider/device-details-provider";
import { ThemeProvider } from "./lib/provider/theme-provider";
import CreatePage from "./pages/create";
import ProfilePage from "./pages/profile";
import SigninPage from "./pages/signin";
import SignUpPage from "./pages/signup";
function App() {
  return (
    <ThemeProvider>
      <DeviceDetailsProvider>
        <div className="h-screen w-screen">
          <BrowserRouter>
            <main className="h-16/17">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/sign-in" element={<SigninPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
              </Routes>
            </main>
            <footer className="fixed bottom-0">
              <BottomBarComponent />
            </footer>
          </BrowserRouter>
        </div>
      </DeviceDetailsProvider>
    </ThemeProvider>
  );
}

export default App;
