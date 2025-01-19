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

    // Extract the player from the team
    const player = team.players.find((p) => p._id.toString() === playerId);

    if (!player) {
      return new Response(
        JSON.stringify({ error: "Player details could not be extracted." }),
        { status: 404 }
      );
    }

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

      // Add the new player to the existing listing
      const updatedListing = await TransferMarket.findOneAndUpdate(
        { seller: sellerId },
        {
          $push: {
            player: {
              ...player.toObject(),
              team: { ...team.toObject(), players: undefined },
              sellPrice,
            },
          },
        },
        { new: true }
      );

      listing = updatedListing;
    } else {
      // Create a new listing if none exists for this seller
      listing = await TransferMarket.create({
        player: [
          {
            ...player.toObject(),
            team: { ...team.toObject(), players: undefined },
            sellPrice,
          },
        ],
        seller: sellerId,
        sellPrice,
      });
    }

    // Remove the player from the seller's team
    team.players = team.players.filter((p) => p._id.toString() !== playerId);
    await team.save();

    return new Response(JSON.stringify({ success: true, listing }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error listing player:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { playerId, buyerId } = await req.json();

    // Find the listing in the transfer market
    const listing = await TransferMarket.findOne({ "player._id": playerId });

    if (!listing) {
      return new Response(
        JSON.stringify({ error: "Player not found in transfer market." }),
        { status: 404 }
      );
    }

    // Transfer player to buyer's team
    const buyerTeam = await Team.findOne({ owner: buyerId });
    if (!buyerTeam || buyerTeam.budget < listing.player.sellPrice) {
      return new Response(
        JSON.stringify({ error: "Insufficient budget or team not found." }),
        { status: 400 }
      );
    }

    buyerTeam.player.push(listing.player);
    buyerTeam.budget -= listing.player.sellPrice;

    // Increase seller's budget
    const sellerTeam = await Team.findOne({ owner: listing.seller });
    sellerTeam.budget += listing.player.sellPrice;

    await buyerTeam.save();
    await sellerTeam.save();

    // Remove player from transfer market
    await listing.delete();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { playerId, sellerId } = await req.json();

    // Find the listing in the transfer market
    const listing = await TransferMarket.findOne({
      "player._id": playerId,
      seller: sellerId,
    });

    if (!listing) {
      return new Response(
        JSON.stringify({ error: "Player not found in transfer market." }),
        { status: 404 }
      );
    }

    // Add player back to seller's team
    const sellerTeam = await Team.findOne({ owner: sellerId });
    sellerTeam.player.push(listing.player);
    await sellerTeam.save();

    // Remove player from transfer market
    await listing.delete();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
