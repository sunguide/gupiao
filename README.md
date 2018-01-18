# gupiao

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/gupiao.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gupiao
[travis-image]: https://img.shields.io/travis/sunguide/gupiao.svg?style=flat-square
[travis-url]: https://travis-ci.org/sunguide/gupiao
[codecov-image]: https://img.shields.io/codecov/c/github/sunguide/gupiao.svg?style=flat-square
[codecov-url]: https://codecov.io/github/sunguide/gupiao?branch=master
[david-image]: https://img.shields.io/david/sunguide/gupiao.svg?style=flat-square
[david-url]: https://david-dm.org/sunguide/gupiao
[snyk-image]: https://snyk.io/test/npm/gupiao/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/gupiao
[download-image]: https://img.shields.io/npm/dm/gupiao.svg?style=flat-square
[download-url]: https://npmjs.org/package/gupiao

<!--
Description here.
-->

## Install

```bash
$ npm i gupiao -g
```
## Usage

```js
Usage: index [options]

  Options:

    -V, --version             输出版本号
    -r, --rocket              盘中异动实时监控
    add, --add <items>        添加股票 例如：gupiao add 600100
    remove, --remove <items>  删除股票 例如：gupiao remove 600100
    list, --list              股票列表
    --about                   关于

```
##example
```js
$ gupiao -r //查看股票行情异动情况
  
```


## Questions & Suggestions

Please open an issue [here](https://github.com/sunguide/gupiao/issues).

## License

[MIT](LICENSE)
