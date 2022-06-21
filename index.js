import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || "8000";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import 'dotenv/config' 

import file from "./data/user_swipe.json";
import fetchCore from "./src/fetchCore.js";


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.render("index", { title: "Home", data: file });
});

app.get("/user", (req, res) => {
    res.render("user", { title: "Dislikes", data: file  });
});

app.get("/likes", (req, res) => {
    res.render("likes", { title: "Likes", data: file.filter((el) => el.isLike === true)  });
});

app.get("/dislikes", (req, res) => {
    res.render("dislikes", { title: "Dislikes", data: file.filter((el) => el.isLike === false)  });
});



app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});



const main = async() => {
    try {

        fetchCore()

    } catch(err) {
        throw err
    }
}

main()