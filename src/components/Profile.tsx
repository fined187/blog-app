import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <>
      <div className="profile__box">
        <div className="flex__box_lg">
          <div className="profile__image" />
          <div>
            <div className="profile__email">example@naver.com</div>
            <div className="profile__name">패스트캠퍼스</div>
          </div>
        </div>
        <Link to="/" className="profile__logout">
          로그아웃
        </Link>
      </div>
    </>
  );
}
