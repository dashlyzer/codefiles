import { NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Connection from "@/models/Connection";
import Meeting from "@/models/Meeting";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_taplyzer_jwt_key_2026";

function getUserIdFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  const tokenMatch = cookieHeader.match(/taplyzer_auth_token=([^;]+)/);
  if (!tokenMatch) return null;
  try {
    const decoded: any = jwt.verify(tokenMatch[1], JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { connectionToken, startTime, durationMinutes } = await req.json();

    if (!connectionToken || !startTime || !durationMinutes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const connection = await Connection.findOne({ token: connectionToken });
    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    }

    // Determine roles
    const isUserA = connection.userA.toString() === userId;
    const isUserB = connection.userB.toString() === userId;

    if (!isUserA && !isUserB) {
      return NextResponse.json({ error: "Unauthorized for this connection" }, { status: 403 });
    }

    const attendeeId = isUserA ? connection.userB : connection.userA;

    // Fetch names for the event summary
    const [organizer, attendee] = await Promise.all([
      User.findById(userId).select("name"),
      User.findById(attendeeId).select("name")
    ]);

    // Use Centralized Platform Refresh Token
    const platformRefreshToken = process.env.GOOGLE_PLATFORM_REFRESH_TOKEN;
    
    if (!platformRefreshToken) {
      return NextResponse.json({ error: "Platform Google Calendar not configured. Please add GOOGLE_PLATFORM_REFRESH_TOKEN to .env.local" }, { status: 500 });
    }

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
    );

    oauth2Client.setCredentials({
      refresh_token: platformRefreshToken
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    const event = {
      summary: `Taplyzer Meeting: ${organizer?.name || "User"} & ${attendee?.name || "User"}`,
      description: `Meeting scheduled via Taplyzer platform.`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "UTC",
      },
      conferenceData: {
        createRequest: {
          requestId: `taplyzer-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    // Create the event on the organizer's calendar WITHOUT inviting the attendee!
    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: event,
    });

    const googleEventId = response.data.id;
    const meetLink = response.data.hangoutLink;

    if (!googleEventId || !meetLink) {
      throw new Error("Failed to generate Google Meet link");
    }

    const newMeeting = await Meeting.create({
      connectionId: connection._id,
      organizerId: userId,
      attendeeId: attendeeId,
      startTime: startDate,
      endTime: endDate,
      googleEventId,
      meetLink,
    });

    // Optionally push the meeting to connection's meetingIds
    connection.meetingIds = connection.meetingIds || [];
    connection.meetingIds.push(newMeeting._id);
    await connection.save();

    return NextResponse.json(newMeeting, { status: 201 });

  } catch (error) {
    console.error("Failed to schedule meeting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const url = new URL(req.url);
    const connectionToken = url.searchParams.get("connectionToken");

    let query: any = {
      $or: [{ organizerId: userId }, { attendeeId: userId }],
    };

    if (connectionToken) {
      const connection = await Connection.findOne({ token: connectionToken });
      if (!connection) {
        return NextResponse.json({ error: "Connection not found" }, { status: 404 });
      }
      query.connectionId = connection._id;
    }

    const meetings = await Meeting.find(query)
      .populate("organizerId", "name")
      .populate("attendeeId", "name")
      .populate("connectionId", "token userABizName userBBizName")
      .sort({ startTime: 1 });

    // Also get if the user has google calendar connected
    const user = await User.findById(userId);

    return NextResponse.json({
      meetings,
      googleCalendarConnected: !!user?.googleEmail,
      googleEmail: user?.googleEmail
    });

  } catch (error) {
    console.error("Failed to fetch meetings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
