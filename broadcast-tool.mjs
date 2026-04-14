/**
 * CineMax Broadcast Tool 🚀
 * Use this to send notifications to multiple users at once.
 *
 * Usage:
 * 1. Add tokens to the TOKENS array.
 * 2. Run: node broadcast-tool.mjs
 */

const TOKENS = [
  "ExponentPushToken[XXXXXXXXXXXXXX]", // User 1
  "ExponentPushToken[YYYYYYYYYYYYYY]", // User 2
  // Add more tokens here...
];

const MESSAGE = {
  title: "CineMax Update! 🍿",
  body: "Check out the latest blockbuster releases today!",
  data: { movieId: 634649 }, // Optional: Link to a specific movie
};

async function sendBroadcast() {
  console.log(`📡 Sending broadcast to ${TOKENS.length} devices...`);

  const messages = TOKENS.map((token) => ({
    to: token,
    sound: "default",
    title: MESSAGE.title,
    body: MESSAGE.body,
    data: MESSAGE.data,
  }));

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log("✅ Broadcast sent result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Broadcast failed:", error);
  }
}

sendBroadcast();
