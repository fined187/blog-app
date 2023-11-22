import { useContext, useState } from "react";
import { CommentsInterface, PostProps } from "./PostList";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { toast } from "react-toastify";

interface CommentProps {
  post: PostProps;
  getPost: any;
};

export default function Conmments({ post, getPost }: CommentProps) {
  const [comments, setComments] = useState<any>('');
  const { user } = useContext(AuthContext);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target: { name, value } } = e;

    if (name === "comment") {
      setComments(value);
    }
  };

  const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post && post?.id) {
        const postRef = doc(db, "posts", post?.id);
        if(user?.uid) {
          const commentObj = {
            content: comments,
            uid: user?.uid,
            email: user?.email,
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          }
          await updateDoc(postRef, {
            comments: arrayUnion(commentObj),
            updatedAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          })
        }
        await getPost(post?.id);
      }
      toast.success("댓글이 성공적으로 작성되었습니다.")
    } catch (error) {
      console.log(error);
      toast.error("댓글 작성에 실패하였습니다.");
    }
  };

  const handleDeleteComment = async(data: CommentsInterface) => {
    const confirm = window.confirm("해당 댓글을 삭제하겠습니까?");
    if (confirm && post && post?.id) {
      try {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          comments: arrayRemove(data)
        });
        toast.success("댓글이 성공적으로 삭제되었습니다.");
        await getPost(post?.id);
      } catch (error) {
        console.log(error);
        toast.error("댓글 삭제에 실패하였습니다.");
      }
    }
  }

  return (
    <div className="comments">
      <form className="comments__form" onSubmit={onSubmit}>
        <div className="form__block">
          <label htmlFor="comment">댓글입력</label>
          <textarea name="comment" id="comment" value={comments} onChange={onChange} required />
        </div>
        <div className="form__block form__block-reverse">
          <input type="submit" value="입력" className="form__btn-submit" />
        </div>  
      </form>
        <div className="comments__list">
          {post?.comments?.slice(0)?.reverse().map((comments: any) => (
            <div className="comment__box" key={comments?.id}>
              <div className="comment__profile-box">
                <div className="comment__email">{comments?.email}</div>
                <div className="comment__date">{comments?.createdAt}</div>
                {comments?.uid === user?.uid && (
                  <div className="comment__delete" onClick={() => {
                    handleDeleteComment(comments);
                  }}>삭제</div>
                )}
              </div>
              <div className="comment__text">{comments?.content}</div>
            </div>
          ))}
        </div>
    </div>
  )
}