import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userid, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userid)
    WHERE c.postid = ? ORDER BY c.createdAt DESC
    `;

  db.query(q, [req.query.postid], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO comments(`description`, `createdAt`, `userid`, `postid`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id, // Fixed typo here
      req.body.postid
    ];

    try {
      db.query(q, [values], (err, data) => {
        if (err) throw err; 
        return res.status(200).json("Comment has been created.");
      });
    } catch (error) {
      return res.status(500).json(error); 
    }
  });
};
