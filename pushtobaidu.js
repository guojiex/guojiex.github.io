const http = require('http')
const fs = require('fs')
const xml2js = require('xml2js')

var urls = []
const parser = new xml2js.Parser()
fs.readFile('./public/baidusitemap.xml', 'utf-8', (error, data) => {//先读取文件
    if (error) {
        console.log(error)
    } else {
        parser.parseString(data, (err, result) => {//xml转为json
            urls = result.urlset.url.map(obj => obj.loc)//读取所有url存到数组
            const reqData = urls.join('\n')//用换行符把所有url连成字符串
            const postOptions = {
                host: 'data.zz.baidu.com',
                path: '/urls?site=www.kuangzen.com&token=XXXXXX',//这里填写你从百度拿到的token
                port: '80',
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Content-Length': reqData.length
                }
            }
            postData(reqData, postOptions)//post给百度

        })
    }

})
function postData(reqData, postOptions) {
    const postReq = http.request(postOptions, response => {
        response.setEncoding('utf8')
        response.on('data', data => {
            data = JSON.parse(data)
            if (data.success)
                console.log('post data success!')
            else
                console.log(data.error)
        })
    })

    postReq.on('error', e => {
        console.log('problem with request: ' + e.message);
    })

    // post the data
    postReq.write(reqData)
    postReq.end()
}
