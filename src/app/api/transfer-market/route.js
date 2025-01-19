import dbConnect from "@/app/lib/dbConnect";
import TransferMarket from "@/app/models/TransferMarket";
import Team from "@/app/models/Team";

export async function POST(req) {
  try {
    await dbConnect();

    const { playerId, sellPrice, sellerId } = await req.json();
    console.log(playerId, sellPrice, sellerId, "Incoming data");

    // Find the team of the seller and check if the player exists
    const team = await Team.findOne({
      owner: sellerId,
      "players._id": playerId,
    });
    console.log(team, "Team found");

    if (!team) {
      return new Response(
        JSON.stringify({ error: "Player not found in the seller's team." }),
        { status: 404 }
      );
    }

    // Extract the player from the team with all properties
    const player = team.players.find((p) => p._id.toString() === playerId);

    if (!player) {
      return new Response(
        JSON.stringify({ error: "Player details could not be extracted." }),
        { status: 404 }
      );
    }

    // Create player object with all properties
    const playerData = {
      _id: player._id,
      name: player.name,
      position: player.position,
      value: player.value,
      stats: {
        attack: player.stats.attack,
        defense: player.stats.defense,
        speed: player.stats.speed
      },
      sellPrice: sellPrice,
      originalTeam: {
        id: team._id,
        name: team.name,
        owner: team.owner
      }
    };

    // Check if a listing for the same seller already exists in the transfer market
    let listing = await TransferMarket.findOne({ seller: sellerId });

    if (listing) {
      // Check if the player is already listed by this seller
      const isPlayerAlreadyListed = listing.player.some(
        (p) => p._id.toString() === playerId
      );

      if (isPlayerAlreadyListed) {
        return new Response(
          JSON.stringify({ error: "Player already listed in the market." }),
          { status: 400 }
        );
      }

      // Add the new player to the existing listing with all properties
      const updatedListing = await TransferMarket.findOneAndUpdate(
        { seller: sellerId },
        {
          $push: {
            player: playerData
          },
        },
        { new: true }
      );

      listing = updatedListing;
    } else {
      // Create a new listing if none exists for this seller
      listing = await TransferMarket.create({
        player: [playerData],
        seller: sellerId
      });
    }

    // Remove the player from the seller's team
    team.players = team.players.filter((p) => p._id.toString() !== playerId);
    await team.save();

    return new Response(JSON.stringify({ 
      success: true, 
      listing,
      message: "Player successfully listed in transfer market"
    }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error listing player:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    await dbConnect()

    // Modify the populate to include all required fields and ensure proper path
    const listings = await TransferMarket.find()
      .populate({
        path: 'seller',
        select: 'name email',
        model: 'User' 
      })
      .lean()

    return new Response(
      JSON.stringify({
        success: true,
        count: listings.length,
        listings,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching transfer market listings:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch transfer market listings',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
