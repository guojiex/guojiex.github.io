#guojiex.github.io
=================

just the demo of my personal index

###Start a server:
1.cd to this directory and excute the localhost_start.sh like below:  
<pre>sh localhost_start.sh</pre>

2.Or cd to this directory and execute the command below:  
<pre>nohup python -m SimpleHTTPServer 8080 > /dev/null 2>&1 &</pre>

###Close the server:
excute:  
<pre>ps ax | grep python </pre> 
then you will see the process:  
<pre>2053 s000  S      0:00.08 python -m SimpleHTTPServer 8080	
2081 s000  R+     0:00.00 grep python</pre>
then excute the command below to kill the process:  
<pre>kill -9 2053</pre>
