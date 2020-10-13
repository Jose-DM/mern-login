const router = require("express").Router();
const User = require("../models/userModel");
const bcyrpt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const auth = require("../middlewares/auth")

router.post("/register", async (req, res) => {
    try {
    let {email, password, passwordCheck, displayName} = req.body;
    
    //validation

    if(!email || !password || !passwordCheck)
        return res.status(400).json({msg: "Llenar los campos requeridos."});
    if(password.length < 5)
        return res.status(400).json({msg: "La contraseña debe ser al menos de 5 caracteres"});
    if(password !== passwordCheck)
        return res.status(400).json({msg: "La contraseñas no coinciden"});
    const existingUser = await User.findOne({email: email});
    if(existingUser)
        return res.status(400).json({msg: "Ya existe una cuenta con este email"});

    if(!displayName) displayName = email;

    const salt = await bcyrpt.genSalt();

    const passwordHash = await bcyrpt.hash(password, salt);
    
    const newUser = new User ({
        email,
        password: passwordHash,
        displayName
    });

    const savedUser = await newUser.save();
    res.json(savedUser);

    } catch (err){
        res.status(500).json({ error: err.message })
    }
});

router.post("/login", async(req, res) => {
    try{
    const {email, password} = req.body;
    // validate
    if(!email || !password){
        return res.status(400).json({msg: "Llenar los campos requeridos."});
    }
    // validar si existe el email ingresado en la bdd
    const user = await User.findOne({email});
    if(!user)
        return res.status(400).json({msg: "No existe una cuenta con este email"});
    // compara la pw del body con la pw de la bdd
    const isMatch = await bcyrpt.compare(password, user.password);
    if(!isMatch)
        return res.status(400).json({msg: "Contraseá incorrecta."});

    // creo el token pasando solo el id
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({
        token,
        user: {
            id: user._id,
            displayName: user.displayName,
            email: user.email,
        }
    })
    } catch(err) {
        res.status(500).json({error: err.message})
    }
});

router.delete("/delete", auth, async (req, res) => {
    try{
      const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    }catch(err) {
        res.status(500).json({error: err.message})
    }
});

router.post("/tokenIsValid", async (req, res) => {
  try{
  //verificar si existe un token
  const token = req.header("x-auth-token");
  if(!token) return res.json(false);

  // verificar que sea un token valido
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (!verified) return res.json(false);

  // verificar si existe el usuario en la bdd
  const user = await User.findById(verified.id);
  if(!user) return res.json(false);

  // si existe un token valido retorna true
  return res.json(true)

  }catch(err) {
  res.status(500).json({error: err.message})
   };
});

// esta ruta es para obtener los datos del user logeado
router.get("/", auth, async (req, res) => {
  //obtengo los datos del usuario
  const user = await User.findById(req.user);
  // y luego los mando al frontkk
  res.json({
    id: user._id,
    displayName: user.displayName
  });
})

module.exports = router;