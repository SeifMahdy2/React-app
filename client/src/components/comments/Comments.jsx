import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import moment from "moment";

const Comments = ({ postid }) => {
  //this file is the frontend for the comments which displays them and sends them to the backend and the database
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postid], // Include postid in query key to fetch comments for each post
    queryFn: () => makeRequest.get("/comments?postid=" + postid).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post('/comments', newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postid]); // Invalidate specific query for postid
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postid });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error ? "Something went wrong" : isLoading ? "Loading..." : (
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.description}</p> {/* Make sure to access the correct field name */}
            </div>
            <span className="date">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
