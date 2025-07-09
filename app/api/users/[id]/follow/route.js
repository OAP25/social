import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"

export async function POST(request, { params }) {
  try {
    const userId = await getAuthUser(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (userId === id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("social_media")
    const users = db.collection("users")

    const currentUser = await users.findOne({ _id: new ObjectId(userId) })
    const targetUser = await users.findOne({ _id: new ObjectId(id) })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isFollowing = currentUser.following.includes(id)

    if (isFollowing) {
      // Unfollow
      await users.updateOne({ _id: new ObjectId(userId) }, { $pull: { following: id } })
      await users.updateOne({ _id: new ObjectId(id) }, { $pull: { followers: userId } })
    } else {
      // Follow
      await users.updateOne({ _id: new ObjectId(userId) }, { $push: { following: id } })
      await users.updateOne({ _id: new ObjectId(id) }, { $push: { followers: userId } })
    }

    return NextResponse.json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      following: !isFollowing,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
