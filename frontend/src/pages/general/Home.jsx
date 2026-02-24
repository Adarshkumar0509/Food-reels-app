import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((response) => {
        console.log("FOOD ITEMS FROM API:", response.data.foodItems);
        setVideos(response.data.foodItems); // correct
      })
      .catch((err) => {
        console.error("Error fetching food items", err);
      });
  }, []);

  async function likeVideo(item) {
    const response = await axios.post(
      "http://localhost:3000/api/food/like",
      { foodId: item._id },
      { withCredentials: true }
    );

    if (response.data.like) {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v
        )
      );
    } else {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v
        )
      );
    }
  }

  async function saveVideo(item) {
    const response = await axios.post(
      "http://localhost:3000/api/food/save",
      { foodId: item._id },
      { withCredentials: true }
    );

    if (response.data.save) {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v
        )
      );
    } else {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v
        )
      );
    }
  }

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      emptyMessage="No videos available."
    />
  );
};

export default Home;
