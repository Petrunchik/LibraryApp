import { useState, useContext } from "react"
import { BooksContext } from "../context/BooksContext";

function SortingMenu() {
    const {
            setSortQuery,
        } = useContext(BooksContext)
    const options = [
        {title: "Все книги", icon: "fas fa-check-circle", action: "allBooks"},
        {title: "", icon: "divider"},
        // {title:"По популярности" , icon: "fas fa-fire", action: "popularitySort"},
        {title:"По названию (А-Я)", icon : "fas fa-arrow-up-a-z", action: "nameAscSort"},
        {title:"По названию (Я-А)" , icon: "fas fa-arrow-down-z-a", action: "nameDescSort"},
        // {title:"Новинки сначала" , icon: "fas fa-calendar", action: "newestSort"},
        {title:"По рейтингу" , icon: "fas fa-star", action: "ratingSort"},
    ]
    const [selectedSorting, setSelectedSorting] = useState({title: "Все книги", icon: "fas fa-check-circle"})
    const pickSorting = (option) => {
        console.log(option)
        setSelectedSorting(option)
        setSortQuery(option.action)
    }
    return (
        <div className="custom-dropdown">
            <div className="dropdown-btn">
              <i className="fas fa-arrow-down-wide-short"></i> Сортировка
              <i className="fas fa-chevron-down" style={{marginLeft: '6px'}}></i>
            </div>
            <div className="dropdown-menu">
                {options.map((element, index) => (
                    element.icon === "divider" ? 
                        <div key={index} className="divider"></div> :
                        <div 
                        key={index}
                        className={`dropdown-item ${selectedSorting.title === element.title ? "active" : ""}`}
                        onClick={() => pickSorting(element)}
                        >
                        <i className={element.icon}></i>
                        {element.title}
                        </div>
                    ))}
            </div>
          </div>
    )
}

export default SortingMenu