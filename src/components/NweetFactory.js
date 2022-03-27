import { dbService, storageService } from "fbase";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {

    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async(event) => {
        event.preventDefault(); // 새로고침 방지
        if (nweet === "")       // 입력이 없으면 트윗 업데이트 안되도록
            return;

        let attachmentUrl = ""; // 이후 변수의 값 변경 위해 let으로 변수 정의
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`); // 스토리지, 레퍼런스 순서대로 호출 아이디-> 폴더이름 uuidv4 -> 파일이름
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }

        const nweetObj = {
            text: nweet,
            createdAt: Date.now(), // createdAt의 숫자가 클수록 최근에 등록된 데이터
            creatorId: userObj.uid,
            attachmentUrl
        };

        await dbService.collection("nweets").add(nweetObj); // firestore에 컬렉션, 문서 생성 (nweet 상태의 값을 문서에 text 필드로 저장)

        setNweet(""); // nweet의 상태를 다시 빈 문자열로 초기화
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: { value },
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        // console.log(event.target.files);    파일 관련 내용을 확인하고 싶을 때
        const {
            target: { files }
        } = event;
        const theFile = files[0];
        const reader = new FileReader(); // reader. 으로 FileReader에서 제공하는 함수 사용 가능
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result }
            } = finishedEvent;
            setAttachment(result);
        }; // 파일이 함수로 들어간 이후 결괏값이 나온 다음 상황 가지 ( 이벤트값 => 파일 URL 있음)
        reader.readAsDataURL(theFile); // 파일정보를 인자로 받아서 파일 위치를 URL로 반환 (시점까지 관리해줘야 함)
    };

    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type = "submit" value= "&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            {/* type="file" 은 파일 선택, accept 속성을 이용하여 사진만 첨부할 수 있게 함 */}
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img src={attachment} style={{backgroundImage: attachment}} />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
        );
    };
export default NweetFactory;