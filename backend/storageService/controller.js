const prisma = require("../config/db.js");

const creator = async (req, res) => {
    try {
        const { title, description, isPublic } = req.body;

        if (!title) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const project = await prisma.project.create({
            data: {
                title,
                description: description ? description : "",
                isPublic: isPublic ? isPublic : false,
                htmlCode: "",
                cssCode: "",
                jsCode: "",
                userId: req.user.userId
            }
        })
        return res.status(201).json({ message: "Project created successfully", project: project })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getallCodes = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: req.user.userId
            }
        })
        return res.status(200).json({ message: "Projects fetched successfully", projects: projects })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getCodebyId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Code id is required" });
        }
        const project = await prisma.project.findUnique({
            where: {
                id: id
            }
        })
        return res.status(200).json({ message: "Codes fetched successfully", project: project })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteCode = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Code id is required" });
        }
        const project = await prisma.project.delete({
            where: {
                id: id
            }
        })
        return res.status(200).json({ message: "Codes deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { htmlCode, cssCode, jsCode } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Code id is required" });
        }

        const project = await prisma.project.update({
            where: {
                id: id
            },
            data: {
                htmlCode: htmlCode || "",
                cssCode: cssCode || "",
                jsCode: jsCode || ""
            }
        })
        return res.status(200).json({ message: "Codes updated successfully", project: project })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateMetadata = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Project id is required" });
        }

        if (!title && !description) {
            return res.status(400).json({ message: "At least one field (title or description) is required to update" });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;

        const project = await prisma.project.update({
            where: {
                id: id
            },
            data: updateData
        })

        return res.status(200).json({ message: "Project metadata updated successfully", project: project })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { creator, getallCodes, getCodebyId, deleteCode, updateCode, updateMetadata }