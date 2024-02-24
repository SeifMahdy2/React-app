import { useContext } from "react";
import "./stories.scss"
import { AuthContext } from "../../context/authContext"

const Stories = () => {

  const {currentUser} = useContext(AuthContext)

  //TEMPORARY
  const stories = [
    {
      id: 1,
      name: "Seif Waleed",
      img: "https://i.pinimg.com/564x/d4/b9/e2/d4b9e26d2227182276017e4a39eedaed.jpg",
    },
    {
      id: 2,
      name: "Mohamed",
      img: "https://i.pinimg.com/564x/d4/b9/e2/d4b9e26d2227182276017e4a39eedaed.jpg",
    },
    {
      id: 3,
      name: "Shady",
      img: "https://i.pinimg.com/564x/d4/b9/e2/d4b9e26d2227182276017e4a39eedaed.jpg",
    },
    {
      id: 4,
      name: "Omar",
      img: "https://i.pinimg.com/564x/d4/b9/e2/d4b9e26d2227182276017e4a39eedaed.jpg",
    },
  ];

  return (
    <div className="stories">
      <div className="story">
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          <span>{currentUser.name}</span>
          <button>+</button>
        </div>
      {stories.map(story=>(
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Stories