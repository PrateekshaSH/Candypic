const mongoose = require("mongoose");

const MONGO_LOCAL = "mongodb://127.0.0.1:27017/candypic";
const MONGO_ATLAS =
	"mongodb+srv://prateekshasatish:Prateeksha12@cluster0.6a4au.mongodb.net/candypic?retryWrites=true&w=majority&appName=Cluster0";

module.exports = () => {
	mongoose
		.connect(MONGO_ATLAS)
		.then(() => console.log("connection successful"))
		.catch((err) => console.log(err));
};
