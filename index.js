import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;


const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "login",
    password : "Parthi",
    port : 5432
})


db.connect();




app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static("public"))

app.get("/", async (req,res) =>{

    res.render("index.ejs")

})

app.get("/signup", (req,res) =>{

    try {
        res.render("signup.ejs")
    } catch (err) {
        console.log(err)
    }

    
})


app.get("/error", (req, res) =>{
    res.render("erroe.ejs")
})

app.post("/signup", async (req,res) =>{


    const choice = req.body.mailid 
    console.log(choice)
    try {
        const result = await db.query('SELECT username FROM userinfo WHERE username = $1', [choice])
        console.log(result)
    if (result === choice) {

    }  else {
        const mailid = req.body.mailid
        const pass = req.body.pass
        const result = db.query("INSERT INTO userinfo (username, password) VALUES ($1, $2)", [mailid, pass])
        // console.log(result)
        res.redirect("/")
    }

    } catch (err) {
        console.log(err)
        res.render("error")
        console.log("user details dosnt exists")
        res.send("User details already exist")

        
    }   finally {
        console.log("user deatils doesnt exists")
    }
    

//     try {
//         const mailid = req.body.mailid
//         const pass = req.body.pass
//         const result = db.query("INSERT INTO userinfo (username, password) VALUES ($1, $2)", [mailid, pass])
//         res.redirect("/")
//     } catch (err) {
//         res.send("Username already exists") 
//         console.log(err)  
//     } finally {
//         res.send("Useername already exists")
//     }

    
})

app.post('/', async (req, res) => {
    const { email, password } = req.body;
    // try {
        const result = await db.query('SELECT * FROM userinfo WHERE email = $1 AND password = $2', [email, password]);
        const user = result.rows[0];
        if (user) {
            res.redirect('/error');
        } else {
            res.send('Incorrect email or password');
        }
    // } catch (error) {
    //     console.error('Error executing query', error);
    //     res.status(500).send('Internal Server Error');
    // }
});



app.listen(port, () =>{
    console.log(`The Server is running on port ${port}`)
})





