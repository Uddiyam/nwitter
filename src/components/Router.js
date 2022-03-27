import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "./Navigation";
import Profile from "routes/Profile";

const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />} {/* &&왼쪽의 조건이 true면 오른쪽에 있는 값 반환 */}
            <Routes> {/* Switch가 Routes로 바뀜 */}
                {isLoggedIn ? (
                    <>
                    <Route exact path = '/' element = {<div className="home_style"><Home userObj={userObj} /></div>}/>
                    <Route exact path = "/profile" element = {<div className="home_style"><Profile refreshUser={refreshUser} userObj={userObj} /></div>}/>
                    </>
                ) : (
                    <Route exact path = '/' element = {<Auth/>}/>
                )}
               {/* <Route path = '*' element={<Navigate to ='/'/>}/>      로그아웃 후 첫 화면으로 돌아가는 방법1*/}
            </Routes>
        </Router>
    );
};

export default AppRouter;