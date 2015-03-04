var php = require('./include.js');

test5();

function test4() {
    var url = "http://localhost:8080/";
    var param = {"q": ["a", "b", "c"]};
    var header = {"Cookie": "xxx"};
    var res = php.request("GET", url, param, header);
}


function test2() {
    var url = "http://localhost:8080/";
    var param = {"q": "x"};
    var header = {"Cookie": "xxx"};
    var c = php.curl_init();
    php.curl_setopt(c, 'CURLOPT_URL', url);
    php.curl_setopt(c, 'CURLOPT_POST', 1);
    php.curl_setopt(c, 'CURLOPT_POSTFIELDS', "a=bbb&c=eee");
    php.curl_setopt(c, 'CURLOPT_HTTPHEADER', header);



    var res = php.curl_exec(c);


}

function test3() {
    var url = "http://localhost:8080/";
    var param = '{"q": "x"}';
    var header = {"Cookie": "xxx"};
    var res = php.request("POST", url, param, header);
}

// file upload
function test4() {
    var url = "http://localhost:8080/";

    url = "http://www.puritys.me/unit.php";

    var filePath = php.getcwd();
    filePath += "/core.js"
    var param = {"q": "x", "file": "@" + filePath+ ""};
    var header = {"Cookie": "xxx"};
   // var ch = php.curl_init();
   // php.curl_setopt(ch, 'CURLOPT_URL', url);
   // php.curl_setopt(ch, 'CURLOPT_POST',1);
   // php.curl_setopt(ch, 'CURLOPT_POSTFIELDS', param);
    var file = {"key": filePath};
    var res = php.request("POST", url, param, header, {}, file);
    //php.curl_exec(ch);
    console.log(res);
}

function test5() { 
    var url = 'http://www.puritys.me/edo';
    var params = {};
    var header = {};
     
     
    var res = php.request("GET", url, params, header, {"BINARY_RESPONSE": "1"});
    //var resHeader = php.getResponseHeader();
    //console.log(resHeader);
    console.log(res); 
    php.file_put_contents("/tmps/test.xlsx", res, 'binary');
}

//console.log(res);
