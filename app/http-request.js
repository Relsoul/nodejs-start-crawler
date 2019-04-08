const rp = require('request-promise');

module.exports['getMainPostUrl'] = async function () {
    // https://relsoul.com/author/soul/
    return await rp('https://relsoul.com/author/soul/')
};


module.exports['getMainPostPage'] = async function (num) {
    // https://relsoul.com/author/soul/page/
    return new Promise( (resolve, reject)=>{
        setTimeout(async ()=>{
            let res;
            try{
                res = await rp(`https://relsoul.com/author/soul/page/${num}/`)
            }catch (e) {
                return reject(e);
            }
            return resolve(res);
        },200)
    })
};

module.exports['getPostDetail'] = async function (url) {
    // https://www.relsoul.com/guan-yu-qian-hou-duan-fen-chi-de-yi-xie-shi-xian-xiang-fa/
    return new Promise( (resolve, reject)=>{
        setTimeout(async ()=>{
            let res;
            try{
                res = await rp(`https://www.relsoul.com${url}`)
            }catch (e) {
                return reject(e);
            }
            return resolve(res);
        },200)
    })
};

module.exports['getPostTag'] = async function (url) {
    // https://www.relsoul.com/guan-yu-qian-hou-duan-fen-chi-de-yi-xie-shi-xian-xiang-fa/
    return new Promise( (resolve, reject)=>{
        setTimeout(async ()=>{
            let res;
            try{
                res = await rp(`https://www.relsoul.com${url}`)
            }catch (e) {
                return reject(e);
            }
            return resolve(res);
        },200)
    })
};


module.exports['test'] = async function () {
    // https://relsoul.com/author/soul/page/
    return await rp(`https://relsoul.com/author/soul/page/5/`)
};

