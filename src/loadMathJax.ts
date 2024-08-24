export const MathJax = {
    loader: { load: ['ui/lazy', 'input/asciimath', 'output/chtml'] }
};

(function () {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.js';
    script.async = true;
    document.head.appendChild(script);
})();