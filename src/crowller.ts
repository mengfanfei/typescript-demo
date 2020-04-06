import superagent from 'superagent'
import cheerio from 'cheerio'

interface Course {
    title: string,
    count: number
}

class Crowller {
    private secret = 'x3b174jsx'
    private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
    getCourseInfo(html: string) {
        const $ = cheerio.load(html)
        const courseItems = $('.course-item')
        const courseInfos: Course[] = []
        courseItems.map((index,element) => {
            const descs = $(element).find('.course-desc')
            const title = descs.eq(0).text()
            const count = parseInt(descs.eq(1).text().split('：')[1])
            courseInfos.push({ title, count })
        })
        const result = {
            time: new Date().getTime(),
            data: courseInfos
        }
        console.log(result)
    }
    async getRawHtml() {
        const result = await superagent.get(this.url)
        this.getCourseInfo(result.text)
    }
    constructor() {
        this.getRawHtml()
    }
}
const crowller = new Crowller()