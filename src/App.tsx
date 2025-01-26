import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Layout from "./layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route element={<IndexPage />} path="/" />
      </Routes>
    </Layout>
  );
}

export default App;
