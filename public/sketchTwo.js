var video;

var vScale = 8;
var oldVScale = 0;

var cp;
var gui;

var fillValue;
var saveFlag = false;
var svg;

var counter = 0;

function setup() {
    var cnv = createCanvas(644, 480);
    cnv.position(10, 10);

    pixelDensity(1);

    video = createCapture(VIDEO);
    video.hide();

    noStroke();

    cp = new Controls();
    gui = new dat.GUI();
    initGUI();
}

function draw() {
    background(255);

    vScale = cp.Pixel_Size;


    if (vScale != oldVScale) {
        video.size(width / vScale, height / vScale);
        oldVScale = vScale;
        console.log(vScale);
    }


    video.loadPixels();
    loadPixels();


    for (var y = 0; y < video.height; y++) {
        for (var x = 0; x < video.width; x++) {
            var index = (video.width - x + 1 + y * video.width) * 4;

            var r = video.pixels[index];
            var g = video.pixels[index + 1];
            var b = video.pixels[index + 2];
            var a = video.pixels[index + 3];

            var brightness = (r + g + b) / 3; // grey scale value

            if (brightness > cp.Threshold) {
                fillValue = 255;
            } else {
                fillValue = 0;
            }

            fill(fillValue);
            ellipse(x * vScale, y * vScale, vScale, vScale);
        }
    }
}

var literalSVGData;

function drawSVG() {
    vScale = cp.Pixel_Size;

    if (vScale != oldVScale) {
        video.size(width / vScale, height / vScale);
        oldVScale = vScale;
    }

    video.loadPixels();
    loadPixels();

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttributeNS(null, 'xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttributeNS(null, 'width', '640');
    svg.setAttributeNS(null, 'height', '480');
    svg.setAttributeNS(null, 'version', '1.1');
    // svg.setAttributeNS(null, 'xmlns', 'http://www.w3.org/2000/svg');

    for (var y = 0; y < video.height; y++) {
        for (var x = 0; x < video.width; x++) {
            var index = (x + y * video.width) * 4;

            var r = video.pixels[index];
            var g = video.pixels[index + 1];
            var b = video.pixels[index + 2];
            var a = video.pixels[index + 3];

            var brightness = (r + g + b) / 3; // grey scale value

            if (brightness > cp.Threshold) {
                fillValue = 'white';
            } else {
                fillValue = 'black';
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttributeNS(null, "fill", fillValue);
                circle.setAttributeNS(null, "stroke", "none");
                circle.setAttributeNS(null, "cx", x * vScale);
                circle.setAttributeNS(null, "cy", y * vScale);
                circle.setAttributeNS(null, "r", vScale / 2);
                svg.appendChild(circle);
            }
        }
    }
    // showing SVG
    var wrapper = document.getElementById('svg-wrapper');
    // wrapper.appendChild(svg);
    var newWrapper = wrapper.cloneNode();
    newWrapper.innerHTML = "";
    newWrapper.appendChild(svg);
    wrapper.parentNode.replaceChild(newWrapper, wrapper);


    // showing the svg xml code
    var textarea = document.getElementById('svg-as-text');
    textarea.value = svg.outerHTML;

    window.xxx = svg;

    literalSVGData = svg.outerHTML; // to be used later in the saving function.. 
}

function Save_SVG(svg) {

    // downloading SVG
    var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    
    
    console.log(svgUrl);
    var urlRef = document.getElementById('svgLink');
    urlRef.href = svgUrl;
    console.log(urlRef);
    urlRef.download = "Untitled.svg";
    document.body.appendChild(urlRef);
    urlRef.click();
    document.body.removeChild(urlRef);

}




var initGUI = function() {
    gui.add(cp, 'Threshold', 10, 200);
    gui.add(cp, 'Pixel_Size', 5, 10);
    gui.add(cp, 'Show_SVG');
    gui.add(cp, 'Save_SVG');
};

var Controls = function() {
    this.Threshold = 80;
    this.Pixel_Size = 8;

    this.Show_SVG = function() {
        drawSVG();
    };

    this.Save_SVG = function() {
        Save_SVG(literalSVGData);
    };
};