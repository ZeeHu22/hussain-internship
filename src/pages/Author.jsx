import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthorItems from '../components/author/AuthorItems';
import { Link } from 'react-router-dom';
import AuthorBanner from '../images/author_banner.jpg';
import Skeleton from '../components/UI/Skeleton';

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const apiUrl = `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`;

    axios.get(apiUrl)
      .then(response => {
        setAuthor(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [authorId]);

  const handleFollow = () => {
    if (isFollowing) {
      setAuthor({ ...author, followers: author.followers - 1 });
    } else {
      setAuthor({ ...author, followers: author.followers + 1 });
    }
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>

          <section
            id="profile_banner"
            aria-label="section"
            className="text-light"
            data-bgimage="url(images/author_banner.jpg) top"
            style={{ background: `url(${AuthorBanner}) top` }}
          ></section>

          <section aria-label="section">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <Skeleton width="150px" height="150px" borderRadius="50%" />
                        <div className="profile_name">
                          <h4>
                            <Skeleton width="120px" height="24px" />
                            <span className="profile_username">
                              <Skeleton width="100px" height="20px" />
                            </span>
                            <span id="wallet" className="profile_wallet">
                              <Skeleton width="250px" height="20px" />
                            </span>
                            <button id="btn_copy" title="Copy Text" disabled>
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          <Skeleton width="100px" height="20px" />
                        </div>
                        <Link to="#" className="btn-main disabled">
                          Follow
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <AuthorItems loading={true} />
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
    return <div>Error: {error.message}</div>;
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={author.authorImage} alt="" />
                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {author.authorName}
                          <span className="profile_username">@{author.tag}</span>
                          <span id="wallet" className="profile_wallet">
                            {author.address}
                          </span>
                          <button id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">{author.followers} followers</div>
                      <Link to="#" className="btn-main" onClick={handleFollow}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems authorImage={author.authorImage} items={author.nftCollection} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
