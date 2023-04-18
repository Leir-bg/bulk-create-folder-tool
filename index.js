const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { getPortPromise } = require("portfinder");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/", async (req, res, next) => {
	let {
		folderdir,
		foldername,
		foldercount,
		subfolderprefix,
		filefrom,
		fileto,
		fileprefix,
		fileupload,
		withfiles,
		hassub,
		withfile,
	} = req.body;

	try {
		if (!folderdir) throw new Error("Path cannot be empty.");
		if (!foldername) throw new Error("Folder name cannot be empty.");

		const dirPath = path.join(folderdir, foldername);
		await fs.mkdir(dirPath, { recursive: true });

		console.log(`Folder created at ${dirPath}`);

		if (hassub === "on") {
			for (let i = 1; i <= foldercount; i++) {
				const subFolderPath = path.join(
					folderdir,
					foldername,
					subfolderprefix + i
				);
				await fs.mkdir(subFolderPath, { recursive: true });
				console.log(`Created folder "${subfolderprefix}${i}"`);
			}
		}

		if (withfiles === "on") {
			const totalFileCount = Math.abs(filefrom - fileto);
			let data = "";

			if (withfile === "on") {
				data = await fs.readFile(fileupload, "utf8");
			}

			for (let i = 0; i <= totalFileCount; i++) {
				const filePath = path.join(
					dirPath,
					`${fileprefix}${parseInt(filefrom) + i}.html`
				);

				await fs.writeFile(filePath, data);

				console.log(`Created file ${filePath}`);
			}
		}
	} catch (err) {
		console.error(err);
	}

	res.status(200).redirect('/');
});

getPortPromise({ startPort: 8000, stopPort: 8050 })
    .then((openport) => {
        app.listen(openport, 'localhost', () => {
            console.log(`Listening at port: ${openport}`);
            require('open')(`http://localhost:${openport}`);
        })
    })
    .catch((err) => {
        console.error(err);
    })