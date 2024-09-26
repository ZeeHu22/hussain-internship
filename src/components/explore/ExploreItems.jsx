import React, { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "../UI/Skeleton";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(8);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [filter, setFilter] = useState("");
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const apiUrl = `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore${
      filter ? `?filter=${filter}` : ""
    }`;
    axios
      .get(apiUrl)
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching explore items:", error);
        setLoading(false);
      });
  }, [filter]);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns = {};
      items.forEach((item) => {
        if (item.expiryDate) {
          const now = Date.now();
          const timeLeft = item.expiryDate - now;
          if (timeLeft <= 0) {
            newCountdowns[item.id] = "Expired";
          } else {
            const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
            const seconds = Math.floor((timeLeft / 1000) % 60);
            newCountdowns[item.id] = `${hours}h ${minutes}m ${seconds}s`;
          }
        } else {
          newCountdowns[item.id] = "No Expiry Date";
        }
      });
      setCountdowns(newCountdowns);
    };
    updateCountdowns();
    const intervalId = setInterval(updateCountdowns, 1000);
    return () => clearInterval(intervalId);
  }, [items]);

  const getRemainingTime = (expiryDate) => {
    if (!expiryDate) return "Expired";
    const now = Date.now();
    const timeLeft = expiryDate - now;
    if (timeLeft <= 0) return "Expired";
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleLoadMore = () => {
    setVisibleItems(visibleItems + 4);
    if (visibleItems + 4 >= items.length) {
      setHasMoreItems(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  if (loading) {
    return (
      <div className="row">
        {[...Array(8)].map((_, index) => (
          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
            <div className="nft__item">
              <div className="author_list_pp">
                <Skeleton width="40px" height="40px" borderRadius="50%" />
                <i className="fa fa-check"></i>
              </div>
              <div className="nft__item_wrap">
                <Skeleton width="100%" height="200px" />
              </div>
              <div className="nft__item_info">
                <h4>
                  <Skeleton width="80%" height="20px" />
                </h4>
                <div className="nft__item_price">
                  <Skeleton width="30%" height="20px" />
                </div>
                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>
                    <Skeleton width="20px" height="20px" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))} 
      </div>
    );
  }

  return (
    <div className="row">
      <div>
        <select id="filter-items" value={filter} onChange={handleFilterChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      {items.slice(0, visibleItems).map((item, index) => (
        <div 
          className="col-lg-3 col-md-6 col-sm-6 col-xs-12" 
          key={index} 
          data-aos="fade-in"
          data-aos-duration="1000"
          data-aos-delay={index * 50}
        >
          <div className="nft__item">
            <div className="author_list_pp">
              <Link to={`/author/${item.authorId}`}>
                <img
                  className="lazy"
                  src={item.authorImage}
                  alt={item.authorName}
                />
                <i className="fa fa-check"></i>
              </Link>
            </div>

            
            <div className="de_countdown">
              {getRemainingTime(item.expiryDate)}
            </div>
            

            <div className="nft__item_wrap">
              <Link to={`/item-details/${item.nftId}`}>
                <img
                  src={item.nftImage}
                  alt={item.title}
                  className="nft__item_preview"
                />
              </Link>
            </div>

            <div className="nft__item_info">
              <Link to={`/item-details/${item.nftId}`}>
                <h4>{item.title}</h4>
              </Link>
              <div className="nft__item_price">{item.price} ETH</div>
              <div className="nft__item_like">
                <i className="fa fa-heart"></i>
                <span>{item.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {hasMoreItems && (
        <div className="col-md-12 text-center">
          <button className="btn-main" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreItems;
