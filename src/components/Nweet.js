import { dbService, storageService } from "fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);  // 수정버튼을 클릭했을 때 입력란, 버튼 나타나는 기준점
    const [newNweet, setNewNweet] = useState(nweetObj.text);    // 입력란에 기존 트윗이 보이도록 초깃값 관리

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            if (nweetObj.attachmentUrl !== "")
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();   // refFromURL 함수를 사용하면 attachmentUrl만으로도 스토리지에서 해당 파일의 위치를 팢아 삭제 할 수 있다
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onChange = (event) => {
        const {
            target: { value }
        } = event;
        setNewNweet(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });    // 파이어 스토어에 문서를 찾아서 업데이트 요청
        setEditing(false);
    }

    return (
        <div className="nweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input onChange = {onChange} value = {newNweet} required placeholder="Edit your nweet" autoFocus className="formInput" />
                        <input type="submit" value="Update Nweet" className="formBtn" />
                    </form>
                    <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && (
                        <img src={nweetObj.attachmentUrl} width = "50px" height="50px" />
                    )}
                    {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Nweet;