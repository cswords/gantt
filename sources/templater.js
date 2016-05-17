export default class Templater {
    static render(template, data) {
        if (!data) {return template;}

        for(var item in data){
            var re = '{{' + item + '}}';
            template = template.replace(new RegExp(re, 'ig'), data[item]);
        }
        return template;
    }
}