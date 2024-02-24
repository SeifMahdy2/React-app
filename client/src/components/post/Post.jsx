import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import { AuthContext } from "../../context/authContext.js";
import { makeRequest } from "../../axios.js";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";


const Post = ({ post }) => {
  //post file is for each individual post 
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setmenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);


  const { data } = useQuery({
    //getting their likes and adding or removing them
    queryKey: ["likes",post.id],
    queryFn: () => makeRequest.get("/likes?postid="+post.id).then((res) => {return res.data})
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete("/likes?postid=" + post.id);
      return makeRequest.post("/likes", { postid: post.id });
    },
    onSuccess: () => {
      queryClient.setQueryData(["likes", post.id], (oldData) => {
        if (mutation.variables) {
          return oldData.filter((userId) => userId !== currentUser.id);
        } else {
          return [...oldData, currentUser.id];
        }
      });
    },
  });

  const deletemutation = useMutation({
    mutationFn: (postid) => {
      return makeRequest.delete("/posts/" + postid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    } 
  });

  
    

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete =() => {
    deletemutation.mutate(post.id);
  }

  

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/"+post.profilePic} alt="" />
            <div className="details">
              <Link
              //navigates to the user's profile when clicking his name on the post
                to={`/profile/${post.userid}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setmenuOpen(!menuOpen)} />
          {menuOpen && post.userid === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"/upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
          {data?.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postid={post.id} />}
      </div>
    </div>
  );
};

export default Post;