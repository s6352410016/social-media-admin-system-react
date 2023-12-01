import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import '../css/sideBarRightChatComp/sideBarRightChatComp.css';

const SideBarRightChatComp = () => {
  const [chatData, setChatData] = useState([{}]);
  const [findChat, setFindChat] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let runNumber = 1;

  const getAllChats = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllChats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const chats = await res.json();
      const sortedChat = chats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setIsLoading(false);
      setChatData(sortedChat);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const handleFindChat = () => {
    const dataByChatId = chatData.filter((chat) => chat?._id.toLowerCase().includes(findChat.trim().toLowerCase()));
    const dataByMemberId = chatData.filter((chat) => chat?.members?.includes(findChat.trim().toLowerCase()));

    let combindPostArr = [];

    if (dataByChatId.length !== 0) {
      combindPostArr.push(...dataByChatId);
    }
    if (dataByMemberId.length !== 0) {
      combindPostArr.push(...dataByMemberId);
    }

    setChatData(combindPostArr);
  }

  const handleFindChatOnChange = (e) => {
    setFindChat(e.target.value);
  }

  const handleBlockNotification = async (chatId, chatStatus) => {
    try {
      if (chatStatus) {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการยกเลิกบล็อคไหม?",
          text: "ถ้ายกเลิกบล็อคแชทดังกล่าวจะสามารถใช้งานได้ปกติ",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockChat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              chatId
            })
          });
          Swal.fire({
            title: "ยกเลิกบล็อคสำเร็จ!",
            text: "แชทนี้สามารถใช้งานได้ตามปกติ",
            icon: "success"
          });
        }
      } else {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการบล็อคไหม?",
          text: "ถ้าบล็อคแชทดังกล่าวจะไม่สามารถใช้งานได้",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockChat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              chatId
            })
          });
          Swal.fire({
            title: "บล็อคสำเร็จ!",
            text: "แชทนี้ไม่สามารถใช้งานได้",
            icon: "success"
          });
        }
      }

      getAllChats();
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  useEffect(() => {
    getAllChats();
  }, []);

  useEffect(() => {
    if (!findChat.trim()) {
      setDisableBtn(true);
      getAllChats();
    } else {
      setDisableBtn(false);
    }
  }, [findChat]);

  return (
    <div className='conainer-sidebar-right-chat-comp'>
      <div className="second-container-sidebar-right-chat-comp">
        <h2>แสดงข้อมูลห้องแชททั้งหมด</h2>
        <InputGroup className="mb-3">
          <Form.Control style={{ maxWidth: "300px", boxShadow: "none" }} className='focus-ring focus-ring-light'
            placeholder="ไอดีห้องแชท / ไอดีสมาชิก"
            onChange={(e) => handleFindChatOnChange(e)}
          />
          <Button variant="primary" onClick={handleFindChat} disabled={disableBtn}>
            ค้นหา
          </Button>
        </InputGroup>
        <div className="container-showall-chats">
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th className='text-center'>ลำดับ</th>
                <th className='text-center'>ไอดีห้องแชท</th>
                <th className='text-center'>ไอดีสมาชิก</th>
                <th className='text-center'>บล็อค</th>
                <th className='text-center'>บันทึกล่าสุด</th>
                <th className='text-center'>แก้ไขล่าสุด</th>
                <th className='text-center'>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || chatData.length === 0
                ?
                <tr>
                  <td colSpan={7} className='text-center'>ไม่พบข้อมูลห้องแชท</td>
                </tr>
                :
                chatData.map((chat, index) => (
                  <tr key={index}>
                    <td className='text-center'>{runNumber++}</td>
                    <td className='text-center'>{chat?._id}</td>
                    <td className='text-center'>
                      <div className='d-flex flex-column gap-2'>
                        {chat?.members?.map((member, index) => (
                          <span key={index}>{member}</span>
                        ))
                        }
                      </div>
                    </td>
                    <td className='text-center'>{chat?.isBlock ? "บล็อค" : "ปกติ"}</td>
                    <td className='text-center'>{chat?.createdAt !== "" && new Date(chat?.createdAt).toLocaleDateString("th")}</td>
                    <td className='text-center'>{chat?.updatedAt !== "" && new Date(chat?.updatedAt).toLocaleDateString("th")}</td>
                    <td className='text-center'>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        {chat?._id && <Button onClick={() => handleBlockNotification(chat?._id, chat?.isBlock)} variant={chat?.isBlock ? "warning" : "danger"} >{chat?.isBlock ? "ยกเลิก" : "บล็อค"}</Button>}
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

export default SideBarRightChatComp;