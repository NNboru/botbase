//website=website+''
website=''

frm.onsubmit= ()=>{
    funcsearch().catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
    return false;
}
async function funcsearch(){
    if(shower.innerHTML=='')return;
    showloader('thinking..');
    let obj= new FormData();
    obj.append('ques',shower.innerHTML);
    let resp = await fetch(website+'/search', { method:'POST', body:obj });
    if(!resp.ok)
    showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            if(dict['found']){
                resq.innerHTML='';
                for(let ques of dict['allq']){
                    resq.insertAdjacentHTML('afterBegin',
                        `<div>
                            <div>${ques}</div>
                            <div class='butrem'>delete from db</div>
                        </div>`
                    );
                }
                resa.innerHTML='';
                for(let ans of dict['alla']){
                    resa.insertAdjacentHTML('afterBegin',
                        `<div>
                            <div>${ans}</div>
                            <div class='butrem'>delete from db</div>
                        </div>`
                    );
                }
                finder.dataset.ind=dict['ind'];
                resshow();
            }
            else{
                addbut.style.display='initial';
                if(finder.dataset.ind)
                    addbut2.style.display='initial';
                showerror('QUESTION NOT FOUND IN DATABASE. PLEASE ADD IT.')
            }
        }
    }
    hideloader();
    return false;
}


typer.oninput=e=>{
    addbut.style.display='none';
    addbut2.style.display='none';
    shower.innerHTML=process(typer.value);
}


addbut.onclick=e=>{
    addq.insertAdjacentHTML('afterBegin',`
    <div>
        <div>${shower.innerHTML}</div>
        <div class='butrem'>remove</div>
    </div>
    `);
    typer.value='';
    shower.innerHTML='';
    addbut.style.display='none';
    addbut2.style.display='none';
}


addbut2.onclick=e=>{
    funcaddq(e).catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
}
async function funcaddq(e){
    showloader('adding..');
    
    let obj= new FormData(), flag=1;
    obj.append('ques',shower.innerText);
    obj.append('ind' ,finder.dataset.ind);
    let resp = await fetch(website+'/addq', { method:'POST', body:obj });
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            resq.insertAdjacentHTML('afterBegin',
                `<div>
                    <div>${shower.innerText}</div>
                    <div class='butrem'>delete from db</div>
                </div>`
            );
            notify('Successfully added to DB at server');
            flag=0;
        }
    }
    typer.value='';
    shower.innerHTML='';
    addbut.style.display='none';
    addbut2.style.display='none';

    if(flag) hideloader();
}


frm3.onsubmit=e=>{
    funcadda(e).catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
    return false;
}
async function funcadda(e){
    showloader('adding..');
    
    let obj= new FormData(), flag=1;
    obj.append('ans',inpadda.value);
    obj.append('ind' ,finder.dataset.ind);
    let resp = await fetch(website+'/adda', { method:'POST', body:obj });
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            resa.insertAdjacentHTML('afterBegin',
                `<div>
                    <div>${inpadda.value}</div>
                    <div class='butrem'>delete from db</div>
                </div>`
            );
            inpadda.value='';
            notify('Successfully added to DB at server');
            flag=0;
        }
    }

    if(flag) hideloader();
}


resq.onclick=e=>{
    funcdelq(e).catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
}
async function funcdelq(e){
    if(e.target.classList.contains('butrem')){
        if(resq.childElementCount==1){
            showerror('Its the last question. It means deleting whole question-answer-set');
            return;
        }
        //deleting ques from database
        showloader('deleting..');
        let obj= new FormData(), flag=1;
        obj.append('ques',e.target.previousElementSibling.innerText);
        let resp = await fetch(website+'/delq', { method:'POST', body:obj });
        if(!resp.ok)
            showerror('Some error occurred!');
        else{
            let dict = await resp.json();
            if(dict['code'])
                showerror(dict['msg']);
            else{
                e.target.parentElement.remove();
                notify('Successfully deleted from DB at server');
                flag=0;
            }
        }
        if(flag) hideloader();
    }
}


resa.onclick=e=>{
    funcdela(e).catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
}
async function funcdela(e){
    if(resa.childElementCount==1){
        showerror('Its the only answer. It means deleting whole question-answer-set');
        return;
    }
    if(e.target.classList.contains('butrem')){
        //deleting ans from database
        showloader('deleting..');
        let obj= new FormData(), flag=1;
        obj.append('ans',e.target.previousElementSibling.innerText);
        let resp = await fetch(website+'/dela', { method:'POST', body:obj });
        if(!resp.ok)
            showerror('Some error occurred!');
        else{
            let dict = await resp.json();
            if(dict['code'])
                showerror(dict['msg']);
            else{
                e.target.parentElement.remove();
                notify('Successfully deleted from DB at server');
                flag=0;
            }
        }
        if(flag) hideloader();
    }
}


function deleteqaset(){
    deleteqaset2().catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
}
async function deleteqaset2(){
    showloader('deleting..');
    let obj= new FormData(), flag=1;
    obj.append('ind',finder.dataset.ind);
    let resp = await fetch(website+'/delqaset', { method:'POST', body:obj });
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            resclear();
            flag=0;
        }
    }
    if(flag) hideloader();
}


addq.onclick=e=>{
    if(e.target.classList.contains('butrem')){
        e.target.parentElement.remove();
    }
}

adda.onclick=e=>{
    if(e.target.classList.contains('butrem')){
        e.target.parentElement.remove();
    }
}


frm2.onsubmit=e=>{
    if(inpans.value=='') return false;
    adda.insertAdjacentHTML('afterBegin',`
    <div>
        <div>${inpans.value}</div>
        <div class='butrem'>remove</div>
    </div>
    `);
    inpans.value='';
    return false;
}

function addadder(){
    addadder2().catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
}
async function addadder2(){
    // add ques-ans set to db
    if(addq.childElementCount==0 || adda.childElementCount==0){
        showerror('either question-set or answer-set is empty');
        return;
    }
    showloader('adding..');
    let qset=[], aset=[];
    for(let q of addq.children){
        qset.push(q.firstElementChild.innerText);
    }
    for(let a of adda.children){
        aset.push(a.firstElementChild.innerText);
    }
    
    let obj= new FormData(), flag=1;
    obj.append('ques',JSON.stringify(qset));
    obj.append('ans',JSON.stringify(aset));
    let resp = await fetch(website+'/addqaset', { method:'POST', body:obj });
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            addq.innerHTML='';
            adda.innerHTML='';
            notify('Successfully added this set to DB at server');
            flag=0;
        }
    }
    if(flag) hideloader();
}

function clearadder(){
    addq.innerHTML='';
    adda.innerHTML='';
}

function resshow(){
    resbuts.style.display='grid';
    frm3.style.display='grid';
}
function resclear(){
    finder.dataset.ind='';
    resq.innerHTML='';
    resa.innerHTML='';
    frm3.style.display='none';
    resbuts.style.display='none';
    notify('Successfully deleted this set from DB at server');
}

inpsuf.oninput = inppre.oninput=e=>{
    shower2.innerHTML=process(e.target.value);
}


frm4.onsubmit=e=>{
    funcaddpre(e).catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
    return false;
}
async function funcaddpre(e){
    showloader('adding..');
    
    let obj= new FormData(), flag=1;
    obj.append('prefix',shower2.innerHTML);
    let resp = await fetch(website+'/addpre', { method:'POST', body:obj });
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            prefix.insertAdjacentHTML('afterBegin',
                `<div>
                    <div>${shower2.innerHTML}</div>
                    <div class='butrem'>delete from db</div>
                </div>`
            );
            inppre.value='';
            notify('Successfully added to DB at server');
            flag=0;
        }
    }

    if(flag) hideloader();
}


frm5.onsubmit=e=>{
    funcaddsuf(e).catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
    return false;
}
async function funcaddsuf(e){
    showloader('adding..');
    
    let obj= new FormData(), flag=1;
    obj.append('sufix',shower2.innerHTML);
    let resp = await fetch(website+'/addsuf', { method:'POST', body:obj });
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        let dict = await resp.json();
        if(dict['code'])
            showerror(dict['msg']);
        else{
            sufix.insertAdjacentHTML('afterBegin',
                `<div>
                    <div>${shower2.innerHTML}</div>
                    <div class='butrem'>delete from db</div>
                </div>`
            );
            inpsuf.value='';
            notify('Successfully added to DB at server');
            flag=0;
        }
    }

    if(flag) hideloader();
}


prefix.onclick=e=>{
    funcdelpre(e).catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
}
async function funcdelpre(e){
    if(e.target.classList.contains('butrem')){
        //deleting prefix from database
        showloader('deleting..');
        let obj= new FormData(), flag=1;
        obj.append('prefix',e.target.previousElementSibling.innerText);
        let resp = await fetch(website+'/delpre', { method:'POST', body:obj });
        if(!resp.ok)
            showerror('Some error occurred!');
        else{
            let dict = await resp.json();
            if(dict['code'])
                showerror(dict['msg']);
            else{
                e.target.parentElement.remove();
                notify('Successfully deleted from DB at server');
                flag=0;
            }
        }
        if(flag) hideloader();
    }
}


sufix.onclick=e=>{
    funcdelsuf(e).catch(e=>{
        console.dir(e);
        hideloader();
        showerror('network error, check your internet connection');
    });
}
async function funcdelsuf(e){
    if(e.target.classList.contains('butrem')){
        //deleting suffix from database
        showloader('deleting..');
        let obj= new FormData(), flag=1;
        obj.append('sufix',e.target.previousElementSibling.innerText);
        let resp = await fetch(website+'/delsuf', { method:'POST', body:obj });
        if(!resp.ok)
            showerror('Some error occurred!');
        else{
            let dict = await resp.json();
            if(dict['code'])
                showerror(dict['msg']);
            else{
                e.target.parentElement.remove();
                notify('Successfully deleted from DB at server');
                flag=0;
            }
        }
        if(flag) hideloader();
    }
}


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
    msg = msg.toLowerCase().replace(/[,.;{}!`":|?\\\/-]/g,' ')
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


fetch(website+'/getallpresuf').then(resp=>{
    if(!resp.ok)
        showerror('Some error occurred!');
    else{
        resp.json().then(dict=>{
            if(dict['code'])
                showerror(dict['msg']);
            else{
                for(let pre of dict['pre']){
                    prefix.insertAdjacentHTML('afterBegin',
                        `<div>
                            <div>${pre}</div>
                            <div class='butrem'>delete from db</div>
                        </div>`
                    );
                }
                for(let suf of dict['suf']){
                    sufix.insertAdjacentHTML('afterBegin',
                        `<div>
                            <div>${suf}</div>
                            <div class='butrem'>delete from db</div>
                        </div>`
                    );
                }
            }
        })
    }
});


console.log(`
Didnt expected anyone to see this, so "THANK YOU",

stopwords are =>
 ${Array.from(stopwords).join(' ')}

These stopwords are not allowed to be updated, coz it was giving rise to many problems.

Please DM me for any suggesions/feedback.

    -nn
`)


