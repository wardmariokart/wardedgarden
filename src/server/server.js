import express from "express";

const app = express();
const port = 3000;

app.get("/", (_request, response) => {
	response.send('ward');
})

app.get("/about", (_request, response) => {
	response.send('you dont need to know anything');
})

// don't know what this does exactly, do I need it?
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});