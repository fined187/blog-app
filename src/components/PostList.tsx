import AuthContext from "context/AuthContext";
import { DocumentData, Query, collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PostListProps {
  hasNavigation?: boolean;
  defaultTab?: TabType;
};

type TabType = "all" | "my";

export interface PostProps {
  id?: string;
  title: string;
  email: string;
  summary: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  uid: string;
}

export default function PostList({ hasNavigation = true, defaultTab = 'all' }: PostListProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState<PostProps | null>(null);

  const getPosts = async() => {
    setPosts([]);
    let postRef = collection(db, "posts");
    let postQuery: Query<DocumentData, DocumentData>;

    if (activeTab === "my" && user) {
      // 내 글
      postQuery = query(postRef, where("uid", "==", user?.uid), orderBy("createdAt", "desc"));
    } else {
      // 전체 글
      postQuery = query(postRef, orderBy("createdAt", "desc"));
    }
    const data = await getDocs(postQuery);
    data?.forEach((doc) => {
      const dataObj = { ...doc.data(), id: doc.id};
      setPosts((prev) => [...prev, dataObj] as PostProps[])
    })
  };

  const handleDelete = async(id: string) => {
    const confirm = window.confirm("정말로 삭제하시겠습니까?");
    if(confirm && id) {
      await deleteDoc(doc(db, "posts", id));
      toast.success("게시글이 성공적으로 삭제되었습니다.");
      getPosts();
    }
  };

  useEffect(() => {
    getPosts();
  }, [activeTab]);

  return (
    <>
      {hasNavigation && (
        <>
          <div className="post__navigation">
            <div role="presentation" className={activeTab === 'all' ?  "post__navigation--active" : ''} onClick={() => {
              setActiveTab("all");
            }}>전체</div>
            <div role="presentation" className={activeTab === 'my' ? "post__navigation--active" : ''} onClick={() => {
              setActiveTab("my");
            }}>나의 글</div>
          </div>
          <div className="post__list">
            {posts?.length > 0 ? posts?.map((post, index) => (
              <div key={post?.id} className="post__box">
                <Link to={`/posts/${post?.id}`}>
                  <div className="post__profile-box">
                    <div className="post__profile" />
                    <div className="post__author-name">{post?.email}</div>
                    <div className="post__date">{post?.createdAt}</div>
                  </div>
                  <div className="post__title">{post?.title}</div>
                  <div className="post__text">{post?.summary}</div>
                </Link>
                {post?.email === user?.email && (
                  <div className="post__utils-box">
                    <div className="post__delete" onClick={() => {
                      handleDelete(post?.id as string)
                    }}>삭제</div>
                    <Link to={`/posts/edit/${post?.id}`}>
                      <div className="post__edit">수정</div>
                    </Link>
                  </div>
                )}
              </div>
            )) : (<div className="post__no-post">게시글이 없습니다.</div>) }
          </div>
        </>
      )}
    </>
  );
};