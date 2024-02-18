import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";

const Posts = ({userid}) => {
  const {isLoading, error,  data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => makeRequest.get("/posts").then((res) => {return res.data})
  });

  return (
    <div className="posts">
      {error 
      ?"Something went wrong"
      : isLoading
      ? "Loading" 
      : data.map((post)=><Post key={post.id} post={post} />)}
    </div>
  );
};

export default Posts;
