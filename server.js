const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const connectDB = require("./database");
const app = express();
const port = 8080;

connectDB();
const User = require("./models/userModel");
const Contact = require("./models/contactModel");

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the HTML file
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "Login.html"));
});

app.get("/register", (req, res) => {
	res.sendFile(path.join(__dirname, "Registration.html"));
});

app.post("/register", async (req, res) => {
	const { email, password, firstName, lastName, gender } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const newUser = new User({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			gender,
		});

		await newUser.save();
		res.redirect("/login");
	} catch (err) {
		console.log(err);
		return res.status(500).send("Error saving data", err);
	}
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).send("User not found");
		}
		const match = await bcrypt.compare(password, user.password);
		if (match) {
			console.log("Login successful");
			res.redirect("/");
		} else {
			res.status(400).send("Invalid credentials");
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send("Error while login", err);
	}
});

app.post("/contact", async (req, res) => {
	const { name, subject, email, message } = req.body;

	try {
		const newContact = new Contact({
			name,
			subject,
			email,
			message,
		});

		await newContact.save();
		console.log("Contact data saved");
		res.redirect("/");
		// res.send(
		// 	"<h1>Thank you for contacting us. We will get back to you soon.</h1>"
		// );
	} catch (err) {
		console.log("Error saving contact data: ", err);
		return res.status(500).send("Error saving data");
	}
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
