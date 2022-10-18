const Image = require("@11ty/eleventy-img");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600, null],
    outputDir: "./dist/img/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/css")
    eleventyConfig.addPassthroughCopy("src/images")
    eleventyConfig.addPairedShortcode("intro", function(content){
      return `<div class="intro-header">${content}</div>`;
    });
    eleventyConfig.addPairedShortcode("intro-sub", function(content){
      return `<div class="intro-header-subsection">${content}</div>`;
    });

    let options = {
      html: true
    };
    let markdownLibrary = markdownIt(options).use(markdownItAttrs);
  
    eleventyConfig.setLibrary("md", markdownLibrary);
    

    // eleventyConfig.addShortcode('image',function (src, alt, width, height, classList){
    //     return `<img src="${src}" alt="${alt}" classList"${classList}" width="${width}" height="${height}">`;
    // });

    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
    eleventyConfig.addLiquidShortcode("image", imageShortcode);
    eleventyConfig.addJavaScriptFunction("image", imageShortcode);

    return {
        dir: {
            input: "src",
            output: "dist"
        }
    }
};