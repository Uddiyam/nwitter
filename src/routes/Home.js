import { dbService } from "fbase";
import { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
    const [nweets, setNweets] = useState([]);

    /*
    // async - await 문을 쓰는 함수가 useEffect에 포함되어 있으면, 따로 빼서 정의하고 useEffect에서 함수 실행시켜야 함
    const getNweets = async () => {
        const dbNweets = await dbService.collection("nweets").get();        // get함수는 문서 목록, 여러 정보를 한꺼번에 반환(처음 화면 렌더링 할 때만 실행)
       // dbNweets.forEach((document) => console.log(document.data()));       // forEach 함수 사용하여 data함수로 원하는 데이터 얻기
       dbNweets.forEach((document) => {
           const nweetObject = { ...document.data(), id: document.id};
           setNweets((prev) => [nweetObject, ...prev])     // 전개구문을 이용하여 순회중인 데이터 합치기
       }
       );
    };
    */

    useEffect(() => {
        // getNweets();
        // 실시간 데이터베이스 도입, 실시간으로 트윗 정렬
        dbService.collection("nweets").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data()
            }));
            setNweets(newArray);
        });
    }, []);

    return ( <
        div className = "container" >
        <
        NweetFactory userObj = { userObj }
        /> <
        div style = {
            { marginTop: 30 }
        } > {
            nweets.map((nweet) => ( <
                Nweet key = { nweet.id }
                nweetObj = { nweet }
                isOwner = { nweet.creatorId === userObj.uid }
                />
            ))
        } <
        /div> < /
        div >
    );
};
export default Home;