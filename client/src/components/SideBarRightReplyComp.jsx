import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import '../css/sideBarRightReplyComp/sideBarRightReplyComp.css';

const SideBarRightReplyComp = () => {
  const [replyData, setReplyData] = useState([{}]);
  const [findReply, setFindReply] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);

  let runNumber = 1;

  const getAllReplys = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllReplys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const replys = await res.json();
      const sortedReply = replys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReplyData(sortedReply);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const handleFindReply = () => {
    const dataByReplyId = replyData.filter((reply) => reply?._id.toLowerCase().includes(findReply.trim().toLowerCase()));
    const dataByPostId = replyData.filter((reply) => reply?.postIdToReply.toLowerCase().includes(findReply.trim().toLowerCase()));
    const dataByCommentId = replyData.filter((reply) => reply?.commentIdToReply.toLowerCase().includes(findReply.trim().toLowerCase()));
    const dataByUserId = replyData.filter((reply) => reply?.userIdToReply.toLowerCase().includes(findReply.trim().toLowerCase()));

    let combindPostArr = [];

    if (dataByReplyId.length !== 0) {
      combindPostArr.push(...dataByReplyId);
    }
    if (dataByPostId.length !== 0) {
      combindPostArr.push(...dataByPostId);
    }
    if (dataByCommentId.length !== 0) {
      combindPostArr.push(...dataByCommentId);
    }
    if (dataByUserId.length !== 0) {
      combindPostArr.push(...dataByUserId);
    }

    setReplyData(combindPostArr);
  }

  const handleFindReplyOnChange = (e) => {
    setFindReply(e.target.value);
  }

  const handleBlockReply = async (replyId , replyStatus) => {
    try {
      if (replyStatus) {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการยกเลิกบล็อคไหม?",
          text: "ถ้ายกเลิกบล็อคตอบกลับดังกล่าวจะถูกแสดงบนเว็ปไซต์",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockReply`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              replyId
            })
          });
          Swal.fire({
            title: "ยกเลิกบล็อคสำเร็จ!",
            text: "ตอบกลับนี้แสดงบนเว็ปไซต์ตามปกติ",
            icon: "success"
          });
        }
      } else {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการบล็อคไหม?",
          text: "ถ้าบล็อคตอบกลับดังกล่าวจะไม่ถูกแสดงบนเว็ปไซต์",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockReply`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              replyId
            })
          });
          Swal.fire({
            title: "บล็อคสำเร็จ!",
            text: "ตอบกลับนี้ไม่ถูกแสดงบนเว็ปไซต์",
            icon: "success"
          });
        }
      }

      getAllReplys();
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  useEffect(() => {
    getAllReplys();
  }, []);

  useEffect(() => {
    if (!findReply.trim()) {
      setDisableBtn(true);
      getAllReplys();
    } else {
      setDisableBtn(false);
    }
  }, [findReply]);

  return (
    <div className='conainer-sidebar-right-reply-comp'>
      <div className="second-container-sidebar-right-reply-comp">
        <h2>แสดงข้อมูลตอบกลับทั้งหมด</h2>
        <InputGroup className="mb-3">
          <Form.Control style={{ maxWidth: "380px", boxShadow: "none" }} className='focus-ring focus-ring-light'
            placeholder="ไอดีตอบกลับ / ไอดีโพสต์ / ไอดีคอมเมนท์ / ไอดีผู้ใช้"
            onChange={(e) => handleFindReplyOnChange(e)}
          />
          <Button variant="primary" onClick={handleFindReply} disabled={disableBtn}>
            ค้นหา
          </Button>
        </InputGroup>
        <div className="container-showall-replys">
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th className='text-center'>ลำดับ</th>
                <th className='text-center'>ไอดีตอบกลับ</th>
                <th className='text-center'>ไอดีโพสต์</th>
                <th className='text-center'>ไอดีคอมเมนท์</th>
                <th className='text-center'>ไอดีผู้ใช้</th>
                <th className='text-center'>รายละเอียด</th>
                <th className='text-center'>รูป</th>
                <th className='text-center'>ไลค์</th>
                <th className='text-center'>บล็อค</th>
                <th className='text-center'>บันทึกล่าสุด</th>
                <th className='text-center'>แก้ไขล่าสุด</th>
                <th className='text-center'>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {replyData.length === 0 &&
                <tr>
                  <td colSpan={12} className='text-center'>ไม่พบข้อมูลตอบกลับ</td>
                </tr>
              }
              {replyData.map((reply, index) => (
                <tr key={index}>
                  <td className='text-center'>{runNumber++}</td>
                  <td className='text-center'>{reply?._id}</td>
                  <td className='text-center'>{reply?.postIdToReply}</td>
                  <td className='text-center'>{reply?.commentIdToReply}</td>
                  <td className='text-center'>{reply?.userIdToReply}</td>
                  <td className='text-center'>{reply?.replyMsg === "" ? "ไม่มีข้อมูล" : reply?.replyMsg}</td>
                  <td className='text-center'>
                    {reply?.replyImg === ""
                      ?
                      <span>ไม่มีข้อมูล</span>
                      :
                      <a href={`${process.env.REACT_APP_SERVER_DOMAIN}/replyImg/${reply?.replyImg}`} target='_blank' rel='noreferrer'>{reply?.replyImg}</a>
                    }
                  </td>
                  <td className='text-center'>{reply?.replyLikes?.length === 0 ? "ไม่มี" : reply?.replyLikes?.length}</td>
                  <td className='text-center'>{reply?.isBlock ? "บล็อค" : "ปกติ"}</td>
                  <td className='text-center'>{reply?.createdAt !== "" && new Date(reply?.createdAt).toLocaleDateString("th")}</td>
                  <td className='text-center'>{reply?.updatedAt !== "" && new Date(reply?.updatedAt).toLocaleDateString("th")}</td>
                  <td className='text-center'>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      {reply?._id && <Button onClick={() => handleBlockReply(reply?._id, reply?.isBlock)} variant={reply?.isBlock ? "warning" : "danger"} >{reply?.isBlock ? "ยกเลิก" : "บล็อค"}</Button>}
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

export default SideBarRightReplyComp;