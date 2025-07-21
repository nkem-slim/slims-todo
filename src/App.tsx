import { type JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TaskDashboard from "./pages/TaskDashboard";
import SingleTaskPreview from "./pages/SingleTaskPreview";

function App(): JSX.Element {
  // const { task_id } = useParams<{ task_id: string }>();
  // const title: string | null = new URLSearchParams(window.location.search).get("title");

  return (
    <BrowserRouter>
      <Routes>
        {/* The path is the path of the url, the element is what you wanna render on the page */}
        <Route path="/" element={<TaskDashboard />} />
        <Route path="task/:task_id" element={<SingleTaskPreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
