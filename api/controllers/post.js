import jwt from 'jsonwebtoken';
import moment from 'moment';
import {
      db
} from '../connect.js';

export const getPosts = (req, res) => {
      const userid = req.query.userid;
      const token = req.cookies.accessToken;
  
      if (!token) return res.status(401).json("Not logged in");
  
      jwt.verify(token, "secretkey", (err, userinfo) => {
          if (err) return res.status(403).json("Token is invalid");
  
          const loggedInUserId = userinfo.id;
            // the posts of the users i follow
          let q = `SELECT p.*, u.id AS userid, name, profilePic 
                   FROM posts AS p 
                   JOIN users AS u ON u.id = p.userid 
                   WHERE p.userid = ? 
                   OR p.userid IN (
                       SELECT followedUserid 
                       FROM relationships 
                       WHERE followerUserid = ?
                   ) 
                   ORDER BY p.createAt DESC`;
  
          let values = [loggedInUserId, loggedInUserId];
  
          if (userid) {
              // If a specific userid is provided, filter posts for that user only
              q = `SELECT p.*, u.id AS userid, name, profilePic 
                   FROM posts AS p 
                   JOIN users AS u ON u.id = p.userid 
                   WHERE p.userid = ? 
                   ORDER BY p.createAt DESC`;
              values = [userid];
          }
  
          db.query(q, values, (err, data) => {
              if (err) {
                  return res.status(500).json(err);
              }
              return res.status(200).json(data);
          });
      });
  };
  

export const addPost = (req, res) => {
      //creates a new post 
      const token = req.cookies.accessToken;
      if (!token) return res.status(401).json("Not logged in")
      jwt.verify(token, "secretkey", (err, userinfo) => {
            if (err) return res.status(403).json("Token is invalid");
            //inseting the data into the database
            const q = "INSERT INTO posts(`desc`,`img`,`createAt`,`userid`) VALUES (?)";

            const values = [req.body.desc, req.body.img,
                  moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                  userinfo.id
            ]

            db.query(q, [values], (err, data) => {
                  if (err) {
                        return res.status(500).json(err);
                  }
                  return res.status(200).json("Post has been added");
            });
      })
};

export const deletePost = (req, res) => {
      //removing the data from the database
      const token = req.cookies.accessToken;
      if (!token) return res.status(401).json("Not logged in!");

      jwt.verify(token, "secretkey", (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!");

            const q =
                  "DELETE FROM posts WHERE `id`=? AND `userid` = ?";

            db.query(q, [req.params.id, userInfo.id], (err, data) => {
                  if (err) return res.status(500).json(err);
                  if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
                  return res.status(403).json("You can delete only your post")
            });
      });
};