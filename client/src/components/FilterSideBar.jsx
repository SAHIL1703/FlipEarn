import { FilterIcon, X, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSideBar = ({
  showFilterPhone,
  setShowFilterPhone,
  filters,
  setFilters,
}) => {
    const [searchParams ,setSearchParams] = useSearchParams()
    const [search , setSearch] = useState(searchParams.get("search") || "");
    const navigate = useNavigate();
    const onChangeSearch =(e)=>{
        if(e.target.value){
            setSearchParams({search : e.target.value});
            setSearch(e.target.value);
        }else{
            navigate('/marketplace');
            setSearch("");
        }
    }
  return (
    <div
      className={`${
        showFilterPhone ? "max-sm:fixed" : "max-sm:hidden"
      } max-sm:inset-0 z-100 max-sm:h-screen max-sm:overflow-scroll bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-24 md:min-w-[300px]`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-700">
            <FilterIcon className="size-4" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            <X className="size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 transition-color cursor-pointer" />
            <button
              onClick={() => setShowFilterPhone(false)}
              className="sm:hidden text-sm border text-gray-700 px-3 py-1 rounded"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 sm:max-h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar">
        {/* Search Bar  */}
        <div className="flex items-center justify-between">
          <input
          onChange={onChangeSearch}
            value={search}
            type="text"
            placeholder="Search by username, platform, niche, etc."
            className="w-full text-sm px-3 py-2 border  border-gray-300 rounded-md outline-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
