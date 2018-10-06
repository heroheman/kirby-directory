# kirby.directory

[Kirby](https://getkirby.com) is a file-based CMS by Bastian Allgeier. Unlike other systems such as ModX, Typo3 or even Wordpress, it can be set up quickly and yet is very flexible. It also allows extensions using plugins.

This page is a frontend [for the great plugin collection](https://github.com/jenstornell/kirby-plugins) of Jens Törnell on Github. Since Github itself is only moderately usable and I always wanted to implement a project with [Vue.js](https://vuejs.org), I took the opportunity and built a frontend myself using the [Github API](https://developer.github.com/v3/).

You can find the site here: https://kirby.directory

I also wrote a blog post about the project: https://flore.nz/blog/kirby-directory

## FAQ

### *Who are you?*
I am Florenz Heldermann and an independent frontend developer from Bremen, Germany. More information can be found on my [site](https://flore.nz), [blog](https://flore.nz/blog) or on [Twitter](https://twitter.com/track02). On LinkedIn and Xing I can also be found, but don't even get the idea to reach me there in a timely manner.

### *How can I add my plugin?*
Not here at all. Please go to the [plugin repository](https://github.com/jenstornell/kirby-plugins) on Github and add an issue. The issue should have a title, a short summary and a link to your Github repository.

### *I have a problem with Plugin XYZ!!!!1111oneeleven*
Don't ask me, ask the plugin author.

### *I have a problem with Kirby. Can you help me?*
No! That's what the [Kirby Support Forum](https://github.com/jenstornell/kirby-plugins) is for.

### *What was this site built with?*
This site was built using Vue.js, vue-cli (with webpack-simple), [VueMarkdown](https://github.com/miaolz123/vue-markdown) and the Github Api.

### *Um... So no Kirby?*
Right. This page is currently the only page I have written by myself. Probably as soon as [Kirby 3](https://getkirby.com/next) (with the new built-in Rest API) is released I will use a Kirby installation as backend.

### *Your code sucks!*
I know. I'm still learning. You can write me an E-mail or create a pull request on Github. And ... don't be mean!

### *Since this is a FAQ, where is the bad joke that always comes last?*
I haven't had time for that yet.

## Changelog
* 20180811 - 1.0: initial release
* 20180812 - 1.1: add images to listitems and some bugfixes
* 20180818 - 1.2: hide broken and deprecated links, global label exclude, better search a11y, small Improvements
* 20181006 - 1.2.1: change endpoint to [new github repo url](https://github.com/texnixe/kirby-plugins)

## Roadmap
* [x] Ask Jens if he agrees that I use his data.
* [x] improved search with cached results
* [x] Vuex State Implementation
* [ ] Kirby as content backend
* [ ] Github Login / Firebase Integration  for faving plugins
* [ ] add kirby templates
* [ ] think about a bad joke for the last faq point


## Build Setup (based on vue-cli 2.0.1)

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
