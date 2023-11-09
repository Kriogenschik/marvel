import useMarvelService from "../../services/MarvelService";
import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./comicsList.scss";

const ComicsList = () => {
  const [comics, setComics] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(20);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { loading, error, getAllComics } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset).then(onComicsLoaded);
  };

  const onComicsLoaded = (newComics) => {
    let ended = false;
    if (newComics.length < 8) {
      ended = true;
    }
    setComics((comics) => [...comics, ...newComics]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 8);
    setComicsEnded(ended);
  };

  function renderItems(comics) {
    return comics.map((comic) => {
      let imgStyle = { objectFit: "cover" };
      if (
        comic.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "contain" };
      }
      return (
        <li
          className="comics__item"
          key={comic.id}
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === " " || e.key === "Enter") {
              //   props.onCharSelected(comics.id);
            }
          }}
        >
          <Link to={`/comics/${comic.id}`}>
            <img
              src={comic.thumbnail}
              alt={comic.title}
              style={imgStyle}
              className="comics__item-img"
            />
            <div className="comics__item-name">{comic.title}</div>
            <div className="comics__item-price">{comic.price}</div>
          </Link>
        </li>
      );
    });
  }

  const items = renderItems(comics);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      <ul className="comics__grid">{items}</ul>
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
