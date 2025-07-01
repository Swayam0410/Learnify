"use client";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { setRawInput, setDebouncedInput } from "../Redux/searchSlice";
import { RootState } from "@/lib/store";

const SearchBar = () => {
  const dispatch = useDispatch();
  const rawInput = useSelector((state: RootState) => state.search.rawInput);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedInput(rawInput));
    }, 500);

    return () => clearTimeout(timer);
  }, [rawInput, dispatch]);

  return (
    <Input
      placeholder="Search..."
      value={rawInput}
      onChange={(e) => dispatch(setRawInput(e.target.value))}
      className="pl-10 pr-4 py-2 w-full border rounded-md"
    />
  );
};

export default SearchBar;
