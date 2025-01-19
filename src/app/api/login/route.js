import dbConnect from "@/app/lib/dbConnect";
import Team from "@/app/models/Team";
import User from "@/app/models/User";
import { createTeam } from "@/app/utils/teamGenerator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await dbConnect();

    // Find user by email
    let user = await User.findOne({ email }).select("+password");
    let isNewUser = false;

    if (!user) {
      // If user doesn't exist, register a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ email, password: hashedPassword });
      isNewUser = true;
    } else {
      // Validate password for existing user
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Check if user already has a team
    const existingTeam = await Team.findOne({ owner: user._id });

    if (isNewUser && !existingTeam) {
      // Create team in the background
      createTeam(user._id).catch(console.error);
    }

    return new Response(
      JSON.stringify({
        message: isNewUser
          ? "User registered successfully"
          : "Login successful",
        token,
        isNewUser,
        userId: user._id,
      }),
      {
        status: isNewUser ? 201 : 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
