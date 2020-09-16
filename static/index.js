//website=website+''
website=''

frm6.onsubmit=e=>{
    funcusermsg().catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
    return false;
}
async function funcusermsg(){
    if(inpchat.value=='') return;
    allchatmsg.insertAdjacentHTML('beforeEnd',
                `<div class='usermsg'>
                    ${inpchat.value}
                </div>`
            );
    showloader('thinking..');
    
    let obj= new FormData(), ques= process(inpchat.value);
    obj.append('ques',ques);
    let resp = await fetch(website+'/askbot', { method:'POST', body:obj });
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            inpchat.value='';
            if(dict['msg']){
                allchatmsg.insertAdjacentHTML('beforeEnd',
                    `<div class='botmsg'>
                        ${dict['msg']}
                    </div>`
                );
            }
            else{
                allchatmsg.insertAdjacentHTML('beforeEnd',
                    `<div class='botmsg'>
                        ${"sorry, I don't know what to say."}
                    </div>`
                );
            }
            if(!dict['myans'])
                allchatmsg.insertAdjacentHTML('beforeEnd',
                    `<div class='butset'>
                        search in
                        <button onclick="searchgeeks('${ques}')">geekforgeeks for explanation</button>
                        <button onclick="searchcpp('${ques}')">cpp-algorithm for c++ code</button>
                    </div>`
                );
            
        }
    }

    hideloader();
}

async function searchgeeks(msg){
    showloader('searching..');
    
    let obj= new FormData();
    obj.append('ques',msg);
    let resp = await fetch(website+'/askgeeks', { method:'POST', body:obj });
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            if(dict['msg']){
                allchatmsg.insertAdjacentHTML('beforeEnd',
                    `<div class='botmsg'>
                        ${dict['msg']}
                    </div>`
                );
            }
            else{
                allchatmsg.insertAdjacentHTML('beforeEnd',
                    `<div class='botmsg'>
                        <i>"sorry, not found anything."</i>
                    </div>`
                );
            }
        }
    }

    hideloader();
}

async function searchcpp(msg){
    showloader('searching..');
    
    let obj= new FormData();
    obj.append('ques',msg);
    let resp = await fetch(website+'/askcppcode', { method:'POST', body:obj });
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            if(dict['msg']){
                allchatmsg.insertAdjacentHTML('beforeEnd',
                    `<div class='botmsg'>
                        ${dict['msg']}
                    </div>`
                );
            }
            else{
                allchatmsg.insertAdjacentHTML('beforeEnd',
                    `<div class='botmsg'>
                        <i>"sorry, not found anything."</i>
                    </div>`
                );
            }
        }
    }

    hideloader();
}




function showerror(msg){
    error.innerHTML=msg;
    error.classList.remove('hide');
    setTimeout(()=>error.classList.add('hide'),5000);
}

function showloader(msg){
    loader.innerHTML=msg;
    loader.classList.remove('hide');
}
function hideloader(){
    loader.classList.add('hide');
}

function notify(msg){
    showloader(msg);
    setTimeout(hideloader,5000);
}

async function query(q){
    let obj = new FormData();
    obj.append('q',q);
    let resp = await fetch(website+'/query',{method:'POST',body:obj});
    if(!resp.ok)
        console.log('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            console.dir(dict['msg']);
        else{
            console.dir(dict['msg']);
        }
    }
}

exchange = {'u':'you', 'yeah':'yes', 'nah':'no', 'naah':'no', 'isnt':'not', 'dont':'not','didnt':'not', 'wasnt':'not',
            'havent':'not', 'hasnt':'not', 'arent':'not', 'didnt':'not','btw':'between','whats':'what','hows':'how'};
stopwords=new Set([ 'a', 'am', 'the', 'is', 'are', 'of', 'in', 'be', 'been', 'being','was', 'will','would','can', 'could',
                    'may', 'might', 'should', 'do', 'did', 'does', 'must', 'that','thats','this','also','too', 'about',
                    'very', 'so', 'o', 'm', 'r','to', 'has', 'had', 'something','some', 'have','please','really', 'bro']);
function process(msg){
    if(/ and /.test(msg) || / or /.test(msg))
        return 'please dont ask multiple things to me';
    msg = msg.toLowerCase().replace(/[,.;{}!`":|?\\]/g,' ')
    msg = msg.replace(/[`']s/g,'').replace(/[`']ll/g,'').replace(/[`']ve/g,'').replace(/[`']d/g,'');
    msg = msg.replace(/n[`']t/g,' not').replace(/[`']/g,'').replace(/aint/g,'not').replace(/wont/g,'not');
    msg = msg.split(' ');
    msg = msg.filter(v=>{
        if(v=='' || stopwords.has(v)) return false;
        return true;
    });
    msg = msg.map(v=> exchange[v]? exchange[v]: v);
    msg = msg.join(' ');
    return msg;
}



