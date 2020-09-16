from flask import Flask, request, make_response, render_template, send_file
import sqlite3 as sql
from random import choice
import json
from scrap import *

app = Flask(__name__)
static = app.root_path + r'/static/'


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/load/<x>')
def myicon(x):
    rep = make_response(send_file(app.root_path+'/'+x))
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep


@app.route('/search', methods=['POST'])
def search():
    try:
        ques=request.form['ques']
        con,c=connect()
        if not existDB(c,'qtab'):
            createDB(c,'qtab')
            print('qtab created')
        if not existDB(c,'atab'):
            createDB(c,'atab')
            print('atab created')
        
        ind = c.execute("select ind from qtab where qa=?",(ques,)).fetchone()
        if not ind:
            #ques not in db
            rep = make_response({'code':0, 'found':0})
        else:
            #ques found in db
            ind = ind[0]
            temp= c.execute("select qa from qtab where ind=?",(ind,)).fetchall()
            allq = [i[0] for i in temp]
            temp= c.execute("select qa from atab where ind=?",(ind,)).fetchall()
            alla = [i[0] for i in temp]
            rep = make_response({'code':0, 'found':1, 'allq':allq, 'alla':alla, 'ind':ind})
        close(con)
        
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

@app.route('/addq', methods=['POST'])
def addq():
    try:
        ques=request.form['ques']
        ind=int(request.form['ind'])
        con,c=connect()
        c.execute("insert into qtab values (?,?)",(ques,ind))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

@app.route('/adda', methods=['POST'])
def adda():
    try:
        ans=request.form['ans']
        ind=int(request.form['ind'])
        con,c=connect()
        c.execute("insert into atab values (?,?)",(ans,ind))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep


@app.route('/addqaset', methods=['POST'])
def addqaset():
    try:
        ques=json.loads( request.form['ques'] )
        ans=json.loads( request.form['ans'] )
        con,c=connect()
        
        ind = c.execute("select max(ind) from qtab").fetchone()[0]
        if not ind:
            #db empty
            ind=1
        else:
            ind+=1
        for q in ques:
            c.execute("insert into qtab values (?,?)",(q,ind))
        for a in ans:
            c.execute("insert into atab values (?,?)",(a,ind))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
        
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

@app.route('/delqaset', methods=['POST'])
def delqaset():
    try:
        ind=int(request.form['ind'])
        con,c=connect()
        c.execute("delete from qtab where ind=?",(ind,))
        c.execute("delete from atab where ind=?",(ind,))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep


@app.route('/delq', methods=['POST'])
def delq():
    try:
        ques=request.form['ques']
        con,c=connect()
        c.execute("delete from qtab where qa=?",(ques,))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

@app.route('/dela', methods=['POST'])
def dela():
    try:
        ans=request.form['ans']
        con,c=connect()
        c.execute("delete from atab where qa=?",(ans,))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

@app.route('/getallpresuf')
def getallpresuf():
    try:
        con,c=connect()
        if not existDB(c,'pretab'):
            c.execute("create table pretab (prefix text)")
            print('pretab created')
        if not existDB(c,'suftab'):
            c.execute("create table suftab (sufix text)")
            print('suftab created')
        allpre = [i[0] for i in c.execute("select * from pretab").fetchall()]
        allsuf = [i[0] for i in c.execute("select * from suftab").fetchall()]
        close(con)
        rep = make_response({'code':0, 'msg':'OK', 'pre':allpre, 'suf':allsuf})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

@app.route('/addpre', methods=['POST'])
def addpre():
    try:
        pre=request.form['prefix']
        con,c=connect()
        c.execute("insert into pretab values (?)",(pre,))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

@app.route('/addsuf', methods=['POST'])
def addsuf():
    try:
        suf=request.form['sufix']
        con,c=connect()
        c.execute("insert into suftab values (?)",(suf,))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

@app.route('/delpre', methods=['POST'])
def delpre():
    try:
        pre=request.form['prefix']
        con,c=connect()
        c.execute("delete from pretab where prefix=?",(pre,))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

@app.route('/delsuf', methods=['POST'])
def delsuf():
    try:
        suf=request.form['sufix']
        con,c=connect()
        c.execute("delete from suftab where sufix=?",(suf,))
        close(con)
        rep = make_response({'code':0, 'msg':'OK'})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep


@app.route('/query', methods=['POST'])
def any_query_to_db():
    try:
        q=request.form['q']
        con, c = connect()
        ans = query(c,q)
        close(con)
        rep = make_response({'code':0, 'msg':ans})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep


# processing ans for what user asked
@app.route('/askbot', methods=['POST'])
def askbot():
    try:
        ques=request.form['ques']
        con,c=connect()
        ind = c.execute("select ind from qtab where qa=?",(ques,)).fetchone()
        if ind:
            #found in db
            ans = choice(c.execute("select qa from atab where ind=?",(ind[0],)).fetchall())
            rep = make_response({'code':0, 'msg':ans[0], 'myans':1})
        else:
            #removing any ques prefix-sufix
            allpre = [i[0] for i in c.execute("select * from pretab").fetchall()]
            allsuf = [i[0] for i in c.execute("select * from suftab").fetchall()]
            for i in allpre:
                if ques.startswith(i):
                    ques = ques[len(i):].lstrip()
                    break
            for i in allsuf:
                if ques.endswith(i):
                    ques = ques[:-len(i)].rstrip()
                    break
            #search google
            ans = searchgoogle(ques)
            if ans and not ans.startswith('error:'):
                rep = make_response({'code':0, 'msg':ans})
            else:
                rep = make_response({'code':0, 'msg':''})
        close(con)
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

#search geeks
@app.route('/askgeeks', methods=['POST'])
def askgeeks():
    try:
        ques=request.form['ques']
        
        if 'prefix sufix not removed from front-end side':
            con,c=connect()
            #removing any ques prefix-sufix
            allpre = [i[0] for i in c.execute("select * from pretab").fetchall()]
            allsuf = [i[0] for i in c.execute("select * from suftab").fetchall()]
            for i in allpre:
                if ques.startswith(i):
                    ques = ques[len(i):].lstrip()
                    break
            for i in allsuf:
                if ques.endswith(i):
                    ques = ques[:-len(i)].rstrip()
                    break
            close(con)
        ans = searchgeeks(ques)
        if ans and not ans.startswith('error:'):
            rep = make_response({'code':0, 'msg':ans})
        else:
            rep = make_response({'code':0, 'msg':''})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep

#search cpp-algorithms
@app.route('/askcppcode', methods=['POST'])
def askcppcode():
    try:
        ques=request.form['ques']
        if 'prefix sufix not removed from front-end side':
            con,c=connect()
            #removing any ques prefix-sufix
            allpre = [i[0] for i in c.execute("select * from pretab").fetchall()]
            allsuf = [i[0] for i in c.execute("select * from suftab").fetchall()]
            for i in allpre:
                if ques.startswith(i):
                    ques = ques[len(i):].lstrip()
                    break
            for i in allsuf:
                if ques.endswith(i):
                    ques = ques[:-len(i)].rstrip()
                    break
            close(con)
        ans = cppcode(ques)
        if ans and not ans.startswith('error:'):
            rep = make_response({'code':0, 'msg':ans})
        else:
            rep = make_response({'code':0, 'msg':''})
    except Exception as e:
        rep = make_response({'code':1, 'msg':str(e)})
    rep.headers['Access-Control-Allow-Origin']='*';
    return rep




#DB operations
def connect():
    con = sql.connect('nn')
    return con, con.cursor()
def close(conn):
    conn.commit()
    conn.close()

def existDB(c,tab):
    return c.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{tab}'").fetchone()
def createDB(c,tab):
    c.execute(f"create table {tab} (qa text, ind integer)")
def clearDB(c,tab):
    c.execute(f"drop table {tab}");
    createDB(c,tab);

def insert(c, tab, qa, no):
    c.execute(f"insert into {tab} values (?,?)",(qa, no))

def query(c,q):
    return c.execute(q).fetchall()



    
