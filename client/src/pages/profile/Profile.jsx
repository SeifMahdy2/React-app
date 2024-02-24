import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios.js";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext.js";
import { useContext,useState } from "react";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);

  const userid = parseInt(useLocation().pathname.split("/")[2]);
  const { currentUser } = useContext(AuthContext);

  
  const { isLoading ,  data } = useQuery({
    queryKey: ["user"],
    queryFn: () => makeRequest.get("/users/find/"+userid).then((res) => {return res.data})
  });  
  const { isLoading: risLoading,data: relationshipData } = useQuery({
    queryKey: ["relationship"],
    queryFn: () => makeRequest.get("relationships?followedUserid="+userid).then((res) => {return res.data})
  });  



  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) return makeRequest.delete("/relationships?userid=" + userid);
      return makeRequest.post("/relationships/", { userid });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship"]);
    },
    });

  const handleFollow = ()=> {
    mutation.mutate(relationshipData.includes(currentUser.id))
  }


  return (
    <div className="profile">
      {isLoading ? "loading..." 
      : (
      <> 
      <div className="images">
        <img src={"/upload/"+data.coverPic} alt="" className="cover" />
        <img src={"/upload/"+data.profilePic} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {risLoading? "loading" : userid === currentUser.id ? (
            <button onClick={()=>setOpenUpdate(true)}>
              Update
            </button>
            ) : <button onClick={handleFollow}>{relationshipData.includes(currentUser.id)? "Following" : "Follow"}</button>}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      <Posts userid={userid}/>
      </div> 
      </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
