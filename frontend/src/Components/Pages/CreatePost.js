import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "./Editor";

// const modules = {
//   toolbar: [
//     [{ header: [1, 2, false] }],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [
//       { list: "ordered" },
//       { list: "bullet" },
//       { indent: "-1" },
//       { indent: "+1" },
//     ],
//     ["link", "image"],
//     ["clean"],
//   ],
// };
// const formats = [
//   "header",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "indent",
//   "link",
//   "image",
// ];

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(event) {
    event.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    data.append("file", files[0]);
    const response = await fetch("http://localhost:5002/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    } else {
      console.error(response);
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div>
      <form onSubmit={createNewPost}>
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
        <Editor onChange={setContent} value={content}>
          {" "}
        </Editor>
        <button style={{ marginTop: "5px" }}>Create Post</button>
      </form>
    </div>
  );
}
