import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import EthImage from "../images/ethereum.svg";
import Skeleton from "../components/UI/Skeleton";

const ItemDetails = () => {
  const { nftId } = useParams();
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchNftData = async () => {
      try {
        const response = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );
        setNftData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchNftData();
  }, [nftId]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-6 text-center">
                  <Skeleton width="100%" height="400px" borderRadius="10px" />
                </div>
                <div className="col-md-6">
                  <div className="item_info">
                    <Skeleton width="60%" height="40px" />
                    <div className="item_info_counts">
                      <Skeleton width="80px" height="30px" />
                      <Skeleton width="80px" height="30px" />
                    </div>
                    <Skeleton width="100%" height="80px" />
                    <div className="d-flex flex-row">
                      <div className="mr40">
                        <h6>Owner</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Skeleton width="50px" height="50px" borderRadius="50%" />
                          </div>
                          <div className="author_list_info">
                            <Skeleton width="100px" height="20px" />
                          </div>
                        </div>
                      </div>
                      <div></div>
                    </div>
                    <div className="de_tab tab_simple">
                      <div className="de_tab_content">
                        <h6>Creator</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Skeleton width="50px" height="50px" borderRadius="50%" />
                          </div>
                          <div className="author_list_info">
                            <Skeleton width="100px" height="20px" />
                          </div>
                        </div>
                      </div>
                      <div className="spacer-40"></div>
                      <h6>Price</h6>
                      <div className="nft-item-price">
                        <Skeleton width="40px" height="40px" />
                        <Skeleton width="60px" height="30px" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading NFT details: {error.message}</div>;
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={nftData.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={nftData.title}
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{nftData.title}  #{nftData.tag}</h2>
                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {nftData.views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {nftData.likes}
                    </div>
                  </div>
                  <p>{nftData.description}</p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${nftData.ownerId}`}>
                            <img
                              className="lazy"
                              src={nftData.ownerImage}
                              alt={nftData.ownerName}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${nftData.ownerId}`}>
                            {nftData.ownerName}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${nftData.creatorId}`}>
                            <img
                              className="lazy"
                              src={nftData.creatorImage}
                              alt={nftData.creatorName}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${nftData.creatorId}`}>
                            {nftData.creatorName}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="Ethereum" />
                      <span>{nftData.price} ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
