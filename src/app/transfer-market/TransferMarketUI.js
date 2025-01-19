"use client";
import { useState, useEffect } from "react";
import { Shield, Users, Gauge, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const positionColors = {
  GK: "bg-yellow-500",
  DEF: "bg-blue-500",
  MID: "bg-green-500",
  FWD: "bg-red-500",
};

export function TransferMarketUI({ listings }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 6000000]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    const filtered = listings.flatMap((listing) =>
      listing.player
        .filter((player) => {
          const matchesSearch =
            player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.seller.email
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            player.originalTeam.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          const matchesPrice =
            player.sellPrice >= priceRange[0] &&
            player.sellPrice <= priceRange[1];
          return matchesSearch && matchesPrice;
        })
        .map((player) => ({
          ...player,
          sellerEmail: listing.seller.email,
          listingCreatedAt: listing.createdAt,
        }))
    );

    // Check if the filtered players are as expected
    console.log(filtered);
    setFilteredPlayers(filtered);
  }, [searchTerm, priceRange, listings]);

  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const isMinSlider = e.target.id === "minPrice";

    setPriceRange((prev) => {
      if (isMinSlider) {
        return [value, Math.max(value, prev[1])];
      } else {
        return [Math.min(prev[0], value), value];
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by player, team, or seller"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex-2 flex-col gap-2 w-full sm:w-64">
          <label className="text-white text-sm">Price Range</label>
          <div className="relative h-2 bg-gray-700 rounded-md">
            <div
              className="absolute h-full bg-blue-500 rounded-md"
              style={{
                left: `${(priceRange[0] / 6000000) * 100}%`,
                right: `${100 - (priceRange[1] / 6000000) * 100}%`,
              }}
            ></div>
            <input
              type="range"
              id="minPrice"
              min="0"
              max="6000000"
              step="1000"
              value={priceRange[0]}
              onChange={handlePriceRangeChange}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <input
              type="range"
              id="maxPrice"
              min="0"
              max="6000000"
              step="1000"
              value={priceRange[1]}
              onChange={handlePriceRangeChange}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-white text-xs">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPlayers.map((player) => (
          <div
            key={player._id}
            className="bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white truncate">
                  {player.name}
                </h3>
                <span
                  className={`
                  px-2 py-1 text-xs font-medium text-white rounded-full shrink-0
                  ${positionColors[player.position]}
                `}
                >
                  {player.position}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Team: {player.originalTeam.name}
              </p>
              <p className="text-sm text-gray-400 mb-2">
                Value: {formatCurrency(player.value)}
              </p>
              <p className="text-sm text-gray-400">
                Sell Price: {formatCurrency(player.sellPrice)}
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2 text-gray-300">
                      <Shield className="w-4 h-4" /> Attack
                    </span>
                    <span className="text-sm font-medium text-white">
                      {player.stats.attack}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${player.stats.attack}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4" /> Defense
                    </span>
                    <span className="text-sm font-medium text-white">
                      {player.stats.defense}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${player.stats.defense}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2 text-gray-300">
                      <Gauge className="w-4 h-4" /> Speed
                    </span>
                    <span className="text-sm font-medium text-white">
                      {player.stats.speed}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${player.stats.speed}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 text-xs text-gray-400">
              <p>Seller: {player.sellerEmail}</p>
              <p>
                Listed: {new Date(player.listingCreatedAt).toLocaleString()}
              </p>
            </div>
            <div className=" bg-red-500 text-white px-3 py-2 rounded-md m-2 text-center text-base">
              <button
                onClick={() => {}}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { TransferMarketUI as default };
