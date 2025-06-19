import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home";
import { DataInitalizer } from "./lib/hooks/data-intializer";
function App() {
  return (
    <>
      <DataInitalizer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
