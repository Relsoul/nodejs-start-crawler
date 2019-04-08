const {getMainPostUrl,test,getMainPostPage,getPostDetail,getPostTag} = require('./http-request');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
module.exports=async function(app){


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

        await getAllPostDetail(allPostUrl);

    }

    // getAllPost();

    async function getAllPostDetail(allPostUrlArr){
        /**
         * {
         *     '文章的url':{
         *         title: String
         *         time: Number(时间戳)
         *         detail: String
         *         tag: [{name,url,}]
         *         url:
         *     }
         *
         * }
         * @type {{}}
         * [{},{},{},{}]
         */
        let obj = {

        };
        // allPostUrlArr = [allPostUrlArr[0],allPostUrlArr[1]];
        for(let i of allPostUrlArr){
            console.log('开始获取文章详情',i);
            const res = await getPostDetail(i);
            const $ = cheerio.load(res);
            const title =$('.post-full-title').text();
            const detail =$('.post-full-content').html();
            const time =$('.post-full-meta-date').attr('datetime');
            let tagArr = [];
            let bodyCls =$('body').attr('class');
            if(bodyCls.trim() !== 'post-template' ){
                bodyCls = bodyCls.replace('post-template ','');
                let bodyArr = bodyCls.split(' ');
                tagArr = bodyArr.map((n)=>{
                    n = n.replace('tag-','/tag/');
                    return {
                        name:'',
                        url:`${n}`
                    }
                });
            }


            const d = new Date(time);
            obj[i] = {
                title,
                time: d.getTime(),
                detail:detail,
                tag:tagArr,
                url:i,
            }
        }

        console.log('postdetail',obj);

        await fs.writeJson(path.join(__dirname,'../post.json'),obj);
        console.log('所有文章爬取完毕')
    }


    app.post('/api/data', async (req, res) => {
        const data = await fs.readJson(path.join(__dirname,'../post.json'));
        res.send(data);
    });

    app.get('/',async (req,res)=>{
        res.sendFile(path.join(__dirname,'../index.html'))
    })


};
