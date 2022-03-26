import { useState } from "react";
import { authService, firebaseInstance } from "fbase";

const AuthForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const{
            target: {name, value}
        } = event;
        if (name === "email"){
            setEmail(value);
        }
        else if(name === "password"){
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();  // submit이 페이지를 새로고침하는것을 막기 위함
        try{
            let data;
            if(newAccount) {
                // create newAccount
                data = await authService.createUserWithEmailAndPassword(email, password);   // 인자로 전달받은 이메일, 비밀번호를 파이어베이스의 데이터베이스에 저장
            }
            else {
                // log in
                data = await authService.signInWithEmailAndPassword(email, password);   // 인자로 전달받은 이메일, 비밀번호를 파이어베이스 데이터베이스에 전달하여 확인 후 로그인 할 수 있게 해줌
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign In" : "Create Account"}
            </span>
        </>
    );
};

export default AuthForm;