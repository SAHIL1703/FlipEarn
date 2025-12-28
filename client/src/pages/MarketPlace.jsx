import React, { useState } from "react";
import { ArrowLeftIcon, FilterIcon, Verified } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"
import ListingCards from "../components/ListingCards";
import FilterSideBar from "../components/FilterSideBar";
const MarketPlace = () => {
  const navigate = useNavigate();
  const [showFilterPhone , setShowFilterPhone] = useState(false);
  const [filters ,setFilters] = useState({
    platform : null,
    maxPrice : 100000,
    minFollowers : 0,
    niche : null,
    verified : false,
    monetized :  false 
  })

  const {listings} = useSelector(state=>state.listing);
  const filteredListings = listings.filter((listing)=>{
    return true;
  })
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex items-center justify-between text-slate-500">
        <button
          className="flex items-center gap-2 py-5"
          onClick={() => {
            navigate("/");
            scrollTo(0, 0);
          }}
        >
          {" "}
          <ArrowLeftIcon className="size-4" /> Back to Home
        </button>
        <button className="flex sm:hidden items-center gap-2 py-5" onClick={()=>setShowFilterPhone(true)}>
          {" "}
          <FilterIcon className="size-4" /> Filters
        </button>
      </div>



      <div className="relative flex items-start justify-between gap-8 pb-8">
        {/* Filter  */}
        
          <FilterSideBar setFilters={setFilters} filters={filters} showFilterPhone={showFilterPhone} setShowFilterPhone={setShowFilterPhone}/>
        

        {/* Social Profile List  */}
        <div className="flex-1 grid xl:grid-cols-2 gap-4">
          {filteredListings.sort((a,b)=>a.featured ? -1 : b.featured ? 1 : 0).map((listing , index)=>(
            <ListingCards key={index} listing={listing}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
