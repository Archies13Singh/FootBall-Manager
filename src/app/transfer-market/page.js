"use client";
import { useEffect, useState } from "react";
import TransferMarketUI from "./TransferMarketUI";
import Link from "next/link";

export default function TrensferMarketPlayerList() {
  const [players, setPlayers] = useState([]);
  const [errors, setError] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/transfer-market");
        const data = await response.json();
        setPlayers(data?.listings);
      } catch (error) {
        setError("Something went wrong while fetching players.");
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Left Content */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Transfer Market
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1">
              View available players and make transfers
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <div className="inline-flex bg-gray-800 rounded-lg p-1 gap-1 border ">
              <Link
                href="/dashboard"
                className=" px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Your Team
              </Link>
            </div>
          </div>
        </div>

        {players.length > 0 ? (
          <TransferMarketUI listings={players} />
        ) : (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin border-4 border-t-4 border-blue-500 border-solid rounded-full w-12 h-12"></div>
          </div>
        )}

        {errors && <p className="text-red-500 text-center">{errors}</p>}
      </div>
    </div>
  );
}
