"use client";

import { createContext, useState } from "react";
import useDebounce from "../useDebounce";

const SearchBarContext = createContext("");

export const SearchBarProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  return (
    <SearchBarContext.Provider
      value={{
        searchInput,
        setSearchInput,
        debouncedSearch,
      }}
    >
      {children}
    </SearchBarContext.Provider>
  );
};

export default SearchBarContext;
