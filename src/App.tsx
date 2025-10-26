import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import BottomBarComponent from "./components/bottom-bar";
import { useAccessTokenContextHandler } from "./lib/hooks/useAccessToken";
import { DeviceDetailsProvider } from "./lib/provider/device-details-provider";
import { ThemeProvider } from "./lib/provider/theme-provider";
import { registerAccessTokenHandlers } from "./lib/utils/axios-instance";
import RouteProtection from "./components/route-protection";
import { Toaster } from "sonner";
import LoadingOverlay from "./components/loading-overlay";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/home"));
const CreatePage = lazy(() => import("./pages/create"));
const ProfilePage = lazy(() => import("./pages/profile"));
const NewProfilePage = lazy(() => import("./pages/new-profile"));
const SigninPage = lazy(() => import("./pages/signin"));
const SignUpPage = lazy(() => import("./pages/signup"));
const CommentPage = lazy(() => import("./pages/comment"));
const ReplyPage = lazy(() => import("./pages/reply"));

function App() {
  const accessTokenContextHandler = useAccessTokenContextHandler();

  useEffect(() => {
    registerAccessTokenHandlers(
      accessTokenContextHandler.getAccessToken,
      accessTokenContextHandler.setAccessToken
    );
  }, [accessTokenContextHandler]);

  return (
    <>
      <ThemeProvider>
        <DeviceDetailsProvider>
          <div className="h-[98vh] md:h-screen w-screen md:w-3/4 lg:w-1/4 mx-auto bg-background md:shadow-xl/40 shadow-foreground">
            <Toaster position="top-center" richColors />
            <BrowserRouter>
              <Suspense fallback={<LoadingOverlay message="loading..." />}>
                <main className="h-15/17 md:h-16/17">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/create"
                      element={
                        <RouteProtection>
                          <CreatePage />
                        </RouteProtection>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <RouteProtection>
                          <ProfilePage />
                        </RouteProtection>
                      }
                    />
                    <Route
                      path="/new-profile"
                      element={
                        <RouteProtection>
                          <NewProfilePage />
                        </RouteProtection>
                      }
                    />
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
              </Suspense>
              <footer className="fixed bottom-0 w-screen md:w-3/4 lg:w-1/4">
                <BottomBarComponent />
              </footer>
            </BrowserRouter>
          </div>
        </DeviceDetailsProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
