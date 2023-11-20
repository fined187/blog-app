import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function Profile() {

  const onSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("로그아웃이 완료되었습니다.");
    } catch (error) {
      console.log(error);
      toast.error("로그아웃에 실패하였습니다.");
    }
  };

  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="profile__box">
        <div className="flex__box_lg">
          <div className="profile__image" />
          <div>
            <div className="profile__email">{user?.email}</div>
            <div className="profile__name">{user?.displayName}</div>
          </div>
        </div>
        <div role="presentation" className="profile__logout" onClick={onSignOut}>
          로그아웃
        </div>
      </div>
    </>
  );
};