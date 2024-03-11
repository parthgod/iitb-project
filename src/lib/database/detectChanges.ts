import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import ModificationHistory from "./models/modificationHistory";

const uri =
  "mongodb+srv://doshikevin1012:kevinbdoshi@powersystem.wj1up9g.mongodb.net/?retryWrites=true&w=majority&appName=PowerSystem";
let latestChange: any = null;
let lastProcessedTimestamp: any = null;
const processedEvents = new Set();

function closeChangeStream(changeStream: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Closing the change stream");
      resolve(changeStream.close());
    }, 1000);
  });
}

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const session = await getServerSession(authOptions);

    const pipeline = [{ $match: { operationType: { $in: ["insert", "update", "delete"] } } }];

    const changeStream = client
      .db("evently")
      .watch(pipeline, { fullDocument: "updateLookup", fullDocumentBeforeChange: "whenAvailable" });

    changeStream.on("change", async (change: any) => {
      const eventId = change._id._data;
      // console.log("Change detected:", change);
      if (processedEvents.has(eventId)) {
        console.log("Duplicate event. Ignoring.");
        return;
      } else {
        processedEvents.add(eventId);
        latestChange = change;
        console.log(change);
        const alreadyExists = await ModificationHistory.findOne({ date: new Date(change?.wallTime) });
        if (!alreadyExists && change?.ns?.coll !== "modificationhistories") {
          let modificationHistory: any;
          modificationHistory = {
            userId: session?.user.id,
            databaseName: change?.ns?.coll,
            operationType: change?.operationType,
            date: change?.wallTime,
            document: {
              id: change?.documentKey?._id,
              documentBeforeChange: change?.fullDocumentBeforeChange || null,
              documentAfterChange: change?.updateDescription?.updatedFields || change?.fullDocument || null,
            },
          };
          const duplicateCheck = await ModificationHistory.findOne(modificationHistory);
          if (!duplicateCheck) await ModificationHistory.create(modificationHistory);
        }
      }

      // You may emit this change to the client using socket.io
    });

    // await closeChangeStream(changeStream);
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);

export function getLatestChange() {
  return latestChange;
}
