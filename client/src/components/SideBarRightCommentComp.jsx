import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import '../css/sideBarRightCommentComp/sideBarRightCommentComp.css';

const SideBarRightCommentComp = () => {
  const [commentData, setCommentData] = useState([{}]);
  const [findComment, setFindComment] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let runNumber = 1;

  const getAllComments = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllComments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const comments = await res.json();
      const sortedComment = comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setIsLoading(false);
      setCommentData(sortedComment);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const handleFindComment = () => {
    const dataByCommentId = commentData.filter((comment) => comment?._id.toLowerCase().includes(findComment.trim().toLowerCase()));
    const dataByPostId = commentData.filter((comment) => comment?.postIdToComment.toLowerCase().includes(findComment.trim().toLowerCase()));
    const dataByUserId = commentData.filter((comment) => comment?.userIdToComment.toLowerCase().includes(findComment.trim().toLowerCase()));

    let combindPostArr = [];

    if (dataByCommentId.length !== 0) {
      combindPostArr.push(...dataByCommentId);
    }
    if (dataByPostId.length !== 0) {
      combindPostArr.push(...dataByPostId);
    }
    if (dataByUserId.length !== 0) {
      combindPostArr.push(...dataByUserId);
    }

    setCommentData(combindPostArr);
  }

  const handleFindCommentOnChange = (e) => {
    setFindComment(e.target.value);
  }

  const handleBlockComment = async (commentId, commentStatus) => {
    try {
      if (commentStatus) {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการยกเลิกบล็อคไหม?",
          text: "ถ้ายกเลิกบล็อคคอมเมนท์ดังกล่าวจะถูกแสดงบนเว็ปไซต์",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockComment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              commentId
            })
          });
          Swal.fire({
            title: "ยกเลิกบล็อคสำเร็จ!",
            text: "คอมเมนท์นี้แสดงบนเว็ปไซต์ตามปกติ",
            icon: "success"
          });
        }
      } else {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการบล็อคไหม?",
          text: "ถ้าบล็อคคอมเมนท์ดังกล่าวจะไม่ถูกแสดงบนเว็ปไซต์",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockComment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              commentId
            })
          });
          Swal.fire({
            title: "บล็อคสำเร็จ!",
            text: "คอมเมนท์นี้ไม่ถูกแสดงบนเว็ปไซต์",
            icon: "success"
          });
        }
      }

      getAllComments();
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  useEffect(() => {
    getAllComments();
  }, []);

  useEffect(() => {
    if (!findComment.trim()) {
      setDisableBtn(true);
      getAllComments();
    } else {
      setDisableBtn(false);
    }
  }, [findComment]);

  return (
    <div className='conainer-sidebar-right-comment-comp'>
      <div className="second-container-sidebar-right-comment-comp">
        <h2>แสดงข้อมูลคอมเมนท์ทั้งหมด</h2>
        <InputGroup className="mb-3">
          <Form.Control style={{ maxWidth: "300px", boxShadow: "none" }} className='focus-ring focus-ring-light'
            placeholder="ไอดีคอมเมนท์ / ไอดีโพสต์ / ไอดีผู้ใช้"
            onChange={(e) => handleFindCommentOnChange(e)}
          />
          <Button variant="primary" onClick={handleFindComment} disabled={disableBtn}>
            ค้นหา
          </Button>
        </InputGroup>
        <div className="container-showall-posts">
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th className='text-center'>ลำดับ</th>
                <th className='text-center'>ไอดีคอมเมนท์</th>
                <th className='text-center'>ไอดีโพสต์</th>
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
              {isLoading || commentData.length === 0
                ?
                <tr>
                  <td colSpan={11} className='text-center'>ไม่พบข้อมูลคอมเมนท์</td>
                </tr>
                :
                commentData.map((comment, index) => (
                  <tr key={index}>
                    <td className='text-center'>{runNumber++}</td>
                    <td className='text-center'>{comment?._id}</td>
                    <td className='text-center'>{comment?.postIdToComment}</td>
                    <td className='text-center'>{comment?.userIdToComment}</td>
                    <td className='text-center'>{comment?.commentMsgs === "" ? "ไม่มีข้อมูล" : comment?.commentMsgs}</td>
                    <td className='text-center'>
                      {comment?.commentImg === ""
                        ?
                        <span>ไม่มีข้อมูล</span>
                        :
                        <a href={`${process.env.REACT_APP_SERVER_DOMAIN}/commentImg/${comment?.commentImg}`} target='_blank' rel='noreferrer'>{comment?.commentImg}</a>
                      }
                    </td>
                    <td className='text-center'>{comment?.commentLikes?.length === 0 ? "ไม่มี" : comment?.commentLikes?.length}</td>
                    <td className='text-center'>{comment?.isBlock ? "บล็อค" : "ปกติ"}</td>
                    <td className='text-center'>{comment?.createdAt !== "" && new Date(comment?.createdAt).toLocaleDateString("th")}</td>
                    <td className='text-center'>{comment?.updatedAt !== "" && new Date(comment?.updatedAt).toLocaleDateString("th")}</td>
                    <td className='text-center'>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        {comment?._id && <Button onClick={() => handleBlockComment(comment?._id, comment?.isBlock)} variant={comment?.isBlock ? "warning" : "danger"} >{comment?.isBlock ? "ยกเลิก" : "บล็อค"}</Button>}
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

export default SideBarRightCommentComp;