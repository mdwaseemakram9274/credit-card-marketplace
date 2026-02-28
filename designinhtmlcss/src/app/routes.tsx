import { createHashRouter } from "react-router";
import HomePage from "./pages/HomePage";
import CreditCardDetailPage from "./pages/CreditCardDetailPage";
import LenderPage from "./pages/LenderPage";
import AdminPage from "./pages/AdminPage";

export const router = createHashRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/card/:cardId",
    Component: CreditCardDetailPage,
  },
  {
    path: "/lender/:lenderId",
    Component: LenderPage,
  },
  {
    path: "/admin",
    Component: AdminPage,
  },
]);