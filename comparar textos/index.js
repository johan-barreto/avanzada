const express = require('express');
const { PorterStemmer, TfIdf } = require('natural');
const Sentiment = require('sentiment');
const ejs = require('ejs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { similarity: undefined, sentiment1: undefined, sentiment2: undefined });
});

app.post('/compare', (req, res) => {
  const { text1, text2 } = req.body;

  const tfidf = new TfIdf();
  const sentiment = new Sentiment();

  // Calcular similitud de texto
  const stemmedText1 = PorterStemmer.tokenizeAndStem(text1);
  const stemmedText2 = PorterStemmer.tokenizeAndStem(text2);
  stemmedText1.forEach((word) => tfidf.addDocument(stemmedText1));
  const similarity = tfidf.tfidf(stemmedText2, 0);

  // Calcular sentimiento de texto
  const sentiment1 = sentiment.analyze(text1).comparative;
  const sentiment2 = sentiment.analyze(text2).comparative;

  res.render('index', { similarity, sentiment1, sentiment2 });
});

app.listen(port, () => {
  console.log(`Servidor web activo en http://localhost:${port}`);
});


