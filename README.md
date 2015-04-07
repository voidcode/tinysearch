#####Tinysearch

####ALPHA / Do NOT use this project YET!!!


This project can search providers like: google, wikipedia, youtube ...

Any links found in searchs, will added to you local-database sha1 of "search-word".

Related by "search-query" to output links-resluts.

Then you can 'rank-up', 'rank-down', 'follow'(crawl jobs) or 'remove'.

Next time you search on same 'search-word' the resluts will be fatch from you local-database.


#The Idea

Limit search-query to providers like google.

To make a faster and offline local webindex of all you search-query and related page-content.



##You need to install this. 
1. nodejs
2. npm 
3. git


##Install and run TinySearch

```
    git clone git@github.com:voidcode/tinysearch.git && cd tinysearch/ && npm install && npm start
```


##Just run it(goto you tinysearch/ rootfolder)

```
    npm start
```


#Then open: http://localhost:8020/ and you are DONE ...