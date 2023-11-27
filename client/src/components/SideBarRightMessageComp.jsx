import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import '../css/sideBarRightMsgComp/sideBarRightMsgComp.css';

const SideBarRightMessageComp = () => {
  const [msgData, setMsgData] = useState([{}]);
  const [findMsg, setFindMsg] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);

  let runNumber = 1;

  const getAllMsgs = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const msgs = await res.json();
      const sortedMsg = msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMsgData(sortedMsg);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const handleFindMsg = () => {
    const dataByMsgId = msgData.filter((msg) => msg?._id.toLowerCase().includes(findMsg.trim().toLowerCase()));
    const dataByChatId = msgData.filter((msg) => msg?.chatId.toLowerCase().includes(findMsg.trim().toLowerCase()));
    const dataBySenderId = msgData.filter((msg) => msg?.senderId.toLowerCase().includes(findMsg.trim().toLowerCase()));

    let combindPostArr = [];

    if (dataByMsgId.length !== 0) {
      combindPostArr.push(...dataByMsgId);
    }
    if (dataByChatId.length !== 0) {
      combindPostArr.push(...dataByChatId);
    }
    if (dataBySenderId.length !== 0) {
      combindPostArr.push(...dataBySenderId);
    }

    setMsgData(combindPostArr);
  }

  const handleFindMsgOnChange = (e) => {
    setFindMsg(e.target.value);
  }

  const handleBlockMsg = async (msgId, msgStatus) => {
    try {
      if (msgStatus) {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการยกเลิกบล็อคไหม?",
          text: "ถ้ายกเลิกบล็อคข้อความดังกล่าวจะแสดงปกติ",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockMsg`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              msgId
            })
          });
          Swal.fire({
            title: "ยกเลิกบล็อคสำเร็จ!",
            text: "ข้อความนี้ถูกแสดงตามปกติ",
            icon: "success"
          });
        }
      } else {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการบล็อคไหม?",
          text: "ถ้าบล็อคข้อความดังกล่าวจะไม่ถูกแสดง",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockMsg`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              msgId
            })
          });
          Swal.fire({
            title: "บล็อคสำเร็จ!",
            text: "ข้อความนี้ไม่ถูกแสดง",
            icon: "success"
          });
        }
      }

      getAllMsgs();
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  useEffect(() => {
    getAllMsgs();
  }, []);

  useEffect(() => {
    if (!findMsg.trim()) {
      setDisableBtn(true);
      getAllMsgs();
    } else {
      setDisableBtn(false);
    }
  }, [findMsg]);

  return (
    <div className='conainer-sidebar-right-msg-comp'>
      <div className="second-container-sidebar-right-msg-comp">
        <h2>แสดงข้อความทั้งหมด</h2>
        <InputGroup className="mb-3">
          <Form.Control style={{ maxWidth: "350px", boxShadow: "none" }} className='focus-ring focus-ring-light'
            placeholder="ไอดีข้อความ / ไอดีห้องแชท / ไอดีผู้ส่งข้อความ"
            onChange={(e) => handleFindMsgOnChange(e)}
          />
          <Button variant="primary" onClick={handleFindMsg} disabled={disableBtn}>
            ค้นหา
          </Button>
        </InputGroup>
        <div className="container-showall-msgs">
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th className='text-center'>ลำดับ</th>
                <th className='text-center'>ไอดีข้อความ</th>
                <th className='text-center'>ไอดีห้องแชท</th>
                <th className='text-center'>ไอดีผู้ส่งข้อความ</th>
                <th className='text-center'>รายละเอียด</th>
                <th className='text-center'>รูป</th>
                <th className='text-center'>บล็อค</th>
                <th className='text-center'>บันทึกล่าสุด</th>
                <th className='text-center'>แก้ไขล่าสุด</th>
                <th className='text-center'>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {msgData.length === 0 &&
                <tr>
                  <td colSpan={10} className='text-center'>ไม่พบข้อมูล</td>
                </tr>
              }
              {msgData.map((msg, index) => (
                <tr key={index}>
                  <td className='text-center'>{runNumber++}</td>
                  <td className='text-center'>{msg?._id}</td>
                  <td className='text-center'>{msg?.chatId}</td>
                  <td className='text-center'>{msg?.senderId}</td>
                  <td className='text-center'>{msg?.chatMsg === "" ? "ไม่มีข้อมูล" : msg?.chatMsg}</td>
                  <td className='text-center'>
                    <div className='d-flex flex-column gap-2'>
                      {msg?.chatImages?.length === 0
                        ?
                        <span>ไม่มีข้อมูล</span>
                        :
                        msg?.chatImages?.map((img, index) => (
                          <a key={index} href={`${process.env.REACT_APP_SERVER_DOMAIN}/chatImg/${img}`} target='_blank' rel='noreferrer'>{img}</a>
                        ))
                      }
                    </div>
                  </td>
                  <td className='text-center'>{msg?.isBlock ? "บล็อค" : "ปกติ"}</td>
                  <td className='text-center'>{msg?.createdAt !== "" && new Date(msg?.createdAt).toLocaleDateString("th")}</td>
                  <td className='text-center'>{msg?.updatedAt !== "" && new Date(msg?.updatedAt).toLocaleDateString("th")}</td>
                  <td className='text-center'>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      {msg?._id && <Button onClick={() => handleBlockMsg(msg?._id, msg?.isBlock)} variant={msg?.isBlock ? "warning" : "danger"} >{msg?.isBlock ? "ยกเลิก" : "บล็อค"}</Button>}
                    </div>
                  </td>
                </tr>
              ))
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default SideBarRightMessageComp;