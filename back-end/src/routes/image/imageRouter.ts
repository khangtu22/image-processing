import {NextFunction, Request, Response, Router} from "express";
import imageParams from "../../middlewares/imageParams";
import fs from "fs";
import sharp from "sharp";
import path from "path";

const router = Router();

const resize = async (req: Request, res: Response, next: NextFunction) => {
    const width: string = req.query.width as string;
    const height: string = req.query.height as string;
    const inputFile: string = req.query.imageId as string; // Assuming the filename is in the request params
    const inputFolderPath = './assets/full';
    const outputFolderPath = './assets/thumb';

    try {
        const inputFilePath = path.join(inputFolderPath, inputFile);
        const outputFile = `${inputFile.split('.')[0]}_${width}x${height}.${inputFile.split('.')[1]}`;
        let outputFilePath = path.join(outputFolderPath, outputFile);

        // Check if the input file exists
        if (!fs.existsSync(inputFilePath)) {
            return res.status(404).json({message: 'Input file not found.'});
        }

        // Check if the output file exists, if it does, modify the filename to make it unique
        let counter = 1;
        while (fs.existsSync(outputFilePath)) {
            const fileNameWithoutExt = `${inputFile.split('.')[0]}_${width}x${height}_${counter}`;
            outputFilePath = path.join(outputFolderPath, `${fileNameWithoutExt}.${inputFile.split('.')[1]}`);
            counter++;
        }

        await sharp(inputFilePath)
            .resize(parseInt(width), parseInt(height))
            .toFile(outputFilePath);
        res.status(200).json({message: 'ok'});

        next();
    } catch (err) {
        return res.status(500).json({message: 'Error resizing image.'});
    }
};

router.get("/", imageParams.validateImageParams, resize, (req, res) => {
});

export default router;