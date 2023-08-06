import imageRouter from "./image/imageRouter";
import {Application} from "express-serve-static-core";
import path from 'path';
import fs from 'fs';
import sizeOf from 'image-size';
import multer from "multer";

const imagesFolder = path.join(__dirname, '../../assets/full');
const transformedImagesFolder = path.join(__dirname, '../../assets/thumb');
export default function (app: Application) {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './upload')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })

    const upload = multer({
        dest: 'upload/',
        storage: storage
    })

    app.use('/api/image', imageRouter);

    app.get('/', (req, res) => {
        const redirectUrl = new URL('/api/image', 'http://' + req.get('host'));
        return res.redirect(redirectUrl.toString());
    });

    app.get('/images', (req, res) => {
        fs.readdir(imagesFolder, (err, files) => {
            if (err) {
                return res.status(500).json({error: 'Error reading the images folder.'});
            }

            const imageFiles = files.filter((file) => {
                const fileExtension = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension);
            });

            const imageDetails = imageFiles.map((file) => {
                const imagePath = path.join(imagesFolder, file);
                const dimensions = sizeOf(imagePath); // Get the dimensions (width and height) of the image
                const {size, mtime} = fs.statSync(imagePath); // Get the size of the image in bytes
                return {
                    id: file,
                    url: file,
                    width: dimensions.width,
                    height: dimensions.height,
                    sizeInBytes: size,
                    dateEdited: mtime,
                };
            });
            // @ts-ignore
            imageDetails.sort((a, b) => b.dateEdited - a.dateEdited);
            res.json({images: imageDetails});
        });
    });

    app.get('/transformed-images', (req, res) => {
        fs.readdir(transformedImagesFolder, (err, files) => {
            if (err) {
                return res.status(500).json({error: 'Error reading the images folder.'});
            }

            const imageFiles = files.filter((file) => {
                const fileExtension = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension);
            });

            const imageDetails = imageFiles.map((file) => {
                const imagePath = path.join(transformedImagesFolder, file);
                const dimensions = sizeOf(imagePath); // Get the dimensions (width and height) of the image
                const {size, mtime} = fs.statSync(imagePath); // Get the size of the image in bytes

                return {
                    id: file,
                    url: file,
                    width: dimensions.width,
                    height: dimensions.height,
                    sizeInBytes: size,
                    dateEdited: mtime,
                };

            });

            // @ts-ignore
            imageDetails.sort((a, b) => b.dateEdited - a.dateEdited);
            res.json({images: imageDetails});
        });
    });

    app.post('/upload', upload.single('file'), (req, res) => {

        if (!req.file) {
            return res.status(400).json({error: 'No file uploaded'});
        }

        const filename = Date.now() + req.file.originalname;
        fs.renameSync(req.file.path, path.join('assets/full/', filename));

        return res.json({message: 'File uploaded successfully'});
    });


    app.get('/image/thumb', (req, res) => {
        const imageName = req.query.imageId as string;
        const imagePathInThumb = path.join(transformedImagesFolder, imageName); // Replace with the path to your image file
        let imageStream = fs.createReadStream(imagePathInThumb);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', 'inline; filename="image.jpg"'); // Change the filename if needed
        imageStream.pipe(res);
    });

    app.get('/image/stock', (req, res) => {
        const imageName = req.query.imageId as string;
        const imagePathInStock = path.join(imagesFolder, imageName); // Replace with the path to your image file
        let imageStream = fs.createReadStream(imagePathInStock);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', 'inline; filename="image.jpg"'); // Change the filename if needed
        imageStream.pipe(res);
    });
}
