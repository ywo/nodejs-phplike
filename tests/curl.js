var php = phplikeMod = require('./include.js');


var assert = require("assert");

//mocha lib/ --grep mthod_get
describe('Test method: HTTP GET ', function() {
    it('Fetch google response with query string', function() {
        var url = "https://www.google.com.tw/search";
        var param = {"q": "unit test"};
        var header = {"user-agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36"};
        var res = phplikeMod.request("GET", url, param, header);
        header = phplikeMod.getResponseHeader();
        //console.log(res);
        var match = res.match(/unit/);
        assert.equal("unit", match[0]);
        assert.equal("200", header['status']);
    });

});

describe('Test method: HTTP GET Array ', function() {
    it('should be pass a parameter which type is array', function() {
        var url = "http://www.puritys.me/unit.php";
        var param = {"unit": "true", "test": ["a", "b", 1], "test2": {"test3": ["a"]}};
        var header = {};
        var res = phplikeMod.request("GET", url, param, {});
        //console.log(res);
        res = phplikeMod.json_decode(res, true);
        assert.equal("b", res["test"][1]);
        assert.equal(1, res["test"][2]);
        assert.equal("a", res["test2"]["test3"][0]);


    });

});


describe('Test method: HTTP GET 404', function() {
    it('Fetch google response with query string', function() {
        var url = "https://www.google.com.tw/notfound";
        var param = {"q": "unit test"};
        var header = {};
        var res = phplikeMod.request("GET", url, param, {});
        header = phplikeMod.getResponseHeader();
        assert.equal("404", header['status']);
    });
});


describe('Test method: HTTP GET  curl_exec', function() {
    var resBody, resHeader;
    before(function(){
        var url = "https://www.google.com.tw/search?q=php+unit+test";
        var header = {"Cookie": "xxx"};
        var c = phplikeMod.curl_init();
        phplikeMod.curl_setopt(c, 'CURLOPT_URL', url);
        resBody = phplikeMod.curl_exec(c);
        resHeader = phplikeMod.getResponseHeader();
        phplikeMod.curl_close(c);
    })

    it('Request', function() {
        var match = resBody.match(/unit/);
        assert.equal("unit", match[0]);
        //

    });

    it('Header Handle', function() {
        assert.equal("-1", resHeader["Expires"]);

    });


});

describe('Test method: File Upload , multipart-form/data', function() {
    it("Simple", function() {
        var url;

        url = "http://www.puritys.me/unit.php";

        var filePath = php.getcwd();
        filePath += "/tests/core.js"
        var param = {"q": "x"};
        var header = {"Cookie": "xxx"};
        var file = {"key": filePath};
        var res = php.request("POST", url, param, header, {}, file);
        res = php.json_decode(res);
        assert.equal('key', res['key']);
        assert.equal('core.js', res['name']);

        //console.log(res);
    });

    it("PHP curl function", function() {
        var url;

        url = "http://www.puritys.me/unit.php";

        var filePath = "./tests/core.js"
        var param = {"q": "x", "key": "@" + filePath};
        var header = {"Cookie": "xxx"};
        var ch = php.curl_init();
        php.curl_setopt(ch, 'CURLOPT_URL', url);
        php.curl_setopt(ch, 'CURLOPT_POST',1);
        php.curl_setopt(ch, 'CURLOPT_POSTFIELDS', param);
        var res = php.curl_exec(ch);

        res = php.json_decode(res);
        assert.equal('key', res['key']);
        assert.equal('core.js', res['name']);

        //console.log(res);
    });

});


describe('Test method: curl_setopt', function() {//{{{

    it('CURLOPT_POSTFIELDS - input a string', function() {

        var c = phplikeMod.curl_init();
        phplikeMod.curl_setopt(c, 'CURLOPT_POSTFIELDS', "a=b&c=d");
        assert.equal("b", c.param["a"]);
        assert.equal("d", c.param["c"]);
    });

    it('CURLOPT_POSTFIELDS - input a object', function() {

        var c = phplikeMod.curl_init();
        phplikeMod.curl_setopt(c, 'CURLOPT_POSTFIELDS', {"a": "b", "c": "d"});
        assert.equal("b", c.param["a"]);
        assert.equal("d", c.param["c"]);
    });

    it('CURLOPT_POST', function() {
        var c = phplikeMod.curl_init();
        phplikeMod.curl_setopt(c, 'CURLOPT_POST', 1);
        assert.equal("POST", c.method);
    });

    it('CURLOPT_HTTPGET', function() {
        var c = phplikeMod.curl_init();
        phplikeMod.curl_setopt(c, 'CURLOPT_HTTPGET', 1);
        assert.equal("GET", c.method);
    });

    it('CURLOPT_HTTPHEADER', function() {
        var c = phplikeMod.curl_init();
        phplikeMod.curl_setopt(c, 'CURLOPT_HTTPHEADER', {"Cookie": "test"});
        assert.equal("test", c.header['Cookie']);
    });

    it('CURLOPT default option', function() {
        var c = phplikeMod.curl_init();
        phplikeMod.curl_setopt(c, 'CURLOPT_UNKNOW', "test");
        assert.equal("test", c.options['CURLOPT_UNKNOW']);
    });


});//}}}



describe('Test method: reformatCurlData', function() {//{{{

    it('get param from url', function() {
        var c = phplikeMod.curl_init();
        var url = "http://www.google.com.tw/?a=b&a1=cc";
        c.url = url;
        c.param = "c=d&c1=dd";
        var res = phplikeMod.reformatCurlData(c);
        assert.equal("b", res.param["a"]);
        assert.equal("d", res.param["c"]);
        assert.equal("cc", res.param["a1"]);
        assert.equal("dd", res.param["c1"]);
        assert.equal("http://www.google.com.tw/", res.url);
        assert.equal(url, c.url);



    });

    it('get param from url and merge param which type is object', function() {
        var c = phplikeMod.curl_init();
        c.url = "http://www.google.com.tw/?a=b&a1=cc";
        c.param = {"c": "d", "c1": "dd"};
        var res = phplikeMod.reformatCurlData(c);
        assert.equal("b", res.param["a"]);
        assert.equal("d", res.param["c"]);
        assert.equal("cc", res.param["a1"]);
        assert.equal("dd", res.param["c1"]);

    });

});//}}}

describe('Test method: responseHeaderToHash', function() {

    it('get header', function() {
        var header = ["HTTP/1.1 200 OK",
                      "Date: Fri, 05 Dec 2014 05:11:18 GMT",
                      "Expires: -1",
                      "Cache-Control: private, max-age=0",
                      "Content-Type: text/html; charset=Big5",
                      "Set-Cookie: PREF=ID=43",
                      "Set-Cookie: NIGbEEw; HttpOnly"];

        var res = phplikeMod.responseHeaderToHash(header.join("\n\r"));
        assert.equal("Fri, 05 Dec 2014 05:11:18 GMT", res['Date']);
        assert.equal("-1", res['Expires']);
        assert.equal("private, max-age=0", res['Cache-Control']);
        assert.equal("text/html; charset=Big5", res['Content-Type']);
        assert.equal("PREF=ID=43", res['Set-Cookie'][0]);
        assert.equal("NIGbEEw; HttpOnly", res['Set-Cookie'][1]);

    });

    it('get header: handle empty header', function() {
        var header = [];

        var res = phplikeMod.responseHeaderToHash(header.join("\n\r"));
        assert.equal("", res);

    });


});

//mocha lib/ --grep option
describe('Test Curl option', function() {
    it('Test CURLOPT_COOKIEJAR', function() {
        var tmpFile = "/tmp/cookiejar";
        var url = "https://www.google.com.tw/search?q=unit%20";
        if (php.is_file(tmpFile)) {
            php.unlink(tmpFile);
        }
        var c = php.curl_init();
        php.curl_setopt(c, 'CURLOPT_URL', url);
        php.curl_setopt(c, 'CURLOPT_COOKIEJAR', tmpFile);
        var res = php.curl_exec(c);

        if (php.is_file(tmpFile)) {
            assert.equal(true, true);
        } else {
            assert.equal(false, true);
        }
        
    });
});

//mocha lib/ --grep parseFileInfo
describe('Test parseFileInfo', function() {
    it('parse file path', function() {
        var str = "@index.js"
        
        var res = php.parseFileInfo(str);
        assert.equal("index.js", res[0]);
        assert.equal("index.js", res[1]);
        
    });

    it('parse complicated file path', function() {
        var str = "@tests/curl.js"
        
        var res = php.parseFileInfo(str);
        assert.equal("curl.js", res[0]);
        assert.equal("tests/curl.js", res[1]);
        
    });


    it('file is not exist', function() {
        var str = "@./curlxxx.js"
        
        var res = php.parseFileInfo(str);
        assert.equal("", res);
        
    });

    it('wrong format', function() {
        var str = "curl.js"
        
        var res = php.parseFileInfo(str);
        assert.equal("", res);
        
    });



});


