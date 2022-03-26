import AppRouter from "components/Router";
import { useEffect, useState } from 'react';
import { authService } from 'fbase';

function App() {
    const [init, setInit] = useState(false);
   // const [isLoggedIn, setIsLoggedIn] = useState(false); // isLoggedIn은 setIsLoggedIn(함수)으로 관리하는 상태로 취급
    const [userObj, setUserObj] = useState(null); // 로그인한 사람 정보 관리

    useEffect(() => {
        // 로그인한 사람의 정보
        authService.onAuthStateChanged((user) => {
            if (user) {
                //setIsLoggedIn(user);
                setUserObj({
                  uid: user.uid,
                  displayName: user.displayName,
                  updateProfile: (args) => user.updateProfile(args)       // user에서 필요한 것만 뽑기 -> userObj의 크기 줄이기
                });
            } else {
                setUserObj(false);
            }
            setInit(true);
        });
    }, []); // 두번째 인자를 []로 지정해야 컴포넌트가 최초로 렌더링이 완료되었을 때 1회만 동작

    const refreshUser = () => {
        const user = authService.currentUser;
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
          updateProfile: (args) => user.updateProfile(args)
        });
    };

    return ( <
        >
        {
            init ? ( <

                AppRouter
                refreshUser = { refreshUser }
                isLoggedIn = { Boolean(userObj) }
                userObj = { userObj }
                />
            ) : (
                "initializing..."
            )
        } { /* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> {/* JSX에 JS코드 삽입시 중괄호로 감싸줌 */ } <
        />
    );
}

export default App;