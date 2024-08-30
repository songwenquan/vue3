/**
 * @format
 * @Author: wqsong2
 * @Date: 2023/7/12 18:02
 * @Desciption:本地请求转发代理配置
 */
/* eslint-disable */
const proxyArr = [
  {
    cookie: 'SESSION=YWU2OGRjZTItMDIxOC00ODAwLTgzMzYtNzUyNGM4OWE2NWIx;',
    context: 'yth-dm-indicator-web',
    options: {
      target: 'https://xc-pro.iflytek.work/',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        '^/yth-dm-indicator-web': '/yth-dm-indicator-web'
      }
    }
  },
  {
    cookie: 'SESSION=OTkxOGZkZmQtNTU5MS00ZmU5LWIxOWItOTM5Y2VlM2Q3YzBi;',
    context: 'base',
    options: {
      target: 'https://xc-pro.iflytek.work/',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        '^/base': '/base'
      }
    }
  },
]

module.exports = proxyArr.reduce((acc, cur, idx) => {
  // eslint-disable-next-line no-useless-escape
  acc[`^\/${cur.context}\/[^\.]*((\.do)|(\.html)|(\.woff2)|(\.woff)|(\.ttf)|(\.(.*?)\.*css)|(\.(.*?)\.*js)|(\.(.*?)\.*png)|(\.(.*?)\.*gif)|(\.(.*?)\.*jpg))?$`] = {
    ...cur.options,
    onProxyReq: (proxyReq) => {
      cur.cookie &&
      proxyReq.setHeader('Cookie', `${cur.cookie};Path=/${cur.context}`)
    },
    bypass (req, res, proxyOptions) {
      if (req.method === 'OPTIONS') {
        res.statusCode = 200
        return 'a'
      }
    }
  }
  return acc
}, {})
/* eslint-disable no-new */
