const prisma = require("../config/db.js");

// Get all public projects for browse/feed
const getPublicProjects = async (req, res) => {
  try {
    const { page = 1, limit = 12, sortBy = "recent" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let orderBy = {};
    switch (sortBy) {
      case "popular":
        orderBy = { likes: { _count: "desc" } };
        break;
      case "forks":
        orderBy = { forks: { _count: "desc" } };
        break;
      case "recent":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const projects = await prisma.project.findMany({
      where: {
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            forks: true,
          },
        },
        likes: req.user
          ? {
              where: {
                userId: req.user.userId,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
      orderBy: orderBy,
      skip: skip,
      take: parseInt(limit),
    });

    const total = await prisma.project.count({
      where: {
        isPublic: true,
      },
    });

    return res.status(200).json({
      message: "Public projects fetched successfully",
      projects: projects.map((project) => ({
        ...project,
        isLiked: req.user ? project.likes.length > 0 : false,
        likesCount: project._count.likes,
        forksCount: project._count.forks,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Like a project
const likeProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Project id is required" });
    }

    // Check if project exists and is public
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.isPublic) {
      return res.status(403).json({ message: "Cannot like a private project" });
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.userId,
          projectId: id,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Project already liked" });
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        userId: req.user.userId,
        projectId: id,
      },
    });

    return res
      .status(201)
      .json({ message: "Project liked successfully", like });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Unlike a project
const unlikeProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Project id is required" });
    }

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.userId,
          projectId: id,
        },
      },
    });

    if (!existingLike) {
      return res.status(404).json({ message: "Like not found" });
    }

    // Delete like
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    return res.status(200).json({ message: "Project unliked successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Fork a project
const forkProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Project id is required" });
    }

    // Check if project exists and is public
    const originalProject = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!originalProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!originalProject.isPublic) {
      return res.status(403).json({ message: "Cannot fork a private project" });
    }

    // Create forked project
    const forkedProject = await prisma.project.create({
      data: {
        title: `${originalProject.title} (Fork)`,
        description: originalProject.description
          ? `Forked from @${originalProject.user.username}'s project\n\n${originalProject.description}`
          : `Forked from @${originalProject.user.username}'s project`,
        htmlCode: originalProject.htmlCode,
        cssCode: originalProject.cssCode,
        jsCode: originalProject.jsCode,
        isPublic: false, // Forked projects start as private
        userId: req.user.userId,
        forkedFromId: id,
      },
    });

    // Record the fork
    await prisma.fork.create({
      data: {
        userId: req.user.userId,
        projectId: id,
      },
    });

    return res.status(201).json({
      message: "Project forked successfully",
      project: forkedProject,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get project likes
const getProjectLikes = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Project id is required" });
    }

    const likes = await prisma.like.findMany({
      where: {
        projectId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Likes fetched successfully",
      likes,
      count: likes.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get user's liked projects
const getUserLikes = async (req, res) => {
  try {
    const likes = await prisma.like.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        project: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
            _count: {
              select: {
                likes: true,
                forks: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "User likes fetched successfully",
      projects: likes.map((like) => ({
        ...like.project,
        likedAt: like.createdAt,
        likesCount: like.project._count.likes,
        forksCount: like.project._count.forks,
      })),
    });
  } catch (error) {
    console.error("Error in getUserLikes:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getPublicProjects,
  likeProject,
  unlikeProject,
  forkProject,
  getProjectLikes,
  getUserLikes,
};
