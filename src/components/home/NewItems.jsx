import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Skeleton from "../UI/Skeleton";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";

const NFTItem = React.memo(({ item }) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      if (item.expiryDate) {
        const now = Date.now();
        const timeLeft = item.expiryDate - now;
        if (timeLeft <= 0) {
          setCountdown("Expired");
        } else {
          const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
          const seconds = Math.floor((timeLeft / 1000) % 60);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        setCountdown("Expired");
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [item.expiryDate]);

  return (
    <div className="nft__item">
      <div className="author_list_pp">
        <Link
          to={`/author/${item.authorId}`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={`Creator: ${item.authorName}`}
        >
          <img className="lazy" src={item.authorImage} alt="" />
          <i className="fa fa-check"></i>
        </Link>
      </div>

      <div className="de_countdown">{countdown}</div>

      <div className="nft__item_wrap">
        <div className="nft__item_extra">
          <div className="nft__item_buttons">
            <button>Buy Now</button>
            <div className="nft__item_share">
              <h4>Share</h4>
              <a href="" target="_blank" rel="noreferrer">
                <i className="fa fa-facebook fa-lg"></i>
              </a>
              <a href="" target="_blank" rel="noreferrer">
                <i className="fa fa-twitter fa-lg"></i>
              </a>
              <a href="">
                <i className="fa fa-envelope fa-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <Link to={`/item-details/${item.nftId}`}>
          <img
            src={item.nftImage}
            className="lazy nft__item_preview"
            alt=""
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
  );
});

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(4);

  useEffect(() => {
    axios
      .get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      )
      .then((response) => {
        setNewItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching new items:", error);
        setLoading(false);
      });
  }, []);

  const updateSkeletonCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < 800) {
      setSkeletonCount(1);
    } else if (width < 1000) {
      setSkeletonCount(2);
    } else if (width < 1200) {
      setSkeletonCount(3);
    } else {
      setSkeletonCount(4);
    }
  }, []);

  useEffect(() => {
    updateSkeletonCount();
    window.addEventListener("resize", updateSkeletonCount);
    return () => window.removeEventListener("resize", updateSkeletonCount);
  }, [updateSkeletonCount]);

  const options = useMemo(() => ({
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      800: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  }), []);

  if (loading) {
    return (
      <section id="section-items" className="no-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>New Items</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Skeleton width="50px" height="50px" borderRadius="50%" />
                  </div>
                  <Skeleton width="100%" height="200px" borderRadius="8px" />
                  <div className="nft__item_info">
                    <Skeleton width="80%" height="20px" borderRadius="4px" />
                    <Skeleton width="50%" height="20px" borderRadius="4px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <OwlCarousel className="owl-theme" {...options}>
              {newItems.map((item) => (
                <div className="item" key={item.nftId}>
                  <NFTItem item={item} />
                </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;