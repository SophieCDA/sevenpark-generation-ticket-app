import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import icons from "@/constants/icons";

interface SearchInputProps<T> {
  initialQuery: string;
  placeholder: string;
  items: T[];
  searchKey: keyof T;
  onResultsChange: (results: T[]) => void;
}

const SearchInput = <T extends { [key: string]: any }>({
  initialQuery,
  placeholder,
  items,
  searchKey,
  onResultsChange,
}: SearchInputProps<T>) => {
  const [query, setQuery] = useState<string>(initialQuery);

  useEffect(() => {
    if (query.trim() === "") {
      onResultsChange(items);
    } else {
      const filteredResults = items.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(query.toLowerCase())
      );
      onResultsChange(filteredResults);
    }
  }, [query, items, searchKey, onResultsChange]);

  return (
    <View
      className={`border-2 border-black-200 w-full h-16 px-4 bg-black-100
            rounded-2xl focus:border-secondary items-center flex-row space-x-4`}
    >
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#cdcde0"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query.trim()) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            );
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
