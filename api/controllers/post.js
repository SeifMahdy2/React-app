import  jwt  from 'jsonwebtoken';
import { db } from '../connect.js';
import moment from 'moment';

export const getPosts = (req, res) => {

      const userid= req.query.userid
      const token = req.cookies.accessToken;
      if (!token) return res.status(401).json("Not logged in")
      jwt.verify(token,"secretkey",(err,userinfo)=>{
            if(err) return res.status(403).json("Token is invalid");

            const q =
                  userid !== "undefined"
                  ? `SELECT p.*, u.id AS userid, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userid) WHERE p.userid = ? ORDER BY p.createAt DESC`
                  : `SELECT p.*, u.id AS userid, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userid)
            LEFT JOIN relationships AS r ON (p.userid = r.followedUserid) WHERE r.followerUserid= ? OR p.userid =?
            ORDER BY p.createAt DESC`;
            
            const values = userid ? [userid] : [userinfo.id,userinfo.id]
            db.query(q, values,(err, data) => {
                  if (err) {
                        return res.status(500).json(err);
                  }
                  return res.status(200).json(data);
            });
      })
};

export const addPost = (req, res) => {
      const token = req.cookies.accessToken;
      if (!token) return res.status(401).json("Not logged in")
      jwt.verify(token,"secretkey",(err,userinfo)=>{
            if(err) return res.status(403).json("Token is invalid");

            const q = "INSERT INTO posts (`desc`,`img`,`userid`,`createAt`) VALUES (?)";

            const values =[req.body.desc, req.body.img,
                  moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                  userinfo.id
            ]
            
            db.query(q, [values],(err, data) => {
                  if (err) {
                        return res.status(500).json(err);
                  }
                  return res.status(200).json("Post has been added");
            });
      })
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE `id`=? AND `userid` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};