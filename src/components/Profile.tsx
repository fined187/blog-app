import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

export default function Profile() {
  const auth = getAuth(app);
  return (
    <>
      <div className="profile__box">
        <div className="flex__box_lg">
          <div className="profile__image" />
          <div>
            <div className="profile__email">{auth.currentUser?.email}</div>
            <div className="profile__name">{auth.currentUser?.displayName}</div>
          </div>
        </div>
        <div role="presentation" className="profile__logout" onClick={async () => {
          try {
            await signOut(auth);
            toast.success("로그아웃이 완료되었습니다.");
          } catch (error) {
            toast.error("로그아웃에 실패하였습니다.");
          }
        }}>
          로그아웃
        </div>
      </div>
    </>
  );
};