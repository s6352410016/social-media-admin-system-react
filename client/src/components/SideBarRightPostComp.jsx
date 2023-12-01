import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import '../css/sideBarRightPostComp/sideBarRightPostComp.css';

const SideBarRightPostComp = () => {
  const [postData, setPostData] = useState([{}]);
  const [findPost, setFindPost] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let runNumber = 1;

  const getAllPosts = async () => {
    try {
      const resPost = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllPosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const posts = await resPost.json();

      const resSharePost = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllSharePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const sharePosts = await resSharePost.json();

      const allPosts = [...posts, ...sharePosts];
      const sortedPost = allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setIsLoading(false);
      setPostData(sortedPost);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const handleFindPost = () => {
    const dataByPostId = postData.filter((post) => post?._id.toLowerCase().includes(findPost.trim().toLowerCase()));
    const dataByUserId = postData.filter((post) => {
      let dataFromUserId = [];

      if (post?.userIdToPost) {
        dataFromUserId = post?.userIdToPost.toLowerCase().includes(findPost.trim().toLowerCase());
      } else {
        dataFromUserId = post?.userIdToShare.toLowerCase().includes(findPost.trim().toLowerCase());
      }

      return dataFromUserId;
    });

    let combindPostArr = [];
    if (dataByPostId.length !== 0) {
      combindPostArr.push(...dataByPostId);
    }
    if (dataByUserId.length !== 0) {
      combindPostArr.push(...dataByUserId);
    }

    setPostData(combindPostArr);
  }

  const handleFindPostOnChange = (e) => {
    setFindPost(e.target.value);
  }

  const handleBlockPost = async (postId, postBlockStatus) => {
    try {
      if (postBlockStatus) {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการยกเลิกบล็อคไหม?",
          text: "ถ้ายกเลิกบล็อคโพสต์ดังกล่าวจะถูกแสดงบนเว็ปไซต์",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockPost`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              postId
            })
          });
          Swal.fire({
            title: "ยกเลิกบล็อคสำเร็จ!",
            text: "โพสต์นี้แสดงบนเว็ปไซต์ตามปกติ",
            icon: "success"
          });
        }
      } else {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการบล็อคไหม?",
          text: "ถ้าบล็อคโพสต์ดังกล่าวจะไม่ถูกแสดงบนเว็ปไซต์",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockPost`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              postId
            })
          });
          Swal.fire({
            title: "บล็อคสำเร็จ!",
            text: "โพสต์นี้ไม่ถูกแสดงบนเว็ปไซต์",
            icon: "success"
          });
        }
      }

      getAllPosts();
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    if (!findPost.trim()) {
      setDisableBtn(true);
      getAllPosts();
    } else {
      setDisableBtn(false);
    }
  }, [findPost]);

  return (
    <div className='conainer-sidebar-right-post-comp'>
      <div className="second-container-sidebar-right-post-comp">
        <h2>แสดงข้อมูลโพสต์ทั้งหมด</h2>
        <InputGroup className="mb-3">
          <Form.Control style={{ maxWidth: "300px", boxShadow: "none" }} className='focus-ring focus-ring-light'
            placeholder="ไอดีโพสต์ / ไอดีผู้ใช้"
            onChange={(e) => handleFindPostOnChange(e)}
          />
          <Button variant="primary" onClick={handleFindPost} disabled={disableBtn}>
            ค้นหา
          </Button>
        </InputGroup>
        <div className="container-showall-posts">
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th className='text-center'>ลำดับ</th>
                <th className='text-center'>ไอดีโพสต์</th>
                <th className='text-center'>ไอดีผู้ใช้</th>
                <th className='text-center'>รายละเอียด</th>
                <th className='text-center'>รูป</th>
                <th className='text-center'>วิดีโอ</th>
                <th className='text-center'>ไลค์</th>
                <th className='text-center'>บล็อค</th>
                <th className='text-center'>บันทึกล่าสุด</th>
                <th className='text-center'>แก้ไขล่าสุด</th>
                <th className='text-center'>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || postData.length === 0
                ?
                <tr>
                  <td colSpan={11} className='text-center'>ไม่พบข้อมูลโพสต์</td>
                </tr>
                :
                postData.map((post, index) => {
                  if (post.userIdToPost) {
                    return (
                      <tr key={index}>
                        <td className='text-center'>{runNumber++}</td>
                        <td className='text-center'>{post?._id}</td>
                        <td className='text-center'>{post?.userIdToPost}</td>
                        <td className='text-center'>{post?.postMsg === "" ? "ไม่มีข้อมูล" : post?.postMsg}</td>
                        <td className='text-center'>
                          <div className='d-flex flex-column gap-2'>
                            {post?.postImgs?.length === 0
                              ?
                              <span>ไม่มีข้อมูล</span>
                              :
                              post?.postImgs?.map((img, index) => (
                                <a key={index} href={`${process.env.REACT_APP_SERVER_DOMAIN}/postImg/${img}`} target='_blank' rel='noreferrer'>{img}</a>
                              ))
                            }
                          </div>
                        </td>
                        <td className='text-center'>
                          {post?.postVideo === ""
                            ?
                            <span>ไม่มีข้อมูล</span>
                            :
                            <a target='_blank' href={`${process.env.REACT_APP_SERVER_DOMAIN}/postVideo/${post?.postVideo}`} rel='noreferrer'>{post?.postVideo}</a>
                          }
                        </td>
                        <td className='text-center'>{post?.postLikes?.length === 0 ? "ไม่มี" : post?.postLikes?.length}</td>
                        <td className='text-center'>{post?.isBlock ? "บล็อค" : "ปกติ"}</td>
                        <td className='text-center'>{post?.createdAt !== "" && new Date(post?.createdAt).toLocaleDateString("th")}</td>
                        <td className='text-center'>{post?.updatedAt !== "" && new Date(post?.updatedAt).toLocaleDateString("th")}</td>
                        <td className='text-center'>
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            {post?._id && <Button onClick={() => handleBlockPost(post?._id, post?.isBlock)} variant={post?.isBlock ? "warning" : "danger"} >{post?.isBlock ? "ยกเลิก" : "บล็อค"}</Button>}
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={index}>
                        <td className='text-center'>{runNumber++}</td>
                        <td className='text-center'>{post?._id}</td>
                        <td className='text-center'>{post?.userIdToShare}</td>
                        <td className='text-center'>{post?.shareMsg === "" ? "ไม่มีข้อมูล" : post?.shareMsg}</td>
                        <td className='text-center'>
                          ไม่มีข้อมูล
                        </td>
                        <td className='text-center'>
                          ไม่มีข้อมูล
                        </td>
                        <td className='text-center'>{post?.sharePostLikes?.length === 0 ? "ไม่มี" : post?.sharePostLikes?.length}</td>
                        <td className='text-center'>{post?.isBlock ? "บล็อค" : "ปกติ"}</td>
                        <td className='text-center'>{post?.createdAt !== "" && new Date(post?.createdAt).toLocaleDateString("th")}</td>
                        <td className='text-center'>{post?.updatedAt !== "" && new Date(post?.updatedAt).toLocaleDateString("th")}</td>
                        <td className='text-center'>
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            {post?._id && <Button onClick={() => handleBlockPost(post?._id, post?.isBlock)} variant={post?.isBlock ? "warning" : "danger"} >{post?.isBlock ? "ยกเลิก" : "บล็อค"}</Button>}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                })
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default SideBarRightPostComp;