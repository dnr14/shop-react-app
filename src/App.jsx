import Header from "components/Header";
import Home from "components/Home";
import HouseholdledgerInset from "components/HouseholdledgerInset";
import { BrowserRouter, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Route path="/" exact component={Home} />
        <Route path="/insert" component={HouseholdledgerInset} />
      </BrowserRouter>
    </>
  );
}

export default App;