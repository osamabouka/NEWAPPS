import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'

const app = express();
const PORT = 5000;
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(process.cwd(), 'data');

const readJson = (file) => {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
};

const writeJson = (file, data) => {
  const filePath = path.join(DATA_DIR, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

app.get('/api/:file', (req, res) => {
  const { file } = req.params;
  const data = readJson(file);
  if (!data) return res.status(404).json({ error: 'File not found' });
  res.json(data);
});

app.post('/editor/hero', (req, res) => {
  try {
    const newSlide = req.body;
    const file = 'mockContentHero.json';
    const data = readJson(file);
    if (!data || !Array.isArray(data.slides)) return res.status(500).json({ error: 'Invalid hero file' });
    data.slides.push(newSlide);
    writeJson(file, data);
    res.json({ message: 'Hero slide ajouté avec succès !' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/editor/hero', async (req, res) => {
  try {
    const hero = req.body;
    const filePath = path.join(__dirname, 'data', 'mockContentHero.json');

    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    jsonData.slides.push(hero);
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');

    res.json({ message: 'Slide ajouté avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’ajout du slide' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

app.post('/editor/podcast', (req, res) => {
  try {
    const { id, title, description, thumbnail, videoUrl } = req.body;
    if (!id) return res.status(400).json({ error: 'ID manquant' });

    const file = 'mockContentPod.json';
    const data = readJson(file);
    if (!data || !Array.isArray(data.Podcasts)) return res.status(500).json({ error: 'Invalid podcasts file' });

    const podcast = data.Podcasts.find(p => String(p.id) === String(id));
    if (!podcast) return res.status(404).json({ error: 'Podcast not found' });
    if (title) podcast.title = title;
    if (description) podcast.description = description;
    if (thumbnail) podcast.thumbnail = thumbnail;
    if (videoUrl) podcast.videoUrl = videoUrl;

    if (videoUrl) podcast.duration = '0:05'; 

    const today = new Date();
    podcast.date = `${today.getDate()} ${today.toLocaleString('fr-FR', { month: 'short' })} ${today.getFullYear()}`;

const epFile = 'mockContentEp.json';
const epData = readJson(epFile) || { Episodes: [] };
const maxId = epData.Episodes.reduce((max, ep) => Math.max(max, Number(ep.id)), 0);
const newEpisodeId = maxId + 1;

// استخدام البيانات من podcast المحدد
const podcastSlug = podcast.slug || '';
const podcastHost = podcast.host || '';

const newEpisode = {
  id: newEpisodeId,
  podcastId: Number(id),
  title: title || '',
  description: description || '',
  thumbnail: thumbnail || '',
  videoUrl: videoUrl || '',
  duration: videoUrl ? '0:05' : '0:00',
  date: `${today.getDate()} ${today.toLocaleString('fr-FR', { month: 'short' })} ${today.getFullYear()}`,
  slug: podcastSlug,
  host: podcastHost
};

epData.Episodes.push(newEpisode);
writeJson(epFile, epData);

    writeJson(file, data);
    res.json({ message: `Podcast ID ${id} mis à jour avec succès !` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/editor/documentary', (req, res) => {
  try {
    const { title, description, thumbnail, videoUrl, slug, host, category } = req.body;
    if (!title || !videoUrl) return res.status(400).json({ error: 'Titre et vidéo requis' });

    const file = 'mockContentDoc.json';
    const data = readJson(file) || { Documentary: [] };
    const maxId = data.Documentary.reduce((max, doc) => Math.max(max, Number(doc.id)), 0);
    const newId = maxId + 1;

    const today = new Date();
    const newDoc = {
      id: newId,
      title,
      description: description || '',
      thumbnail: thumbnail || '',
      videoUrl,
      duration: videoUrl ? '0:05' : '0:00',
      date: `${today.getDate()} ${today.toLocaleString('fr-FR', { month: 'long' })} ${today.getFullYear()}`,
      slug: slug || '',
      host: host || '',
      category: category || ''
    };

    data.Documentary.push(newDoc);
    writeJson(file, data);

    res.json({ message: 'Documentary ajouté avec succès !', newDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/editor/film', (req, res) => {
  try {
    const { title, thumbnail, videoUrl, description } = req.body;
    const file = 'mockContentFilm.json';
    const data = readJson(file) || { Films: [] };
    const maxId = data.Films.reduce((max, f) => Math.max(max, Number(f.id)), 0);
    const newId = maxId + 1;
    const today = new Date();
    const newFilm = {
      id: newId,
      title: title || '',
      thumbnail: thumbnail || '',
      videoUrl: videoUrl || '',
      description: description || '',
      duration: videoUrl ? '0:05' : '0:00', 
      date: `${today.getDate()} ${today.toLocaleString('fr-FR', { month: 'short' })} ${today.getFullYear()}`
    };
    data.Films.push(newFilm);
    writeJson(file, data);

    res.json({ message: `Film ID ${newId} ajouté avec succès !` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const USER = 'editor'
const PASS = 'secret123'
const SECRET = 'bouka_secret_key' 
app.post('/api/login', (req, res) => {
  const { user, password } = req.body

  if (user === USER && password === PASS) {
    const token = jwt.sign({ user }, SECRET, { expiresIn: '1d' })
    return res.json({ token })
  }

  res.status(401).json({ error: 'Invalid credentials' })
})

app.get('/api/protected', (req, res) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'No token provided' })

  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, SECRET)
    res.json({ message: `Welcome ${decoded.user}` })
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
})

app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'))
