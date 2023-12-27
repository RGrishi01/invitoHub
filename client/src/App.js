import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import CreateEventsPage from "./Pages/CreateEventsPage";
import SelectContacts from "./Pages/SelectContacts";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Layout />}>
        <Route index element={<AuthPage />} />
        <Route path={"/home"} element={<HomePage />} />
        <Route path={"/events/create"} element={<CreateEventsPage />} />
        <Route path={"/events/create/contacts"} element={<SelectContacts />} />
      </Route>
    </Routes>
  );
}

export default App;
