import { ChevronDown, FilterIcon, X, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSideBar = ({
  showFilterPhone,
  setShowFilterPhone,
  filters,
  setFilters,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const navigate = useNavigate();
  const curreny = import.meta.env.VITE_CURRENCY || "$";
  const onChangeSearch = (e) => {
    if (e.target.value) {
      setSearchParams({ search: e.target.value });
      setSearch(e.target.value);
    } else {
      navigate("/marketplace");
      setSearch("");
    }
  };

  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    price: true,
    followers: true,
    niche: true,
    status: true,
  });

  //Platform Name
  const platforms = [
    { value: "youtube", label: "Youtube" },
    { value: "instagram", label: "instagram" },
    { value: "tiktok", label: "Tiktok" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitch", label: "Twitch" },
    { value: "discord", label: "Discord" },
  ];

  const niches = [
    { value: "lifestyle", label: "Lifestyle" },
    { value: "fitness", label: "Fitness" },
    { value: "food", label: "Food" },
    { value: "travel", label: "Travel" },
    { value: "tech", label: "Tech" },
    { value: "gaming", label: "Gaming" },
    { value: "fashion", label: "Fashion" },
    { value: "beauty", label: "Beauty" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "music", label: "Music" },
    { value: "art", label: "Art" },
    { value: "sport", label: "Sport" },
    { value: "health", label: "Health" },
    { value: "finance", label: "Finance" },
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const onFilterChange = (newFilter) => {
    setFilters({ ...filters, ...newFilter });
  };

  const onClearFilters = () => {
    if (search) {
      navigate("/market");
    }
    setFilters({
      platform: null,
      maxPrice: 100000,
      minFollowers: 0,
      niche: null,
      verified: false,
      monetized: false,
    });
  };

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
            <X
              onClick={() => onClearFilters()}
              className="size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 transition-color cursor-pointer"
            />
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

        {/* Platform Filter  */}
        <div>
          <button
            onClick={() => toggleSection("platform")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="text-sm font-medium text-gray-800">
              Platform
            </label>
            <ChevronDown
              className={`size-4 transition transform ${
                expandedSections.platform ? "rotate-180" : ""
              } `}
            />
          </button>

          {/* Displaying the platform list  */}
          {expandedSections.platform && (
            <div className="flex flex-col gap-3">
              {platforms.map((platform) => (
                <label
                  key={platform.value}
                  className="flex items-center gap-2 text-gray-700 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.platform?.includes(platform.value) || false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const current = filters.platform || [];
                      const updated = checked
                        ? [...current, platform.value]
                        : current.filter((p) => p !== platform.value);
                      onFilterChange({
                        ...filters,
                        platform: updated.length > 0 ? updated : null,
                      });
                    }}
                  />
                  <span>{platform.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range  */}
        <div>
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="text-sm font-medium text-gray-800">
              Price Range
            </label>
            <ChevronDown
              className={`size-4 transition transform ${
                expandedSections.price ? "rotate-180" : ""
              } `}
            />
          </button>

          {/* Displaying the Price Range  */}
          {expandedSections.price && (
            <div className="space-y-3 ">
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={filters.maxPrice || 100000}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                onChange={(e) => {
                  onFilterChange({
                    ...filters,
                    maxPrice: parseInt(e.target.value),
                  });
                }}
              />

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{curreny}0</span>
                <span>
                  {curreny}
                  {(filters.maxPrice || 100000).toString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Followers Range  */}
        <div>
          <button
            onClick={() => toggleSection("followers")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="text-sm font-medium text-gray-800">
              Minimum Followers
            </label>
            <ChevronDown
              className={`size-4 transition transform ${
                expandedSections.followers ? "rotate-180" : ""
              } `}
            />
          </button>

          {/* Displaying the Price Range  */}
          {expandedSections.followers && (
            <select
              onChange={(e) => {
                onFilterChange({
                  ...filters,
                  minFollowers: parseInt(e.target.value) || 0,
                });
              }}
              value={filters.minFollowers?.toString() || "0"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500 "
            >
              <option value="0">Any Amount</option>
              <option value="1000">1K+</option>
              <option value="10000">10k+</option>
              <option value="50000">50k+</option>
              <option value="100000">100k+</option>
              <option value="500000">500k+</option>
              <option value="1000000">1M+</option>
            </select>
          )}
        </div>

        {/* Niche Filter  */}
        <div>
          <button
            onClick={() => toggleSection("niche")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="text-sm font-medium text-gray-800">Niche</label>
            <ChevronDown
              className={`size-4 transition transform ${
                expandedSections.niche ? "rotate-180" : ""
              } `}
            />
          </button>

          {/* Displaying the Price Range  */}
          {expandedSections.niche && (
            <select
              onChange={(e) => {
                onFilterChange({
                  ...filters,
                  niche: e.target.value || null,
                });
              }}
              value={filters.niche || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500 "
            >
              <option value="0">Any Niches</option>
              {niches.map((niche) => (
                <option value={niche.value} key={niche.value}>
                  {niche.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Verification Status  */}
        <div>
          <button
            onClick={() => toggleSection("status")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="text-sm font-medium text-gray-800">
              Account Status
            </label>
            <ChevronDown
              className={`size-4 transition transform ${
                expandedSections.status ? "rotate-180" : ""
              } `}
            />
          </button>

          {/* Displaying the Price Range  */}
          {expandedSections.status && (
            <div className="space-y-3">
              {/* Verified Account  */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verified || false}
                  onChange={(e) => {
                    onFilterChange({ ...filters, verified: e.target.checked });
                  }}
                />
                <span className="text-sm text-gray-600">
                  Verified Accounts Only
                </span>
              </label>

              {/* Verified Account  */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.monetized || false}
                  onChange={(e) => {
                    onFilterChange({ ...filters, monetized: e.target.checked });
                  }}
                />
                <span className="text-sm text-gray-600">
                  Monetized Accounts Only
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
