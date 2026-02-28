import { createHashRouter, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import CreditCardDetailPage from "./pages/CreditCardDetailPage";
import LenderPage from "./pages/LenderPage";
import AdminPage from "./pages/AdminPage";

function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash && location.pathname === "/") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

  return <Outlet />;
}

export const router = createHashRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "card/:cardId",
        Component: CreditCardDetailPage,
      },
      {
        path: "lender/:lenderId",
        Component: LenderPage,
      },
      {
        path: "admin",
        Component: AdminPage,
      },
    ],
  },
]);