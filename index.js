/**
 * @description lmat上线插件
 * @author yanbin01@baidu.com
 * @date 2016-10-13
 */

var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var juicer = require('juicer');
var colors = require('colors');

exports.name = 'publish';
exports.desc = 'publish the FE project to CMS';
exports.options = {
    '-h, --help': '--path指定上线路径',
    '--path'   : '上线到cms的路径'
};

exports.run = function(argv, cli) {
    if (argv.h || argv.help) {
        return cli.help(exports.name, exports.options);
    }
    else if(!argv.path) {
        console.log('--path参数不能为空');
        return;
    }
    var path = argv.path;
    //重新项目，将编译之后的工程放置在output目录下
    console.log('开始编译项目'.green);
    execSync('lmat release -d output');
    //压缩为zip
    console.log('开始压缩源代码为zip'.green);
    execSync('cd ./output && zip -r lmat-project.zip ./event');
    //发送至cms
    console.log('正在准备上线'.green);
    var tplCmd  = "curl -F 'user_name=lv' -F 'password=lvapptest' -F'top_ch_spell=lv'  -F'app_id=cms_r' -F'type=0' -F'group_id=55' -F'url=http://lvyou.baidu.com/static/event-lmat/${event_id}/' -F 'commonfile=@${f}' 'http://icms.baidu.com:8080/service/app_action/?action=upload'";
    var _cmd = juicer(tplCmd, {
        "event_id": path,
        "f":  './output/lmat-project.zip'
    });
    exec(_cmd, function(error, stdout, stedrr){
        if(error) {
            console.log('上线失败!'.red);
            console.log(error);
        }
        else {
            console.log('上线成功！'.bold.green);
        }
    });
};