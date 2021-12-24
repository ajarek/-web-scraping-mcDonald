const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const {port} = require('./config')
const app = express()
const articles = []

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
const URL = 'https://mcdonalds.pl/nasze-menu/'

axios(URL)
    .then(res => {
        const htmlData = res.data
        const $ = cheerio.load(htmlData)
        const listItems = $('.product_thumb')

        listItems.each(function (idx, el) {
            const image = $(el).children('a').children('img').attr('src')
            const title = $(el).children('a').children('.product_thumb-text').text()
            const titleURL1 = $(el).children('a').attr('href')

            titleURL = 'https://mcdonalds.pl' + titleURL1
            if (/^https/.test(image) && title && titleURL) {
                articles.push({
                    image,
                    title,
                    titleURL
                })
            }
        })
    }).catch(err => console.error(err))
app.get('/', (req, res) => {
    res.render('index', {
        resources: articles
    })
})
app.listen(port, () => {
    console.log(`start backend port:${port}`);
})