import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "../Main/Main";
import Chat from "../Chat/Chat";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/chat" element={<Chat />} />
  </Routes>
);

export default AppRoutes;