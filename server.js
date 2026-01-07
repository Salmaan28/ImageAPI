
let http = require('http');
const url = require('url');
const { createCanvas, loadImage } = require('canvas');

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (parsedUrl.pathname !== '/image') {
        res.statusCode = 404;
        return res.end('Not Found')
    };

    try {
        const image = await loadImage(parsedUrl.searchParams.get('imageUrl'));

        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0)

        const text = parsedUrl.searchParams.get('text') || 'Set custom text in the request URL query';

        ctx.font = '36px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(text, image.width / 2, image.height - 20);

        const buffer = canvas.toBuffer('image/png');
        res.statusCode = 200;
        res.setHeader("Content-Type", "image/png");
        res.end(buffer)
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end("Error generating image");
    };

}).listen(3000, () =>{
    console.log("Server running at http://localhost:3000")
});