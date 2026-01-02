import React, { useState } from "react";
import { ArrowLeftIcon, FilterIcon, Verified } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {useSelector} from "react-redux"
import ListingCards from "../components/ListingCards";
import FilterSideBar from "../components/FilterSideBar";
const MarketPlace = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
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

    if(filters.platform && filters.platform.length > 0){
      if(!filters.platform.includes(listing.platform)) return false;
    }
    
    if(filters.maxPrice){
      if(listing.price > filters.maxPrice) return false;
    }

    if(filters.minFollowers){
      if(listing.follower_count < filters.minFollowers) return false;
    }

    if(filters.niche && listing.niche !== filters.niche) return false;

    if(filters.verified && listing.verified !== filters.verified) return false;

    if(filters.monetized && listing.monetized !== filters.monetized) return false;

    if(search){
      const trimmed = search.trim()
      if(
        !listing.title.toLowerCase().includes(trimmed.toLowerCase()) &&
        !listing.username.toLowerCase().includes(trimmed.toLowerCase()) &&
        !listing.description.toLowerCase().includes(trimmed.toLowerCase()) &&
        !listing.niche.toLowerCase().includes(trimmed.toLowerCase()) &&
        !listing.platform.toLowerCase().includes(trimmed.toLowerCase())
      ){
        return false
      }
    }
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
