import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./layout";
import DocsPage from "./pages/docs/Docs";
import HomePage from "@/pages/home/Home";
import GeneratePage from "./pages/generate/Generate";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route element={<HomePage />} path="/home" />
        <Route element={<GeneratePage />} path="/generate" />
        <Route element={<DocsPage />} path="/docs" />
      </Routes>
    </Layout>
  );
}

export default App;
