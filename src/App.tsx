import "./App.css";
import Router from "./components/Router";
import { app } from "./firebaseApp";
import { useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "context/ThemeContext";

function App() {
  const auth =getAuth(app);
  //  auth를 체크하기 전에는 loader를 띄워주는 용도
  const [init, setInit] = useState<boolean>(false);
  
  //  auth에 currentUser가 있는지 없는지 체크
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!auth?.currentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  const context = useContext(ThemeContext);

  return (
    <div className={context.theme === 'light' ? 'white' : 'dark'}>
      <ToastContainer />
      {init ? <Router 
        isAuthenticated={isAuthenticated}
      /> : "로딩중..."}
    </div>
  );
};

export default App;