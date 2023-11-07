import Header from "../../components/Header"
import Footer from "../../components/Footer"
import PostList from "../posts"

export default function Home() {
  return (
    <div>
      <Header />

      <PostList />
      <Footer />
    </div>
  )
}