import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import BottomBarComponent from "./components/bottom-bar";
import { useAccessTokenContextHandler } from "./lib/hooks/useAccessToken";
import { DeviceDetailsProvider } from "./lib/provider/device-details-provider";
import { ThemeProvider } from "./lib/provider/theme-provider";
import { registerAccessTokenHandlers } from "./lib/utils/axios-instance";
import CommentPage from "./pages/comment";
import CreatePage from "./pages/create";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import ReplyPage from "./pages/reply";
import SigninPage from "./pages/signin";
import SignUpPage from "./pages/signup";
function App() {
  const accessTokenContextHandler = useAccessTokenContextHandler();
  useEffect(() => {
    registerAccessTokenHandlers(
      accessTokenContextHandler.getAccessToken,
      accessTokenContextHandler.setAccessToken
    );
  }, [accessTokenContextHandler]);
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
                <Route
                  path="/post/:postId/comments"
                  element={<CommentPage />}
                />
                <Route
                  path="/post/:postId/comments/reply/:commentId"
                  element={<ReplyPage />}
                />
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
