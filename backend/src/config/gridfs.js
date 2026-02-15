import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let gridFSBucket;

const initGridFS = (connection) => {
  const db = connection.getClient().db(connection.name);
  gridFSBucket = new GridFSBucket(db, {
    bucketName: "encrypted_files",
  });
  console.log("✅ GridFS Initialized");
  return gridFSBucket;
};

const getGridFSBucket = () => {
  if (!gridFSBucket) {
    throw new Error("GridFS not initialized. Call initGridFS first.");
  }
  return gridFSBucket;
};

export { initGridFS, getGridFSBucket };
