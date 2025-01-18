import dbConnect from "@/app/lib/dbConnect";
import Team from "@/app/models/Team";

export async function GET(req) {
    // Extract query parameters from the URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response(
            JSON.stringify({ error: "User ID is required" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        await dbConnect();

        // Find team by owner ID
        const team = await Team.findOne({ owner: userId });

        return new Response(
            JSON.stringify({
                teamCreated: !!team,
                team: team || null,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
