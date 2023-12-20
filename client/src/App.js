import { Route, Routes, Outlet } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Layout />}>
        <Route index element={<AuthPage />} />
        <Route path={"/home"} element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
