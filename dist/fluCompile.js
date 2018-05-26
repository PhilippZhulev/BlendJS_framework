function FluCompile() {

    this.include = function () {
        let el = document.getElementsByTagName("script");
        let result = [];
        for(let i = 0; i < el.length; i++) {

            if(el[i].getAttribute("type") === "text/flujs") {
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
            let htmlResult = include[i];
            let elmsOrigin =  include[i].split(/{{/g);
            let elmsEnd =  include[i].split(/}}/g);

            let origin = include[i].replace(/{{/g, "["),
                end = origin.replace(/}}/g, "]");

            for(let inc = 0; inc < elmsOrigin.length; inc++) {
                if(inc !== 0) {
                    let result = elmsOrigin[inc].split("}}")[0];
                    let pattern = /\r\n|\r|\n/g;
                    let new_pattern = result.replace(pattern, '",\n"').slice(2).replace('"",', '');

                    htmlResult = htmlResult.replace("{{" + result + "}}", "[" + new_pattern.replace('"",', '').slice(0, -11).replace(/ /g, "") + "]")
                }
            }

            console.log(htmlResult);
            eval(htmlResult);
        }
    }
}

let complie = new FluCompile();

complie.generateScript(complie.include());