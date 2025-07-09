// User Schema
export const createUserSchema = () => ({
  username: { type: "string", required: true, unique: true },
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  bio: { type: "string", default: "" },
  avatar: { type: "string", default: "" },
  followers: { type: "array", default: [] },
  following: { type: "array", default: [] },
  createdAt: { type: "date", default: new Date() },
})

// Post Schema
export const createPostSchema = () => ({
  content: { type: "string", required: true },
  image: { type: "string", default: "" },
  author: { type: "string", required: true }, // userId
  likes: { type: "array", default: [] },
  comments: { type: "array", default: [] },
  createdAt: { type: "date", default: new Date() },
  updatedAt: { type: "date", default: new Date() },
})

// Comment Schema
export const createCommentSchema = () => ({
  content: { type: "string", required: true },
  author: { type: "string", required: true }, // userId
  postId: { type: "string", required: true },
  createdAt: { type: "date", default: new Date() },
})
