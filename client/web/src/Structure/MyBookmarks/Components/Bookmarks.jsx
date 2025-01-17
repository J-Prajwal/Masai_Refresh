import React from "react";
import styles from "../Styles/Bookmarks.module.css";
import { getTopicWiseBookmarks } from "../State/action";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Spinner } from "../../Common/Loader";
const Bookmarks = ({ topicId }) => {
  const history = useHistory();

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getTopicWiseBookmarks(topicId));
  }, []);
  const { topicwiseBookmarks } = useSelector((state) => state.myBookmarks);

  const showQuestion = (questionId) => {
    history.push(`/bookmarks/${topicId}/${questionId}`);
  };

  const renderBookmarks = () => {
    if (!topicwiseBookmarks) {
      return <Spinner />;
    }
    return topicwiseBookmarks.bookmark_details.map((singleBookmark, index) => {
      const { statement } = singleBookmark;
      return (
        <div
          className={styles.bookmarks__singleBookmark}
          key={index}
          onClick={() => showQuestion(singleBookmark.question_id)}
        >
          <p>{statement}</p>
          <img src="/logos/GreaterThanIcon.svg" alt="back icon" />
        </div>
      );
    });
  };
  return topicwiseBookmarks ? (
    <div className={styles.bookmarks}>
      <div
        className={styles.bookmarks__backButton}
        onClick={() => history.push("/my_bookmarks")}
      >
        <img src="/logos/LessThanIcon.svg" alt="back icon" />
        <p>Go Back</p>
      </div>
      <div className={styles.bookmarks__bookmarkCount}>
        <img
          src={
            topicwiseBookmarks
              ? `/logos/${topicwiseBookmarks.name.toLowerCase()}/${topicwiseBookmarks.name.toLowerCase()}_logo.svg`
              : null
          }
          alt="back icon"
        />
        <p>
          {topicwiseBookmarks
            ? topicwiseBookmarks.bookmark_details.length
            : "0"}{" "}
          Bookmarks
        </p>
      </div>
      <div className={styles.bookmarks__bookmarksList}>{renderBookmarks()}</div>
    </div>
  ) : (
    <Spinner />
  );
};

export default Bookmarks;
