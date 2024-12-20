import React from 'react';

function PickupLocation() {
  return (
    <div>
      <div>
        <select className=" pr-7.5 pl-7.5 border border-gray-300 h-60px text-xl">
          <option value="">Select a pickup location</option>
          <option value="Ajman">Al Jurf Industrial 1 - Ajman</option>
          <option value="Sharjah">Sharjah</option>
        </select>
      </div>
      <div className="pickup-location-container border-gray-300 rounded-md">
        <div className="map-placeholder h-96 bg-gray-200 mt-4 text-center flex items-center justify-center">
          Google Map Placeholder
        </div>
      </div>
      <div>
        <div className="pickup-location mt-4">
          <h4 className="text-25px font-medium border-b-2 border-grey pb-5">
            Our Pickup Location
          </h4>
          <p className="mt-0 text-sm mb-2.5">
            You can review this order before its final
          </p>
        </div>
        <button
          type="button"
          className="next-button p-2  bg-orange-500 text-white w-177px h-60px hover:bg-orange-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PickupLocation;
