import { useState, useEffect } from "react";
import Editor from "./Editor";
import { Navigate, useParams } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5002/post/" + id).then((respone) => {
      respone.json().then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
        setCover(postInfo.cover);
      });
    });
  }, []);

  async function updatePost(event) {
    event.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    data.append("cover", cover);
    data.append("id", id);
    if (files?.[0]) {
      data.set("file", files[0]);
    }

    const respone = await fetch("http://localhost:5002/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (respone.ok) {
      setRedirect(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <div>
      <form onSubmit={updatePost}>
        <input
          type="title"
          placeholder={"title"}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type="summary"
          placeholder={"summary"}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
        <input type="file" onChange={(event) => setFiles(event.target.files)} />
        <Editor onChange={setContent} value={content} />
        <button style={{ marginTop: "5px" }}>Update Post</button>
      </form>
    </div>
  );
}
