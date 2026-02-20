import { useRoutes } from "react-router-dom";
import routes from "./routes.jsx";
import ToastContainer from "../components/ui/ToastContainer.jsx";

export default function App() {
  const element = useRoutes(routes);
  return (
    <>
      {element}
      <ToastContainer />
    </>
  );
}
