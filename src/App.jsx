import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ManageTemple from "./manageTemple";
import { Container } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import ManageNameplate from "./ManageNameplate";

const App = () => {
  const nav = useNavigate();
  return (
    <Container className="pt-3">
      <h1>Hello Admin,</h1>
      <br />
      <Button variant="primary" onClick={() => nav("/manage-temple", {replace: true})}>Manage Temples</Button>{' '}
      <Button variant="primary" onClick={() => nav("/manage-nameplate", {replace: true})}>Manage Name Plates</Button>{' '}
      <Routes>
          <Route path="/manage-temple" element={<ManageTemple/>}/>
          <Route path="/manage-nameplate" element={<ManageNameplate/>}/>
      </Routes>
    </Container>
  );
};

export default App;
