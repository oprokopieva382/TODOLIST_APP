import { useEffect } from "react";
import "./App.css";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import { useAppDispatch, useAppSelector } from "./store";
import { RequestStatusType } from "./app-reducer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { Login } from "../features/TodolistsList/Login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  initializeAppTC,
  logOutTC,
  loginTC,
} from "../features/TodolistsList/Login/auth-reducer";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const status = useAppSelector<RequestStatusType>((state) => state.app.status);
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
  const isInitialized = useAppSelector<boolean>(
    (state) => state.app.isInitialized
  );

  const logout = () => {
    dispatch(logOutTC());
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
     dispatch(initializeAppTC())
   }, []);

  if (!isInitialized) {
   
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">TodoList</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logout} variant="outlined">
              Log out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList />} />
          <Route path={"/login"} element={<Login />} />
          <Route
            path={"/404"}
            element={<h1>404: PAGE NOT FOUND</h1>}
          />
          <Route path="/*" element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;