"use client";

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import useDebounce from "../useDebounce";

// 1️⃣ Define the context type
interface SearchBarContextType {
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  debouncedSearch: string;
}

// 2️⃣ Create the context with proper type
const SearchBarContext = createContext<SearchBarContextType | undefined>(
  undefined
);

// 3️⃣ Define props type
interface SearchBarProviderProps {
  children: ReactNode;
}

// 4️⃣ Component with typed props
export const SearchBarProvider = ({ children }: SearchBarProviderProps) => {
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
