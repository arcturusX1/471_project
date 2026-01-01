import { GroupPost, Application } from "../models/model.js";

// Create a new group post
export const createPost = async (req, res) => {
  try {
    const {
      projectName,
      details,
      department,
      maxMembers,
      supervisorName,
      techStack,
      postedBy,
    } = req.body;

    // Initialize members array with poster if postedBy is provided
    const initialMembers = postedBy ? [{ user: postedBy, joinedAt: new Date() }] : [];

    const post = await GroupPost.create({
      projectName,
      details,
      department,
      maxMembers,
      supervisorName,
      techStack: techStack || [],
      postedBy,
      members: initialMembers,
    });

    // Set currentMembers based on members array length
    post.currentMembers = post.members.length;
    await post.save();

    const populatedPost = await GroupPost.findById(post._id)
      .populate("postedBy", "name email universityId profile")
      .populate("members.user", "name email universityId profile");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error creating group post:", err);
    res.status(400).json({ error: "Failed to create post", details: err.message });
  }
};

// Get all public posts (visible and active)
export const getPublicPosts = async (req, res) => {
  try {
    const posts = await GroupPost.find({ isVisible: true, status: "active" })
      .populate("postedBy", "name email department")
      .populate("members.user", "name email department")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching public posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Get posts by user (my posts)
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await GroupPost.find({ postedBy: userId })
      .populate("postedBy", "name email department")
      .populate("members.user", "name email department")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Get archived posts
export const getArchivedPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await GroupPost.find({
      postedBy: userId,
      status: "archived",
    })
      .populate("postedBy", "name email department")
      .populate("members.user", "name email department")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching archived posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await GroupPost.findById(req.params.id)
      .populate("postedBy", "name email universityId profile")
      .populate("members.user", "name email universityId profile");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const updated = await GroupPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("postedBy", "name email universityId profile")
      .populate("members.user", "name email universityId profile");

    if (!updated) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(400).json({ error: "Failed to update post", details: err.message });
  }
};

// Archive post
export const archivePost = async (req, res) => {
  try {
    const updated = await GroupPost.findByIdAndUpdate(
      req.params.id,
      { status: "archived", isVisible: false },
      { new: true }
    )
      .populate("postedBy", "name email universityId profile")
      .populate("members.user", "name email universityId profile");

    if (!updated) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error archiving post:", err);
    res.status(400).json({ error: "Failed to archive post" });
  }
};

// Apply to join a group post
export const applyToPost = async (req, res) => {
  try {
    const { applicantId } = req.body;
    const postId = req.params.id;

    if (!applicantId) {
      return res.status(400).json({ error: "Applicant ID is required" });
    }

    const post = await GroupPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.status !== 'active') {
      return res.status(400).json({ error: "Post is not accepting new members" });
    }

    if (post.currentMembers >= post.maxMembers) {
      return res.status(400).json({ error: "Team is already full" });
    }

    // Check if user is already a member
    const isAlreadyMember = post.members.some(member => 
      member.user.toString() === applicantId
    );
    
    if (isAlreadyMember) {
      return res.status(400).json({ error: "User is already a member of this team" });
    }

    // Add user to members
    post.members.push({
      user: applicantId,
      joinedAt: new Date()
    });

    await post.save();

    const updatedPost = await GroupPost.findById(postId)
      .populate("postedBy", "name email universityId profile")
      .populate("members.user", "name email universityId profile");

    res.json(updatedPost);
  } catch (err) {
    console.error("Error applying to post:", err);
    res.status(400).json({ error: "Failed to apply to post", details: err.message });
  }
};

// Leave a group post
export const leavePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const post = await GroupPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is a member
    const memberIndex = post.members.findIndex(member => 
      member.user.toString() === userId
    );
    
    if (memberIndex === -1) {
      return res.status(400).json({ error: "User is not a member of this team" });
    }

    // Remove user from members
    post.members.splice(memberIndex, 1);
    await post.save();

    const updatedPost = await GroupPost.findById(postId)
      .populate("postedBy", "name email universityId profile")
      .populate("members.user", "name email universityId profile");

    res.json(updatedPost);
  } catch (err) {
    console.error("Error leaving post:", err);
    res.status(400).json({ error: "Failed to leave post", details: err.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const deleted = await GroupPost.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Also delete related applications
    await Application.deleteMany({ groupPost: req.params.id });

    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

