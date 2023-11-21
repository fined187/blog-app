import React, { useContext, useEffect, useState } from "react"
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PostProps } from "./PostList";

export default function PostForm() {
  const params = useParams();
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [post, setPost] = useState<PostProps | null>(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getPost = async(id: string) => {
    try {
      if (id) {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        setPost({ id: docSnap.id, ...docSnap.data() as PostProps});
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!params?.id) return;
    getPost(params?.id);
  }, [params?.id]);

  useEffect(() => {
    if (post) {
      setTitle(post?.title);
      setSummary(post?.summary);
      setContent(post?.content);
    }
  }, [post]);


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (post && post?.id) {
      // firestore 데이터 수정
      try {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          title: title,
          summary: summary,
          content: content,
          updatedAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
        toast.success("게시글이 성공적으로 수정되었습니다.");
        navigate(`/posts/${post?.id}`);
      } catch (error) {
        console.log(error);
        toast.error("게시글 수정에 실패하였습니다.");
      }
    } else {
      try {
        //  firestore 데이터 추가
        await addDoc(collection(db, "posts"), {
          title: title,
          summary: summary,
          content: content,
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
        });
        toast.success("게시글이 성공적으로 작성되었습니다.");
        navigate("/");
      } catch (error) {
        console.log(error);
        toast.error("게시글 작성에 실패하였습니다.");
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } 
    if (name === "summary") {
      setSummary(value);
    }
    if (name === "content") {
      setContent(value);
    }
  };

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form__block">
        <label htmlFor="title">제목</label>
        <input type="text" id="title" name="title" value={title} required onChange={onChange} />
      </div>
      <div className="form__block">
        <label htmlFor="summary">요약</label>
        <input type="text" id="summary" name="summary" value={summary} required onChange={onChange} />
      </div>
      <div className="form__block">
        <label htmlFor="content">내용</label>
        <textarea id="content" name="content" required value={content} onChange={onChange} />
      </div>
      <div className="form__block">
        <input type="submit" value={post ? '수정' : '제출'} className="form__btn--submit" />
      </div>
    </form>
  )
};