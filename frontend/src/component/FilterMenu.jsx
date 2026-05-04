import { useState, useContext } from "react"
import { BooksContext } from "../context/BooksContext";

function FilterMenu() {
  const {
    setFilterQuery,
  } = useContext(BooksContext)

  const options = [
    {title: "Все книги", icon: "fas fa-check-circle", action: "allBooks"},
    {title: "", icon: "divider"},
    // {title: "Художественная лит-ра", icon: "fas fa-book", action: "fiction"},
    // {title: "Научная фантастика", icon: "fas fa-flask", action: "sciFi"},
    // {title: "История", icon: "fas fa-landmark", action: "history"},
    // {title: "Романы", icon: "fas fa-heart", action: "romance"},
    // {title: "Детективы", icon: "fas fa-child", action: "detective"},
    // {title: "", icon: "divider"},
    {title: "В наличии", icon: "fas fa-circle-check", action: "inStock"},
    {title: "Ожидаемые", icon: "fas fa-clock", action: "expected"}
  ]
  const [selectedSorting, setSelectedSorting] = useState({title: "Все книги", icon: "fas fa-check-circle"})
  const pickSorting = (option) => {
        console.log(option)
        setSelectedSorting(option)
        setFilterQuery(option.action)
  }
  return (
    <div className="custom-dropdown">
      <div className="dropdown-btn">
        <i className="fas fa-sliders"></i> Фильтры
        <i className="fas fa-chevron-down"></i>
      </div>
      <div className="dropdown-menu style={{minWidth: '220px'}}">
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

export default FilterMenu