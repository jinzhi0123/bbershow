'use strict'
// 全局声明插件代号，插件的名字随你定
// 此处是为了便于区分多个插件的注入函数名，确保不重名。
const pluginname = 'bberShow'
console.log('test${pluginname}')
// 全局声明依赖，此处用到的都是hexo的api或者pug插件的api
const pug = require('pug')
const path = require('path')
const urlFor = require('hexo-util').url_for.bind(hexo)
const util = require('hexo-util')

hexo.extend.filter.register('after_generate', function () {
  // 首先获取整体的配置项名称,
  // 这行的写法可以保证不管是写在主题配置文件里
  // 还是站点配置文件里，都能读取到配置项。
  const config = hexo.config.bberShow || hexo.theme.config.bberShow
  // 如果配置开启
  if (!(config && config.enable)) return
  // 集体声明配置项，将我们用到的配置项全部封装到data里
  // 之后方便我们统一调用。
  // 同时活用三元运算符，给配置项设置默认配置内容。
    const data = {
      enable_page: config.enable_page ? config.enable_page : "all",
      exclude: config.exclude,
      layout_type: config.layout.type,
      layout_name: config.layout.name,
      layout_index: config.layout.index ? config.layout.index : 0
    }
  // 渲染页面，此处调用了pug的api，具体写法可以查看最上方的参考教程。
  const temple_html_text = config.temple_html ? config.temple_html : pug.renderFile(path.join(__dirname, './lib/html.pug'),data)
  //cdn资源声明，来引用必要的依赖或者样式。
    //样式资源
  const css_text = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jinzhi0123/bbershow/lib/bbr_index.css">`
    //脚本资源
  const js_text = `<script src="https://cdn.jsdelivr.net/gh/jinzhi0123/bbershow/lib/bbr_index.js"></script>`
  //注入容器声明，用来判断注入容器类型。
  // ==========start=============
  var get_layout
  //若指定为class类型的容器
  // 因为各个配置项内容已经封装在data数据集里
  // 我们就需要用data.name的方式来访问
  if (data.layout_type === 'class') {
    //则根据class类名及序列获取容器
    get_layout = `document.getElementsByClassName('${data.layout_name}')[${data.layout_index}]`
  }
  // 若指定为id类型的容器
  else if (data.layout_type === 'id') {
    // 直接根据id获取容器
    get_layout = `document.getElementById('${data.layout_name}')`
  }
  // 若未指定容器类型，默认使用id查询
  else {
    get_layout = `document.getElementById('${data.layout_name}')`
  }
  // =============end===============
  //挂载容器脚本，用来注入上方编译好的插件dom结构
  //挂载容器脚本
  var user_info_js = `<script data-pjax>
  function ${pluginname}_injector_config(){
    var parent_div_git = ${get_layout};
    var item_html = '${temple_html_text}';
    console.log('已挂载${pluginname}')
    parent_div_git.insertAdjacentHTML("afterbegin",item_html)
    }
  //屏蔽项判定
  var elist = '${data.exclude}'.split(',');
  var cpage = location.pathname;
  var epage = '${data.enable_page}';
  var flag = 0; //标记值
  //若命中屏蔽规则，则标记值加一
  for (var i=0;i<elist.length;i++){
    if (cpage.includes(elist[i])){
      flag++;
    }
  }
  // 对全站生效时才会判断屏蔽项
  if ((epage ==='all')&&(flag == 0)){
    ${pluginname}_injector_config();
  }
  // 对单一页面生效时无需判断屏蔽项
  else if (epage === cpage){
    ${pluginname}_injector_config();
  }
  </script>`
  // 使用hexo提供的注入器API，将对应的html代码片段注入到对应的位置
  // 此处利用挂载容器实现了二级注入，也就是所谓的套娃，
  // 注入用户脚本 将上文的容器脚本注入到body标签的结束符之前。
  hexo.extend.injector.register('body_end', user_info_js, "default");
  // 注入脚本资源，将上文的容器脚本注入到body标签的结束符之前。
  hexo.extend.injector.register('body_end', js_text, "default");
  // 注入样式资源，将上文的容器脚本注入到head标签的结束符之前。
  hexo.extend.injector.register('head_end', css_text, "default");
},
// 此处利用hexo提供的辅助函数来获取主题配置文件的配置内容，
// 如果不用辅助函数的话，最多只能读取到站点配置文件的内容。
hexo.extend.helper.register('priority', function(){
  // 过滤器优先级，priority 值越低，过滤器会越早执行，默认priority是10
  const pre_priority = hexo.config.config_name.priority || hexo.theme.config.config_name.priority
  // 此处设置过滤器优先级的预设值
  const priority = pre_priority ? pre_priority : 10
  // 返回最终的过滤器优先级数值
  return priority
})
)