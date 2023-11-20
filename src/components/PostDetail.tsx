import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { PostProps } from "./PostList";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import Loader from "./Loader";

export default function PostDetail() {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();
  const { user } = useContext(AuthContext);

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

  const handleDelete = () => {
    console.log("삭제");
  }

  useEffect(() => {
    if (!params?.id) return;
    getPost(params?.id);
  }, [params?.id])

  return (
    <div className="post__detail">
      {post ? (
        <div className="post__box">
          <div className="post__title">{post?.title}</div>
          <div className="post__profile-box">
            <div className="post__profile" />
            <div className="post__author-name">{user?.email}</div>
            <div className="post__date">{post?.createdAt}</div>
          </div>
          <div className="post__utils-box">
            <div className="post__delete" role="presentation" onClick={handleDelete}>삭제</div>
            <div className="post__edit">
              <Link to={`/posts/edit/${post?.id}`}>
                수정
              </Link>
            </div>
          </div>
          <div className="post__text post__text--pre-wrap">
            {post?.content}
          </div>
        </div>
      ): (<Loader />)}
    </div>
  );
}
