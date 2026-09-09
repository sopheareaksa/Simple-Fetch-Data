import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import Dashboard from "./pages/Dashboard";
import Layout from "./component/Layout/Layout";
import ManageCRUD from "./pages/ManageCRUD";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element = {<ManageCRUD/>}></Route>
            <Route path="product" element ={<ProductPage/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
