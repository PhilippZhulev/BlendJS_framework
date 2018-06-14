function BlendCompile() {

    this.include = function () {
        let el = document.getElementsByTagName("script");
        let result = [];
        for(let i = 0; i < el.length; i++) {

            if(el[i].getAttribute("type") === "text/blendjs") {
                let url = el[i].getAttribute("src");

                let req = new XMLHttpRequest();
                req.open('GET', url, false);
                req.send(null);
                if (req.status === 200) {
                    result.push(req.responseText);
                }
            }
        }

        return result;
    };

    this.generateScript = function (include) {
        for(let i = 0; i < include.length; i++) {
            let ready = include[i],
                spaces = 0,
                htmlResult = "",
                elmsOrigin =  include[i].split(/{{/g),
                elmsEnd =  include[i].split(/}}/g);

            let origin = include[i].replace(/{{/g, "["),
                end = origin.replace(/}}/g, "]");

            for(let inc = 0; inc < elmsOrigin.length; inc++) {
                htmlResult = "";
                if(inc !== 0) {
                    let result = elmsOrigin[inc].split("}}")[0],
                        pattern = /\r\n|\r|\n/g,
                        strings = result.split(pattern),
                        comment = "";

                    for(let inr = 0; inr < strings.length; inr++) {
                        if(strings[inr].match(/"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)'|(\/\/.*|\/\*[\s\S]*?\*\/)/g) !== null) {
                            comment = "\n //";
                        }
                        if(strings[inr].length !== 0) {
                            let sim = strings[inr].match(/[+*?$^(\(\).#\[\])>]/g);
                            if(sim !== null) {
                                if(inr === 1) {
                                    spaces = strings[1].split(sim[0])[0].match(/ /g).length
                                }
                                htmlResult += comment + '"' + strings[inr].slice(spaces) + '"';
                                htmlResult = htmlResult.replace(/{/g, '"+');
                                htmlResult = htmlResult.replace(/}/g, '+"');
                                if(inr !== strings.length - 2) {
                                    htmlResult += ",\n";
                                }
                            }
                        }
                    }
                    ready = ready.replace("{{" + result + "}}",  "[" + htmlResult + "]");
                }
            };

            new Function(ready)();

        }
    }
}

window.onload = function () {
    let complie = new BlendCompile();
    complie.generateScript(complie.include());
}
