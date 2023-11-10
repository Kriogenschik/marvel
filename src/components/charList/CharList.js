import { useEffect, useState, useRef, createRef } from "react";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./charList.scss";

const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(250);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset).then(onCharsLoaded);
  };

  const onCharsLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) {
      ended = true;
    }
    setChars((chars) => [...chars, ...newChars]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
  };

  const itemRefs = useRef([]);

  const setItemActive = (id) => {
    itemRefs.current.forEach((ref) =>
      ref.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  function renderItems(chars) {
    return chars.map((char, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        char.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "contain" };
      }
      return (
        <li
          className="char__item"
          tabIndex={0}
          key={char.id}
          ref={(el) => (itemRefs.current[i] = el)}
          onClick={() => {
            props.onCharSelected(char.id);
            setItemActive(i);
          }}
          onKeyPress={(e) => {
            if (e.key === " " || e.key === "Enter") {
              props.onCharSelected(char.id);
              setItemActive(i);
            }
          }}
        >
          <img src={char.thumbnail} alt={char.name} style={imgStyle} />
          <div className="char__name">{char.name}</div>
        </li>
      );
    });
  }

  function renderItems2(chars) {
    return(
      <TransitionGroup className="char__grid">
    {chars.map((char, i) => (

      <CSSTransition
        key={char.id}
        timeout={500}
        classNames="char__item"
      >
        <li
          className="char__item"
          tabIndex={0}
          ref={(el) => (itemRefs.current[i] = el)}
          onClick={() => {
            props.onCharSelected(char.id);
            setItemActive(i);
          }}
          onKeyPress={(e) => {
            if (e.key === " " || e.key === "Enter") {
              props.onCharSelected(char.id);
              setItemActive(i);
            }
          }}
        >
          <img src={char.thumbnail} alt={char.name} />
          <div className="char__name">{char.name}</div>
        </li>
      </CSSTransition>
    ))}
  </TransitionGroup>
    )
  
  }
  const items = renderItems2(chars);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}
      {/* <ul className="char__grid">{items}</ul> */}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default CharList;
