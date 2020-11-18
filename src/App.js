import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Nav from "./home-components/Nav";
import Banner from "./home-components/Banner";
import About from "./home-components/About";
import Footer from "./home-components/Footer";
import Trips from "./pages/Trips/Trips";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Teams from "./pages/Teams/Teams";
import Dash from "./pages/Dashboard/Dash";
import API from "./utils/API";

function App() {
  const [user, setUser] = useState(true);
  const [loginFormState, setLoginFormState] = useState({
    email: "",
    password: ""
  })
  const [profileState, setProfileState] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    trips: [],
    id: '',
    isLoggedIn: false
  })

  useEffect(() => {
    const token = localStorage.getItem("token");
    API.getProfile(token).then(profileData => {
      if (profileData) {
        setProfileState({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          position: profileData.position,
          trips: profileData.trips,
          id: profileData._id,
          isLoggedIn: true
        })
      } else {
        localStorage.removeItem("token");
        setProfileState({
          first_name: '',
          last_name: '',
          email: '',
          position: '',
          trips: [],
          id: '',
          isLoggedIn: false
        })
      }
    })
  }, [])

  const handleInputChange = event => {
    event.preventDefault();
    const {name,value} = event.target;
    setLoginFormState({
      ...loginFormState,
      [name]: value
    })
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    API.login(loginFormState).then(newToken => {
      localStorage.setItem("token", newToken.token)
      API.getProfile(newToken.token).then(profileData => {
        setProfileState({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        position: profileData.email,
        trips: profileData.trips,
        id: profileData._id,
        isLoggedIn: true
        })
      })
    })
  }

  return (
    <Router>
      <div className="app">
        <Nav />
        <Switch>
          <Route exact path="/">
            {!profileState.isLoggedIn ? (
              <Login
              inputChange={handleInputChange}
              loginFormState={loginFormState}
              handleSubmit={handleFormSubmit}
              />
            ) : (
              <div>
                <Banner />
                <About />
                <Footer />
              </div>
            )}
          </Route>
          <Route path="/trips" component={Trips} />
          <Route path="/signup" component={Signup} />
          <Route path="/teams" component={Teams} />
          <Route path="/dashboard" component={Dash} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
