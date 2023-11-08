export default function PostForm() {
  return (
    <>
      <form action="/post" method="POST" className="form">
        <div className="form__block">
          <label htmlFor="title">제목</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div className="form__block">
          <label htmlFor="summary">요약</label>
          <input type="text" id="summary" name="summary" required />
        </div>
        <div className="form__block">
          <label htmlFor="content">내용</label>
          <textarea id="content" name="content" required />
        </div>
        <div className="form__block">
          <input type="submit" value="제출" className="form__btn--submit" />
        </div>
      </form>
    </>
  )
}