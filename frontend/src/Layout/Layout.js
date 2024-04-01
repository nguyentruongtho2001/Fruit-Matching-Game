import { Outlet } from "react-router-dom";
import Header from "../Components/Header.js";

export default function Layout() {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
}
