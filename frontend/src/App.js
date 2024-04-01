import "./App.css";
import CreatePost from "./Components/Pages/CreatePost";
import EditPost from "./Components/Pages/EditPost.js";
import IndexPage from "./Components/Pages/IndexPage";
import LoginPage from "./Components/Pages/LoginPage";
import PostPage from "./Components/Pages/PostPage.js";
import RegisterPage from "./Components/Pages/RegisterPage";
import { UserContextProvider } from "./Components/UserContext";
import Layout from "./Layout/Layout.js";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/create" element={<CreatePost />}></Route>
          <Route path="/post/:id" element={<PostPage />}></Route>
          <Route path="/edit/:id" element={<EditPost />}></Route>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}
export default App;
