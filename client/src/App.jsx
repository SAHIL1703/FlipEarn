import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MarketPlace from "./pages/MarketPlace.jsx";
import MyListings from "./pages/MyListings.jsx";
import ListingDetails from "./pages/ListingDetails.jsx";
import ManageListing from "./pages/ManageListing.jsx";
import Messages from "./pages/Messages.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Loading from "./pages/Loading.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatBox from "./components/ChatBox.jsx";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/admin/Layout.jsx"
import Dashboard from "./pages/admin/Dashboard.jsx";
import AllListings from "./pages/admin/AllListings.jsx";
import CredentialChange from "./pages/admin/CredentialChange.jsx";
import CredentialVerify from "./pages/admin/CredentialVerify.jsx";
import Transactions from "./pages/admin/Transactions.jsx";
import Withdrawal from "./pages/admin/Withdrawal.jsx";

const App = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Toaster />
      {!pathname.includes("/admin") && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/listing/:listingId" element={<ListingDetails />} />
        <Route path="/create-listing" element={<ManageListing />} />
        <Route path="/edit-listing/:id" element={<ManageListing />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="verify-credentials" element={<CredentialVerify />} />
          <Route path="change-credentials" element={<CredentialChange />} />
          <Route path="list-listings" element={<AllListings />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="withdrawal" element={<Withdrawal />} />
        </Route>
      </Routes>
      <ChatBox />
    </div>
  );
};

export default App;
