const express = require('express');
let Parser = require('rss-parser');
const app = express();
const port = 3000;

let parser = new Parser({
  headers: {'User-Agent': 'Chrome'}
});

app.get('/ping', (req, res) => {
  var response = {answer: 'pong'}
  res.status(200).json(response)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

async function fetchRssFeed(feedUrl) {
  let feed = await parser.parseURL(feedUrl);
  return feed.items.map(item =>{
    return{
      title: item.title,
      link: item.link,
      date: item.pubDate
    }
  });
};

const Url = 'https://peterattiadrive.libsyn.com/rss';
app.get('/news', async(req,res)=>{
  await fetchRssFeed(Url)
    .then(data =>{
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(500).json({
        status: 'error',
        message: 'No news found',
      })
    })
})