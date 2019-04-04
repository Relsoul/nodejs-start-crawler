const {getMainPostUrl,test,getMainPostPage} = require('./http-request')
const cheerio = require('cheerio');
module.exports=async function(){


    async function getAllPost() {
        const firstPageHtml =await getMainPostUrl();
        let hasNext = true;
        let page = 2;
        let errorUrlArr = [];
        let htmlArr = [firstPageHtml];
        while (hasNext){
            let res;
            let hasError = false;
            try{
                console.log("开始爬取页面:",page);
                res =await getMainPostPage(page);
            }catch (e) {
                hasError = true;
                // console.error(e);
                if(e.statusCode === 404){
                    hasNext =false;
                    console.log('当前爬取完毕！',)
                }else{
                    hasNext = true;
                    errorUrlArr.push(e.options.uri);
                    console.error('当前爬取错误',e.options.uri,e.statusCode)
                }
            }
            if(!hasError){
                htmlArr.push(res)
            }
            page++;
        }

        let allPostUrl = [];
        for(let i of htmlArr){
            const $ = cheerio.load(i);
            const $elems =$('.post-card-content-link');
            $elems.each((i, elem)=>{
                const url = $(elem).attr('href');
                allPostUrl.push(url)
            })

        }

        console.log('htmlArr',htmlArr);
        console.log('allPostUrl',allPostUrl);



    }

    getAllPost();


};
