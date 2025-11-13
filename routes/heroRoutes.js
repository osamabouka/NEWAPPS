const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const heroPath = path.join(__dirname, "../data/mockContentHero.json");

router.get("/hero", (req, res) => {
  try {
    const data = fs.readFileSync(heroPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la lecture du fichier" });
  }
});

app.post("/editor/hero", (req, res) => {
  const filePath = path.join(process.cwd(), "data", "mockContentHero.json")
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lecture fichier" })
    const json = JSON.parse(data)
    json.slides.push(req.body)
    fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur écriture fichier" })
      res.json({ message: "✅ Slide ajoutée avec succès !" })
    })
  })
})

router.post("/hero", (req, res) => {
  const { author, title, image, link } = req.body;
  if (!author || !title || !image || !link)
    return res.status(400).json({ error: "Tous les champs sont requis" });

  try {
    const data = fs.readFileSync(heroPath, "utf-8");
    const json = JSON.parse(data);
    json.slides.push({ author, title, image, link });

    fs.writeFileSync(heroPath, JSON.stringify(json, null, 2), "utf-8");
    res.json({ message: "✅ Hero ajouté avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l’écriture du fichier" });
  }
});

module.exports = router;
