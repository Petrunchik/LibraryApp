import { useContext } from "react";
import { BooksContext } from "../context/BooksContext";
import FilterMenu from "./FilterMenu"
import GenreMenu from "./GenreMenu"
import SortingMenu from "./SortingMenu"

function BooksToolbar({ numberOfBooks }) {
  const {
          bookList
      } = useContext(BooksContext)

    return (
      <div className="controls-bar">
        {/* Блок сортировки и фильтрации (выпадающие меню) */}
        <div className="dropdown-group">
          <SortingMenu bookList={bookList}/>
          <FilterMenu/>
          {/* <GenreMenu/> */}
        </div>

        <div className="result-info">
          <i className="far fa-copy" style={{marginRight: '8px'}}></i>Найдено {numberOfBooks} изданий
        </div>
      </div>
    )
}

export default BooksToolbar