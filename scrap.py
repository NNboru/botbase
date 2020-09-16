'''
data plotty
dataiku
analytical skills

'''
from bs4 import BeautifulSoup as bs
import requests as rq
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"
headers = {"user-agent" : USER_AGENT}


def searchgoogle(topic):
    'search for meaning in google'
    words = topic.replace(' ','+')
    url = f'https://www.google.com/search?q={words}'
    try:resp = rq.get(url+'+in+computer+science', headers=headers)
    except Exception as e:
        return 'error: '+str(e)
    if not resp.ok:
        return 'error: 1'
    page=bs(resp.text,'html.parser')
    data=page.find(class_=['hgKElc','QIclbb'])
    if data:
        if data.span:
            return data.div.text
        else:
            return data.text
    
    try:resp = rq.get(url, headers=headers)
    except Exception as e:
        return 'error: '+str(e)
    if not resp.ok:
        return 'error: 1'
    page=bs(resp.text,'html.parser')
    data=page.find(class_=['hgKElc','QIclbb'])
    if data:
        if data.span:
            return data.div.text
        else:
            return data.text
    
    try:resp = rq.get(url+'+means', headers=headers)
    except Exception as e:
        return 'error: '+str(e)
    if not resp.ok:
        return 'error: 1'
    page=bs(resp.text,'html.parser')
    data=page.find(class_=['hgKElc','QIclbb'])
    if data:
        if data.span:
            return data.div.text
        else:
            return data.text

    
    return page


def searchgeeks(topic):
    '''search for topic in geeksforgeeks'''
    if topic in ['bye','exit']:
        return ['bye bye']
    words = topic.replace(' ','+')
    url = f'https://www.google.com/search?q=geeksforgeeks+{words}'
    try:resp = rq.get(url, headers=headers)
    except Exception as e:
        return 'error: '+str(e)
    if not resp.ok:
        return 'error: 1'
    page=bs(resp.text,'html.parser')

    url2 = page.select_one('.r a')['href']
    if not url2:
        return 'error: 2'
    resp2 = rq.get(url2)
    if not resp2.ok:
        return 'error: 3'
    page2=bs(resp2.text,'html.parser')
    title=page2.find(class_='entry-header')
    data=page2.find(class_='entry-content')
    if not data:
        return 'error: Not found in geeksforgeeks'
    code = data.find(class_='code-block')
    if code:
        code.decompose()
    code=data.find(class_='responsive-tabs')
    if code:
        code.decompose()
    if title.time:
        title.time.decompose()

    ans=[]
    if title and 'entry-content' not in title.parent['class']:
        ans.append(str(title)) #str(title) for html code
    for i in data.children:
        if i.name and len(str(i))>10:
            flag=0
            for each in ('Recommended','Following are','Please write comments'):
                if i.text.find(each)!=-1:
                    flag=1
            if flag==1:
                break
            if i.text:ans.append(i.decode()) #str(i) for html code
            '''
            if len(ans)==2:
                ans.append('\nfor more go to the link: '+url2)
                break
            '''
    return ''.join(ans)


def cppcode(topic):
    '''search for topic's code in cp-algorithms'''
    #global page2, code
    if topic in ['bye','exit']:
        return ['bye bye']
    words = topic.replace(' ','+')
    url = f'https://www.google.com/search?q=cp-algorithms+{words}'
    try:resp = rq.get(url, headers=headers)
    except Exception as e:
        return 'error: '+str(e)
    if not resp.ok:
        return 'error: 1'
    page=bs(resp.text,'html.parser')

    url2 = page.select_one('.r a')['href']
    if not url2:
        return 'error: 2'
    resp2 = rq.get(url2)
    if not resp2.ok:
        return 'error: 3'
    page2=bs(resp2.text,'html.parser')
    
    h2=page2.findAll(('h2','h3'))
    for imp in h2:
        if imp.text.find('Implementation')!=-1:
            code=''
            while imp and imp.name!='pre':
                if imp.nextSibling.name:
                    code+=str(imp.nextSibling)  #str(imp.nextSibling) for html code
                imp=imp.nextSibling
            code = str(page2.h1)+code
            break
    else:
        if page2.pre:
            code = str(page2.h1)+ str(page2.pre.previous.previous)+'\n'+ str(page2.pre)
        else:
            code = None

    return code

if __name__=='__main__':
    while True:
        ques = input('user: ').strip().lower()

        #extract 'topic' to search from user input, to be done
        topic = ques

        if topic in ['bye','exit']:
            print('bye bye')
            break
        
        #searching topic in google
        ans = searchgoogle(topic)
        print(ans)

        #searching topic in geeksforgeeks
        ans = searchgeeks(topic)  
        if type(ans)==list:
            print(*ans)
            if ans[0]=='bye bye':
                break
            '''# prompting user in every 400 letters.
            size=0
            for i in ans:
                if size>400:
                    size=0
                    if input('would you like to know more(y/n): ').lower() in ('n','no'):
                        break
                print(i)
                size+=len(i)
            '''
            #search for topic's code in cp-algorithms
            code = cppcode(topic) 
            if code:
                print('\n\n', code)
            
            
        else:
            print(ans) #error messege


'''
errors:
dp => <h3> recent articles </h3> <ul>.. #at end
array => <h3><a href="...">Recent articles on Arrays </a></h3> #at start

<p><strong>Topics :</strong></p>

loading image explanations.

loading links on text


#errors removed
<p>Please write comments if...

<div id="personalNoteDiv" class="clear hideIt">

<p>See <a href="..">this post</a> for all applications of Depth First Traversal.<br>
Following are  implementations of simple Depth First Traversal...

<div class="recommendedPostsDiv">

<div id="practiceLinkDiv"><h2><a href="https://practice.geeksforgeeks.org/problems/
bfs-traversal-of-graph/1">Recommended: Please solve it on “<b><i><u>PRACTICE< ...

'''
    
