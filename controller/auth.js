const userDB = require("../model/user");
const bcryptjs = require("bcryptjs");


const controller = {
    //   login 
    async login(req, res) {
        try{
            const { email, password } = req.body;

            // if email or password does not exists then send an error message
            if (!email)
            return res.status(400).json({ status: false, message: "Email is Required" });
            if (!password)
            return res
                .status(400)
                .json({ status: false, message: "Password is Required" });

            const user = await userDB.findOne({ email });

            // if user does not exists then send an error message
            if (!user)
            return res
                .status(401)
                .json({ message: "user does not exists", status: false });

            // if password is incorrect then send an error message or else send a logged in message
            const isPasswordCorrect = await bcryptjs.compare(password, user.password);
            if(!isPasswordCorrect) return res.status(401).json({message:"Password is incorrect", status: false});
            res.status(200).json({ message: "logged in", id: user._id, status: true });
        }
        catch(error){
            res.status(500).json({error, status: false});
        }
    },

    // register 
    async register (req,res) {
        try{
            const { userName, email, password} = req.body;
             // if email or password or user name does not exists then send an error message
             if (!email)
             return res.status(400).json({ status: false, message: "Email is Required" });
             if (!password)
             return res
                 .status(400)
                 .json({ status: false, message: "Password is Required" });
             if (!userName)
             return res
                 .status(400)
                 .json({ status: false, message: "Name is Required" });
 
             const user = await userDB.findOne({ email });
 
             // if user exists then send an error message
             if (user)
             return res
                 .status(403)
                 .json({ message: "user exists", status: false });

            // adding the user to the database
            const isSalt = await bcryptjs.genSalt(10);
            const hashPassword = await bcryptjs.hash(password, isSalt);
            const addUser = await userDB.create({email, userName, password: hashPassword});
            res
            .status(200)
            .json({ status: true, message: "Registered Suceccfully" });
            console.log(addUser);
        }
        catch(error){
            console.log(error)
            res.status(500).json({error, status: false});
        }
    }
};


module.exports = controller;