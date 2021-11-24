//my Required
const http = require("http");
const fs = require("fs");
const qs = require('querystring');
const mysql = require('mysql');

var api = [];

//make a con to read and put data to api
var con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "",
   database: "nodejs"
});

//connect...
con.connect(function(err){

   //check error to connect
   if(err)
   {
   
      //if be error
      throw err
   }
   else
   {
     
     //if not errored
     //sql code and query func to get json api codes
     var sql=`SELECT * FROM ApiJson`;
     con.query(sql,function(err,result,fields)
     {
     
         //check query working
         if(err){
         
            //when be errored
            throw err;
         }else{
            
            //if not be errored
            api = result
         }
      }
      );
  }
}
);

//main Server
http.createServer(function(rq,rs)
{

var puted = router(rs,rq,api);

if(puted.length == 0)
{
   //make a form to send data to api database
   if(rq.url === "/sub" && rq.method === "GET")
   {
      //if request method is get and request url is /sub
      rs.writeHead(200,{"Content-Type":"text/html"});
      fs.createReadStream("./public/index.html","UTF-8").pipe(rs);
   }
   else if(rq.url === "/sub" && rq.method === "POST")
   {
      //if request method post and request url /sub
      var SDATA;
      rq.on("data",function(chunk)
      {
      
         //get posted string chunk by chunk
         SDATA += chunk;
      
      }
      );
      rq.on("end",function(chunk)
      {
      
         //if reading chunk ended
         rs.writeHead(200,{"Content-Type":"text/html"});
         
         //parse posted string
         var POSTED = qs.parse(SDATA);
         
         //make a con to send posted data to server
         var con = mysql.createConnection(
         {
            host: "localhost",
            user: "root",
            password: "",
            database: "nodejs"
          }
          );
          
          //connect...
          con.connect(function(err){

            //check error to connect
            if(err)
            {
   
            //if be error
            throw err
            }
            else
            {
            
               //make sql code to insert posted data into database
               var sql=`INSERT INTO ApiJson (country,City,continent) VALUES ('${POSTED.undefinedcountry}', '${POSTED.city}', '${POSTED.continent}');`;
               con.query(sql,function(err,result)
               {
                  
                  //check error and result
                  if(err)
                  {
                  
                     //if be errored
                     rs.end(`<!doctype html>
                            <html lang="en">
                         			     <head>
                                 <meta charset="UTF-8">
                                 <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                                 <meta http-equiv="X-UA-Compatible" content="ie=edge">
                                 <title>post example in nodejs</title>
                                </head>
                                <body>
                                   <h3>${err}</h3>
                                </body>
                             </html>`);
                  
                  }
                  else
                  {
                     
                     //if not be errored
                     rs.end(`<!doctype html>
                            <html lang="en">
                         			     <head>
                                 <meta charset="UTF-8">
                                 <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                                 <meta http-equiv="X-UA-Compatible" content="ie=edge">
                                 <title>post example in nodejs</title>
                                </head>
                                <body>
                                   <h3>ثبت شد</h3>
                                </body>
                             </html>`);
                             console.log(JSON.stringify(result));
                  
                  }
               }
               );
               
               //sql code and query func to get json api codes
               var sql=`SELECT * FROM ApiJson`;
               con.query(sql,function(err,result,fields)
               {
     
                   //check query working
                   if(err){
         
                     //when be errored
                     throw err;
                     
                  }else{
            
                     //if not be errored
                     api = result
                  }
              }
              );
            }
            
          
         
      }
      );
   }
   );

}else if(rq.url === "/"){
      rs.writeHead(200,{"Content-Type":"text/json"});
      rs.end(JSON.stringify(api))
}else{
rs.writeHead(404,{"Content-Type":"text/plain"});
rs.end("oops...!your record not founded");
}
   
console.log(`request for ${rq.url} with ${rq.method} method`);
}else{
  rs.writeHead(200,{"Content-Type":"text/json"});
  rs.end(JSON.stringify(puted))
}

}).listen(3000);

//mini router function
function router(rs,rq,json){
var puted = [];
   json.forEach(function(obj)
   {
   
   //mini router
   if(rq.url === `/${obj.country}`){
        puted.push(obj);
        
     }else if(rq.url === `/${obj.continent}`){
        puted.push(obj);
        
     }
   
   }
   );
   
   return puted;
}
