var $builtinmodule = function (name) {
    var mod = {};

    mod.webport = new Sk.builtin.func ( function webport(id, modname) {
        modname = Sk.ffi.remapToJs(modname);
        id = Sk.ffi.remapToJs(id);

        url = "https://pythonmini.app.oyoclass.com/file/" + id
        codeUrl = url + "/code";
    
        susp = new Sk.misceval.Suspension();
        susp.resume = function () {Sk.builtin.none.none$};
    
        // this feels like a bad way to do this but skulpt suspentions and js promises both
        // confuse me greatly so eh whatever
        susp.data = {
            type: "Sk.promise",
            promise: new Promise(function (resolve, reject) {
                fetch(url).then( function(response) {                        
                    response.text().then(function(data) {
                        // get pyt token from page we importing                     
                        var parser = new DOMParser();
	                    var doc = parser.parseFromString(data, 'text/html');

                        var token =  Array.from(doc.getElementsByTagName("script")).pop().innerText.split(",").pop().slice(2, -3);
                        
                        // fetch page with required tokens
                        fetch(codeUrl, {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-Access-Token': token,
                                'Referer': url
                            }
                        })
                        .then( function(response) {                        
                            response.json().then(function(code) {
                                // decrypt the code
                                code = code["info"]
                                
                                num  = parseInt(b64decode(code["n"].slice(0, code["n"].indexOf("%"))))
                                
                                var full_code = [];
                                for (var i = 0; i < code["c"].length; i++) {
                                    full_code.push(code["c"][i].slice(0, code["c"][i].length-num));
                                }

                                code = b64decode(full_code.join(""))

                                code = JSON.parse(code);
                                last_elem_of_ob_code = code.pop();

                                var first_index_of_ob_code = code[0]
                                var code_arr_length = code.length;

                                code[0] = code[code_arr_length - 1];
                                code[code_arr_length - 1] = first_index_of_ob_code;
                                code.push(last_elem_of_ob_code)

                                if ("string" !== (typeof code).toLowerCase()) {
                                    var magic_num = code.pop();
                    
                                    code = code.map(function(item) {
                                        return item ^ magic_num
                                    });
                                    "undefined" !== typeof Sk.paakko && (code = Sk.paakko.inflate(new Uint8Array(code), {
                                        to: "string"
                                    }))
                                    
                                }

                                // add code to skulpt lib of modules
                                Sk.builtinFiles["files"]["src/lib/" + modname + ".py"] = code;
                                
                                // import and resolve
                                Sk.globals[modname] = Sk.importModule(modname, false, false);
                                resolve();
                            });
                        })
                        .catch(function(err) {
                            reject();
                        });
                    });
                })
                .catch(function(err) { reject() })
            })
        };
        return susp;
    });

    return mod;
};