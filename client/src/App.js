import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import CreateEventsPage from "./Pages/CreateEventsPage";
import SelectContacts from "./Pages/SelectContacts";
import YourEvents from "./Pages/YourEvents";
import { UserContextProvider } from "./Components/UserContext";
import InvitedEvent from "./Pages/InvitedEventPage";
import EventInfoPage from "./Pages/EventInfoPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path={"/"} element={<Layout />}>
          <Route index element={<AuthPage />} />
          <Route path={"/home"} element={<HomePage />} />
          <Route path={"/events/create"} element={<CreateEventsPage />} />
          <Route path={"/events/create/contacts"} element={<SelectContacts />} />
          <Route path={"/events/your-events"} element={<YourEvents />} />
          <Route path={"/events/event-info/:post_id"} element={<EventInfoPage />} />
          <Route path={"/invited-event/:post_id"} element={<InvitedEvent />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
