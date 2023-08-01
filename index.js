const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(async(req, res) => {
        try {
            const articles = await Article.find()
            res.send(articles);
        } catch (err) {
            res.send(err);
        }
    })
    .post(async(req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        try {
            const newArticle = new Article({
                title: title,
                content: content
            });
            newArticle.save();
            res.send("Article created successfully")
        } catch (err) {
            res.send(err)
        }
    })
    .delete(async(req, res) => {
        try {
            await Article.deleteMany();
            res.send("All articles deleted successfully!");
        } catch (err) {
            res.send(err);
        }
    });

app.route("/articles/:articleId")
    .get(async(req, res) => {
        const articleId = req.params.articleId;
        try {
            const foundArticle = await Article.findById(articleId);
            res.send(foundArticle);
        } catch (err) {
            res.send(err);
        };
    })
    .put(async(req, res) => {
        const articleId = req.params.articleId;
        try {
            await Article.findOneAndReplace({ _id: articleId }, {
                title: req.body.title,
                content: req.body.content,
            });
            res.send("Article changed successfully");
        } catch (err) {
            res.send(err)
        }
    })
    .patch(async(req, res) => {
        const articleId = req.params.articleId;
        try {
            await Article.findByIdAndUpdate(articleId, req.body);
            res.send("Article updated successfully");
        } catch (err) {
            res.send(err);
        }
    })
    .delete(async(req, res) => {
        const articleId = req.params.articleId;
        try {
            await Article.findByIdAndDelete(articleId);
            res.send("Article deleted successfully");
        } catch (err) {
            res.send(err);
        }
    });


app.listen(port, function() {
    console.log("Server started at port: " + port);
});