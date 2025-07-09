import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db("social_media")
    const posts = db.collection("posts")
    const users = db.collection("users")

    const allPosts = await posts.find({}).sort({ createdAt: -1 }).limit(20).toArray()

    // Populate author information
    const postsWithAuthors = await Promise.all(
      allPosts.map(async (post) => {
        const author = await users.findOne({ _id: new ObjectId(post.author) }, { projection: { password: 0 } })
        return {
          ...post,
          author: author,
        }
      }),
    )

    return NextResponse.json(postsWithAuthors)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const userId = await getAuthUser(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, image } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("social_media")
    const posts = db.collection("posts")

    const result = await posts.insertOne({
      content,
      image: image || "",
      author: userId,
      likes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      message: "Post created successfully",
      postId: result.insertedId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
