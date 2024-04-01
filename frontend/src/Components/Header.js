import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Components/UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:5002/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  async function logout() {
    const response = await fetch("http://localhost:5002/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.status === 200) {
      setUserInfo(null);
    } else {
      console.error(response.statusText);
    }
  }
  const username = userInfo?.username;
  return (
    <header>
      <Link to="/" className="logo">
        {" "}
        Blog
      </Link>
      <nav>
        {username && (
          <>
            <span>Hello, {username}</span>
            <Link to="/create">Creae new Post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="login">
              Login
            </Link>
            <Link to="/register" className="register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
