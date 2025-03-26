import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContex";
import { GroupProvider } from "./context/GroupContext";
import { ChatBotProvider } from "./context/BotContext";
import { ToastContainer } from "react-toastify";
import AuthCheck from "./layouts/AuthCheck";
import Home from "./components/Home";
import ChatInterface from "./components/chat/ChatInterface";
import "./App.css";

const AuthComponent = React.lazy(() => import("./components/AuthComponent"));

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {/* <Header/> */}
          <ChatBotProvider>
            <GroupProvider>
              <Suspense
                fallback={
                  <div className="flex h-screen items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                }
              >
                <Routes>
                  <Route
                    path="/auth"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <AuthComponent />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <AuthCheck
                        authenticated={<ChatInterface />}
                        unauthenticated={<Home />}
                      />
                    }
                  />
                </Routes>
              </Suspense>
            </GroupProvider>
          </ChatBotProvider>
        </AuthProvider>
        <ToastContainer />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
