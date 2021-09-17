'use strict'
// 全局声明插件代号
const pluginname = 'butterfly_bbershow'
// 全局声明依赖
const pug = require('pug')
const path = require('path')
const urlFor = require('hexo-util').url_for.bind(hexo)
const util = require('hexo-util')

hexo.extend.filter.register('after_generate', function () {
    // 首先获取整体的配置项名称
    const config = hexo.config.bbershow || hexo.theme.config.bbershow
    // 如果配置开启
    if (!(config && config.enable)) return
        // 集体声明配置项
        const data = {
        enable_page: config.enable_page ? config.enable_page : "all",
        exclude: config.exclude,
        timemode: config.timemode ? config.timemode : "date",
        layout_type: config.layout.type,
        layout_name: config.layout.name,
        layout_index: config.layout.index ? config.layout.index : 0,
        error_img: config.error_img ? urlFor(config.error_img) : "https://cdn.jsdelivr.net/npm/akilar-candyassets/image/loading.gif",
        insertposition: config.insertposition ? config.insertposition : "afterbegin",
        swiper_list: swiper_list,
        default_descr: config.default_descr ? config.default_descr : "再怎么看我也不知道怎么描述它的啦！",
        custom_css: config.custom_css ? urlFor(config.custom_css) : "https://cdn.jsdelivr.net/npm/hexo-butterfly-swiper/lib/swiper.min.css",
        custom_js: config.custom_js ? urlFor(config.custom_js) : "https://cdn.jsdelivr.net/npm/hexo-butterfly-swiper/lib/swiper.min.js"
        }
    //cdn资源声明
    //样式资源
    const css_text = `<link rel="stylesheet" href="${data.custom_css}"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hexo-butterfly-swiper/lib/swiperstyle.css">`
    //脚本资源
    const js_text = `<script defer src="${data.custom_js}"></script><script defer data-pjax src="https://cdn.jsdelivr.net/npm/hexo-butterfly-swiper/lib/swiper_init.js"></script>`
}