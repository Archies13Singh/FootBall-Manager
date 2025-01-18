"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, Gauge, Wallet } from "lucide-react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const positionColors = {
  GK: "bg-blue-500",
  DEF: "bg-green-500",
  MID: "bg-yellow-500",
  ATT: "bg-red-500",
};

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [amount, setAmount] = useState();
  const [error, setError] = useState("");
  const [activePosition, setActivePosition] = useState("GK");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;

    const fetchTeams = async () => {
      try {
        const response = await fetch(`/api/team-status?userId=${userId}`);
        const data = await response.json();
        setAmount(data?.team?.budget);
        setTeams(data?.team?.players || []);
      } catch (err) {
        setError("Something went wrong while fetching teams.");
      }
    };

    fetchTeams();
  }, [router]);

  const positions = ["GK", "DEF", "MID", "ATT"];

  return (
    <div className=" bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Left Content */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Team Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1">
              Manage your team roster and view player statistics
            </p>
          </div>

          {/* Right Content */}
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-md px-4 py-2 shadow-md">
              <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full mr-2">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium">Earnings</p>
                <p className="text-sm font-bold">{formatCurrency(amount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-lg mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Position Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-800 rounded-lg p-1 gap-1">
            {positions.map((position) => (
              <button
                key={position}
                onClick={() => setActivePosition(position)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    activePosition === position
                      ? "bg-gray-700 text-white shadow-sm"
                      : "text-white"
                  }
                `}
              >
                {position}
              </button>
            ))}
          </div>

        </div>

        {/* Players Griddd */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams
            .filter((player) => player.position === activePosition)
            .map((player) => (
              <div
                key={player._id}
                className="bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between gap-2">
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
                  <p className="text-sm text-gray-400 mt-1">
                    Value: {formatCurrency(player.value)}
                  </p>
                </div>

                {/* Player Stats */}
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
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

                  <div className="space-y-2">
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

                  <div className="space-y-2">
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
            ))}
        </div>
      </div>
    </div>
  );
}
