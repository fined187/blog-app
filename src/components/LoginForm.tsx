import { Link } from "react-router-dom";

export default function LoginForm() {
  return (
    <form action="/post" method="POST" className="form form--lg">
      <h1 className="form__title">로그인</h1>
      <div className="form__block">
        <label htmlFor="email">email</label>
        <input type="text" id="email" name="email" required />
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input type="password" id="password" name="password" required />
      </div>
      <div className="form__block">
        계정이 없으신가요? 
        <Link to='/signup' className="form__link">
          회원가입하기
        </Link>  
      </div>
      <div className="form__block">
        <input type="submit" value="로그인" className="form__btn--submit" />
      </div>
    </form>
  )
}