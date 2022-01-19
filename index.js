//MAIN BACKEND FILE
//"test": "echo \"Error: no test specified\" && exit 1"

//const db = require("./database");
//const mongoose = require('mongoose'); //MongoDB
require('dotenv').config()
const BookModel = require("./database/books");
const AuthorModel = require("./database/authors");
const PublicationModel = require("./database/publications");

const express = require("express");


const app = express();
app.use(express.json());

// Connecting MongoDB.....................................................................................
// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://aditi_jais:123456789sa@cluster0.k5yxu.mongodb.net/book-company?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const bcollection = client.db("book-company").collection("books").findOne({ISBN: "12345THREE"});
//   //console.log(bcollection);
//   // perform actions on the collection object
//   bcollection.then((data)=>console.log(data)).catch((err)=>console.log(err));
// });
// client.close();
var mongoose = require('mongoose');
const { update } = require("./database/books");
const { updatea } = require("./database/authors");
const { updatep } = require("./database/publications");
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log("CONNECTION ESTABLISHED"));
// Connecting MongoDB.....................................................................................

//http://localhost:3000/
app.get("/", (req,res) => {
    return res.json({"WELCOME": `to my Backend Software for the Book Company`});
});

//http://localhost:3000/books
app.get("/books", async(req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

//http://localhost:3000/book-isbn/
app.get("/book-isbn/:isbn", async (req,res) => {
    const {isbn} = req.params;
    const getSpecificBook= await BookModel.findOne({ISBN: isbn});
    if(getSpecificBook===null) {
        return res.json({"error": `No book found of ISBN : ${isbn}`});
    }
    return res.json(getSpecificBook);
});

//http://localhost:3000/book-category/
app.get("/book-category/:category", async (req,res) => {
    const {category} = req.params;
    const getSpecificBooks= await BookModel.find({category:category});
    if(getSpecificBooks.length === 0) {
        return res.json({"error": `No book found of category : ${category}`});
    }
    return res.json(getSpecificBooks);
});

//http://localhost:3000/authors
app.get("/authors", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

//http://localhost:3000/author-id/1
app.get("/author-id/:id", async (req,res) => {
    let {id} = req.params;
    id = Number(id);
    // const getSpecificAuthor= db.authors.filter((author) => author.id === id);
    // if(getSpecificAuthor.length === 0) {
    //     return res.json({"error": `No author found of id : ${id}`});
    // }
    // return res.json(getSpecificAuthor[0]);
    const getSpecificAuthor= await AuthorModel.findOne({id: id});
    if(getSpecificAuthor===null) {
        return res.json({"error": `No Author found of id : ${id}`});
    }
    return res.json(getSpecificAuthor);
});

//http://localhost:3000/author-isbn/12345Two
app.get("/author-isbn/:isbn", async (req,res) => {
    const {isbn} = req.params;
    // const getSpecificAuthor= db.authors.filter((author) => author.books.includes(isbn));
    // if(getSpecificAuthor.length === 0) {
    //     return res.json({"error": `No author found of isbn : ${isbn}`});
    // }
    // return res.json(getSpecificAuthor);
    const getSpecificAuthor= await AuthorModel.findOne({ISBN: isbn});
    if(getSpecificAuthor===null) {
        return res.json({"error": `No Author found of ISBN : ${isbn}`});
    }
    return res.json(getSpecificAuthor);
});

http://localhost:3000/publications
app.get("/publications", async (req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

//http://localhost:3000/publication-isbn/12345Two
app.get("/publication-isbn/:isbn", (req,res) => {
    const {isbn} = req.params;
    //isbn = Number(isbn);
    //const getSpecificPublication= db.publications.filter((publication) => publication.ISBN === isbn);
    const getSpecificPublication= db.publications.filter((publication) => publication.books.includes(isbn));
    if(getSpecificPublication.length === 0) {
        return res.json({"error": `No publication found of isbn : ${isbn}`});
    }
    return res.json(getSpecificPublication);
});

// http://localhost:3000/book
app.post("/book", (req,res) => {
    const addNewBook = BookModel.create(req.body);
    return res.json({
        books: addNewBook,
        message: "Book was added !!!"
    });
});

// http://localhost:3000/author
app.post("/author", (req,res) => {
    const addNewAuthor = AuthorModel.create(req.body);
    return res.json({
        authors: addNewAuthor,
        message: "Author was added !!!"
    });
})

// http://localhost:3000/publications
app.post("/publications", (req,res) => {
    const addNewPublication = PublicationModel.create(req.body);
    return res.json({
        publications: addNewPublication,
        message: "Publication was added !!!"
    })
});

// http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn", async (req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {isbn} = req.params;
    // db.books.forEach((book) => {
    //     if(book.ISBN===isbn) {
    //         console.log({...book , ...req.body});
    //         return {...book , ...req.body};
    //     }
    //     return book;
    // })
    const updateBook = await BookModel.findOneAndUpdate({ISBN: isbn}, req.body, {new:true});  //new:true to get the updated data
    return res.json({bookUpdated: updateBook, message: "Book was Updated !!!"});  // new:false we dont get updated data
});

// http://localhost:3000/author-update/1
app.put("/author-update/:id", async (req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {id} = req.params;
    // db.books.forEach((author) => {
    //     if(author.id===id) {
    //         console.log({...author , ...req.body});
    //         return {...author , ...req.body};
    //     }
    //     return author;
    // })
    // return res.json(db.authors);
    const updateAuthor = await AuthorModel.findOneAndUpdate({id: id}, req.body, {new:false}); 
    return res.json({AuthorUpdated: updateAuthor, message: "Author was Updated !!!"}); 
});

// http://localhost:3000/publication-update/1
app.put("/publication-update/:id", async (req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {id} = req.params;
    // db.publications.forEach((publication) => {
    //     if(publication.id===id) {
    //         console.log({...publication , ...req.body});
    //         return {...publication , ...req.body};
    //     }
    //     return publication;
    // })
    // return res.json(db.publications);
    const updatePublication = await PublicationModel.findOneAndUpdate({id: id}, req.body, {new:false}); 
    return res.json({PublicationUpdated: updatePublication, message: "Publication was Updated !!!"}); 
});

//http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn", async (req,res) => {
    // console.log(req.params);
    const {isbn} =req.params;
//     const filteredBooks = db.books.filter((book)=>book.ISBN!== isbn);
//     // console.log(filteredBooks);
//     db.books = filteredBooks;
//     return res.json(db.books);
const deleteBook = await BookModel.deleteOne({ISBN: isbn}); 
    return res.json({bookdeleted: deleteBook, message: "Book was Deleted !!!"}); 
 });

//http://localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id", async (req,res) => {
    // console.log(req.params);
    // let {isbn,id} =req.params;
    // id = Number(id);
    // db.books.forEach((book) => {
    //     if(book.ISBN===isbn) {
    //        // console.log({...publication , ...req.body});
    //        if(!book.authors.includes(id)){
    //            return;
    //        }
    //        book.authors = book.authors.filter((author) => author!==id);
    //         return book;
    //     }
    //     return book;
    // })
    // return res.json(db.books);
    // const deleteAuthor = await AuthorModel.deleteOne({ISBN: isbn}); 
    // return res.json({authordeleted: deleteAuthor, message: "Author was Deleted !!!"}); 
    const {isbn, id} = req.params;
    let getSpecificBook = await BookModel.findOne({ISBN: isbn});
    if(getSpecificBook===null) {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    else {
        getSpecificBook.authors.remove(id);
        const updateBook = await BookModel.findOneAndUpdate({ISBN: isbn}, getSpecificBook, {new: true});
        return res.json( {bookUpdated: updateBook, message: "Author was Deleted from the Book !!!"} );
    }
});

//http://localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn", async (req,res) => {
    let {id,isbn} =req.params;
    id = Number(id);
//     db.authors.forEach((author) => {
//         if(author.id===id) {
//            // console.log({...publication , ...req.body});
//            if(!author.books.includes(isbn)){
//                return;
//            }
//            author.books = author.books.filter((author) => author!==isbn);
//             return author;
//         }
//         return author;
//     })
//     return res.json(db.authors);
//const {id, isbn} = req.params;
let getSpecificBook = await BookModel.findOne({id: id});
if(getSpecificBook===null) {
    return res.json({"error": `No Book found for the id of ${id}`});
}
else {
    getSpecificBook.authors.remove(isbn);
    const updateBook = await BookModel.findOneAndUpdate({id: id}, getSpecificBook, {new: true});
    return res.json( {bookUpdated: updateBook, message: "Author was Deleted from the Book !!!"} );
}
});

//http://localhost:3000/author-delete/1
app.delete("/author-delete/:id", async (req,res) => {
    let {id} =req.params;
    id = Number(id);
    // const filteredAuthors = db.authors.filter((author)=>author.id!== id);
    // // console.log(filteredBooks);
    // db.authors = filteredAuthors;
    // return res.json(db.authors);
    const deleteauthor = await AuthorModel.deleteOne({id: id}); 
    return res.json({authordeleted: deleteauthor, message: "author was Deleted !!!"}); 
    
});

//http://localhost:3000/publication-delete/1
app.delete("/publication-delete/:id", async (req,res) => {
    let {id} =req.params;
    id = Number(id);
    // const filteredPublications = db.publications.filter((publication)=>publication.id!== id);
    // // console.log(filteredBooks);
    // db.publications = filteredPublications;
    // return res.json(db.publications);
    const deletePublication = await PublicationModel.deleteOne({id: id}); 
    return res.json({publicationdeleted: deletePublication, message: "Publication was Deleted !!!"}); 
});



app.listen(3000,() => {
    console.log("My express app is running.....")
})