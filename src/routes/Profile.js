import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { authService, dbService } from "../fbase";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const [records, setRecord] = useState([]);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getGameRecord = async () => {
    const dbRecord = await dbService
      .collection("game_record")
      .where("userUid", "==", userObj.uid)
      .get();
    dbRecord.forEach((doc) => {
      const recordObject = {
        ...doc.data(),
        id: doc.id,
      };
      setRecord((prev) => [recordObject, ...prev]);
    });
  };

  useEffect(() => {
    getGameRecord();
  }, []);

  return (
    <center>
      <div>
        {records.map((record) => (
          <div key={record.id}>
            <h4>
              {record.winner ? "Win" : "Lose"} {record.myScore}:{record.aiScore}
            </h4>
            <h4>When: {record.endedAt}</h4>
          </div>
        ))}
      </div>
      <button onClick={onLogOutClick}>Log Out</button>
    </center>
  );
};

export default Profile;
