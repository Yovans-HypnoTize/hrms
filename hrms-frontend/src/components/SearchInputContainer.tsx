import React, { useEffect, useState } from "react";
import { mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";

interface SearchInputContainerProps {
    triggerAPICall: (value:any) => void
}

const SearchInputContainer: React.FC<SearchInputContainerProps> = ({triggerAPICall}) => {
  const [searchString, setSearchString] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {

    const handler = setTimeout(() => {
        setDebouncedSearch(searchString)
    },500)

    return () => {
        clearTimeout(handler)
    }

  },[searchString])

  useEffect(() => {
        triggerAPICall(debouncedSearch)
  },[debouncedSearch])


  return (
    <div
      className="col-4 d-flex justify-content-start p-0 "
      style={{ gap: "10px" }}
    >
      <>
        <input
          type="text"
          className="search-option"
          placeholder="Search By Keywords"
          value={searchString}
          onChange={(e: any) => {
            setSearchString(e.target.value);
          }}
        />
        <Icon path={mdiMagnify} size={1} className="search-icon" />
      </>
    </div>
  );
};

export default SearchInputContainer;
