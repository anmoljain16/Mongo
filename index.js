const dbConnect = require("./db/dbConnect")
const bcrypt = require("bcrypt")
const User = require ("./db/userModel")
const express = require("express")
const auth = require("./auth")
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 8080;

dbConnect()
app.use(express.json())

app.use(express.urlencoded({ extended: true }))


app.get('/', (request, response, next) => {
    response.json({
        message: "Hey!, This is your server response"

    })
    next();

})


app.post("/register", (request, response) => {

    console.log(request.body.password)

    bcrypt.hash(request.body.password, 10)
        .then((hashedPassword) => {
            console.log(hashedPassword)

            //create a new user instance and collect the data
        const user = new User({
            name: request.body.name,
            phone: request.body.phone,
            email: request.body.email,
            password: hashedPassword,
        })

            //save the user
            user
                .save()
                //return success if the new user is added to the database successfully
                .then((result) => {
                    response.status(201).send({
                        message: "User Created Successfully",
                        result
                    })
                })
                //catch error if the new user was not added successfully to the database
                .catch((error) => {
                    response.status(500).send({
                        message: "Error creating user",
                        error
                    })
                })

        }).catch((error) => {
            response.status(500).send({
                message: "Password was not hashed successfully",
                error
            })
        })

})


app.post("/login", (request, response) => {


    User.findOne({ email: request.body.email })
        //if email exists
        .then((user) => {
            console.log(user)
            bcrypt.compare(request.body.password, user.password)

                .then((passwordCheck) => {
                    console.log('passwordCheck', passwordCheck)

                    if (!passwordCheck) {
                        return response.status(400).send({
                            message: "Passwords do not match"

                        })
                    }



                    const token = jwt.sign({
                            userId: user._id,
                            userEmail: user.email
                        }, "ANMOL", { expiresIn: '24h' }
                    )



                    response.status(200).send({
                        message: 'Login Successfull',
                        email: user.email,
                        token
                    })



                })
                .catch((error) => {
                    response.status(400).send({
                        message: 'Passwords do not match',
                        error
                    })
                })



        }).catch((error) => {
        console.log(error);
        response.status(404).send({
            message: "Email not found",
            error
        })
    })

})



app.get("/public-endpoint", (req, res) => {
    res.json({
        message:"you are in public endpoint access by any one"
    })
})



app.get("/private-endpoint", auth, (req, res) => {
    res.json({
        message:"you are in private endpoint "
    })
})


app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})
