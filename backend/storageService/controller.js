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
                userId: req.user.userId
            }
        })
        return res.status(201).json({ message: "Project created successfully", project: project })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
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
        console.log(error);
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
        console.log(error);
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
        return res.status(200).json({ message: "Codes deleted successfully"})  
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { creator, getallCodes, getCodebyId,deleteCode }