import { authService, dbService } from "fbase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = ({ userObj, refreshUser }) => {
    const history = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history("/");
    };

    const onChange = (event) => {
        const {
            target: { value }
        } = event;
        setNewDisplayName(value);
    };

/*
    const getMyNweets = async () => {
        const nweets = await dbService
        .collection("nweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt", "asc")         // 트윗목록 오름차순
        .get();       // 쿼리문을 통해 얻은 결과물을 가져오는 함수

        console.log(nweets.docs.map((doc) => doc.data()));
    }

    useEffect(() => {
        getMyNweets();
    }, []);
*/
const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
        await userObj.updateProfile({ displayName: newDisplayName });
        refreshUser();
    }
};
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange = {onChange} type="text" placeholder="Display name" value = {newDisplayName} autoFocus className="formInput" />
                <input type ="submit" value="Update Profile"  className="formBtn" style={{ marginTop: 10 }} />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                LogOut
            </span>
        </div>
    );
};
export default Profile;