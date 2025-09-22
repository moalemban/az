(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jsQR"] = factory();
	else
		root["jsQR"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BitMatrix = /** @class */ (function () {
    function BitMatrix(data, width) {
        this.width = width;
        this.height = data.length / width;
        this.data = data;
    }
    BitMatrix.createEmpty = function (width, height) {
        return new BitMatrix(new Uint8ClampedArray(width * height), width);
    };
    BitMatrix.prototype.get = function (x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        return !!this.data[y * this.width + x];
    };
    BitMatrix.prototype.set = function (x, y, v) {
        this.data[y * this.width + x] = v ? 1 : 0;
    };
    BitMatrix.prototype.setRegion = function (left, top, width, height, v) {
        for (var y = top; y < top + height; y++) {
            for (var x = left; x < left + width; x++) {
                this.set(x, y, !!v);
            }
        }
    };
    return BitMatrix;
}());
exports.BitMatrix = BitMatrix;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GenericGFPoly_1 = __webpack_require__(2);
function addOrSubtractGF(a, b) {
    return a ^ b; // tslint:disable-line:no-bitwise
}
exports.addOrSubtractGF = addOrSubtractGF;
var GenericGF = /** @class */ (function () {
    function GenericGF(primitive, size, genBase) {
        this.primitive = primitive;
        this.size = size;
        this.generatorBase = genBase;
        this.expTable = new Array(this.size);
        this.logTable = new Array(this.size);
        var x = 1;
        for (var i = 0; i < this.size; i++) {
            this.expTable[i] = x;
            x = x * 2;
            if (x >= this.size) {
                x = (x ^ this.primitive) & (this.size - 1); // tslint:disable-line:no-bitwise
            }
        }
        for (var i = 0; i < this.size - 1; i++) {
            this.logTable[this.expTable[i]] = i;
        }
        this.zero = new GenericGFPoly_1.default(this, Uint8ClampedArray.from([0]));
        this.one = new GenericGFPoly_1.default(this, Uint8ClampedArray.from([1]));
    }
    GenericGF.prototype.multiply = function (a, b) {
        if (a === 0 || b === 0) {
            return 0;
        }
        return this.expTable[(this.logTable[a] + this.logTable[b]) % (this.size - 1)];
    };
    GenericGF.prototype.inverse = function (a) {
        if (a === 0) {
            throw new Error("Can't invert 0");
        }
        return this.expTable[this.size - this.logTable[a] - 1];
    };
    GenericGF.prototype.buildMonomial = function (degree, coefficient) {
        if (degree < 0) {
            throw new Error("Invalid monomial degree less than 0");
        }
        if (coefficient === 0) {
            return this.zero;
        }
        var coefficients = new Uint8ClampedArray(degree + 1);
        coefficients[0] = coefficient;
        return new GenericGFPoly_1.default(this, coefficients);
    };
    GenericGF.prototype.log = function (a) {
        if (a === 0) {
            throw new Error("Can't take log(0)");
        }
        return this.logTable[a];
    };
    GenericGF.prototype.exp = function (a) {
        return this.expTable[a];
    };
    return GenericGF;
}());
exports.default = GenericGF;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GenericGF_1 = __webpack_require__(1);
var GenericGFPoly = /** @class */ (function () {
    function GenericGFPoly(field, coefficients) {
        if (coefficients.length === 0) {
            throw new Error("No coefficients.");
        }
        this.field = field;
        var coefficientsLength = coefficients.length;
        if (coefficientsLength > 1 && coefficients[0] === 0) {
            // Leading term must be non-zero for anything except the constant polynomial "0"
            var firstNonZero = 1;
            while (firstNonZero < coefficientsLength && coefficients[firstNonZero] === 0) {
                firstNonZero++;
            }
            if (firstNonZero === coefficientsLength) {
                this.coefficients = field.zero.coefficients;
            }
            else {
                this.coefficients = new Uint8ClampedArray(coefficientsLength - firstNonZero);
                for (var i = 0; i < this.coefficients.length; i++) {
                    this.coefficients[i] = coefficients[firstNonZero + i];
                }
            }
        }
        else {
            this.coefficients = coefficients;
        }
    }
    GenericGFPoly.prototype.degree = function () {
        return this.coefficients.length - 1;
    };
    GenericGFPoly.prototype.isZero = function () {
        return this.coefficients[0] === 0;
    };
    GenericGFPoly.prototype.getCoefficient = function (degree) {
        return this.coefficients[this.coefficients.length - 1 - degree];
    };
    GenericGFPoly.prototype.addOrSubtract = function (other) {
        var _a;
        if (this.isZero()) {
            return other;
        }
        if (other.isZero()) {
            return this;
        }
        var smallerCoefficients = this.coefficients;
        var largerCoefficients = other.coefficients;
        if (smallerCoefficients.length > largerCoefficients.length) {
            _a = [largerCoefficients, smallerCoefficients], smallerCoefficients = _a[0], largerCoefficients = _a[1];
        }
        var sumDiff = new Uint8ClampedArray(largerCoefficients.length);
        var lengthDiff = largerCoefficients.length - smallerCoefficients.length;
        for (var i = 0; i < lengthDiff; i++) {
            sumDiff[i] = largerCoefficients[i];
        }
        for (var i = lengthDiff; i < largerCoefficients.length; i++) {
            sumDiff[i] = GenericGF_1.addOrSubtractGF(smallerCoefficients[i - lengthDiff], largerCoefficients[i]);
        }
        return new GenericGFPoly(this.field, sumDiff);
    };
    GenericGFPoly.prototype.multiply = function (scalar) {
        if (scalar === 0) {
            return this.field.zero;
        }
        if (scalar === 1) {
            return this;
        }
        var size = this.coefficients.length;
        var product = new Uint8ClampedArray(size);
        for (var i = 0; i < size; i++) {
            product[i] = this.field.multiply(this.coefficients[i], scalar);
        }
        return new GenericGFPoly(this.field, product);
    };
    GenericGFPoly.prototype.multiplyPoly = function (other) {
        if (this.isZero() || other.isZero()) {
            return this.field.zero;
        }
        var aCoefficients = this.coefficients;
        var aLength = aCoefficients.length;
        var bCoefficients = other.coefficients;
        var bLength = bCoefficients.length;
        var product = new Uint8ClampedArray(aLength + bLength - 1);
        for (var i = 0; i < aLength; i++) {
            var aCoeff = aCoefficients[i];
            for (var j = 0; j < bLength; j++) {
                product[i + j] = GenericGF_1.addOrSubtractGF(product[i + j], this.field.multiply(aCoeff, bCoefficients[j]));
            }
        }
        return new GenericGFPoly(this.field, product);
    };
    GenericGFPoly.prototype.multiplyByMonomial = function (degree, coefficient) {
        if (degree < 0) {
            throw new Error("Invalid degree less than 0");
        }
        if (coefficient === 0) {
            return this.field.zero;
        }
        var size = this.coefficients.length;
        var product = new Uint8ClampedArray(size + degree);
        for (var i = 0; i < size; i++) {
            product[i] = this.field.multiply(this.coefficients[i], coefficient);
        }
        return new GenericGFPoly(this.field, product);
    };
    GenericGFPoly.prototype.evaluateAt = function (a) {
        var result = 0;
        if (a === 0) {
            // Just return the x^0 coefficient
            return this.getCoefficient(0);
        }
        var size = this.coefficients.length;
        if (a === 1) {
            // Just the sum of the coefficients
            this.coefficients.forEach(function (coefficient) {
                result = GenericGF_1.addOrSubtractGF(result, coefficient);
            });
            return result;
        }
        result = this.coefficients[0];
        for (var i = 1; i < size; i++) {
            result = GenericGF_1.addOrSubtractGF(this.field.multiply(a, result), this.coefficients[i]);
        }
        return result;
    };
    return GenericGFPoly;
}());
exports.default = GenericGFPoly;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var binarizer_1 = __webpack_require__(4);
var decoder_1 = __webpack_require__(5);
var extractor_1 = __webpack_require__(11);
var locator_1 = __webpack_require__(12);
function scan(matrix) {
    var locations = locator_1.locate(matrix);
    if (!locations) {
        return null;
    }
    for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
        var location_1 = locations_1[_i];
        var extracted = extractor_1.extract(matrix, location_1);
        var decoded = decoder_1.decode(extracted.matrix);
        if (decoded) {
            return {
                binaryData: decoded.bytes,
                data: decoded.text,
                chunks: decoded.chunks,
                version: decoded.version,
                location: {
                    topRightCorner: extracted.mappingFunction(location_1.dimension, 0),
                    topLeftCorner: extracted.mappingFunction(0, 0),
                    bottomRightCorner: extracted.mappingFunction(location_1.dimension, location_1.dimension),
                    bottomLeftCorner: extracted.mappingFunction(0, location_1.dimension),
                    topRightFinderPattern: location_1.topRight,
                    topLeftFinderPattern: location_1.topLeft,
                    bottomLeftFinderPattern: location_1.bottomLeft,
                    bottomRightAlignmentPattern: location_1.alignmentPattern,
                },
            };
        }
    }
    return null;
}
var defaultOptions = {
    inversionAttempts: "attemptBoth",
};
function jsQR(data, width, height, providedOptions) {
    if (providedOptions === void 0) { providedOptions = {}; }
    var options = defaultOptions;
    Object.keys(options || {}).forEach(function (opt) {
        options[opt] = providedOptions[opt] || options[opt];
    });
    var shouldInvert = options.inversionAttempts === "attemptBoth" || options.inversionAttempts === "invertFirst";
    var tryInvertedFirst = options.inversionAttempts === "onlyInvert" || options.inversionAttempts === "invertFirst";
    var _a = binarizer_1.binarize(data, width, height, shouldInvert), binarized = _a.binarized, inverted = _a.inverted;
    var result = scan(tryInvertedFirst ? inverted : binarized);
    if (!result && (options.inversionAttempts === "attemptBoth" || options.inversionAttempts === "invertFirst")) {
        result = scan(tryInvertedFirst ? binarized : inverted);
    }
    return result;
}
jsQR.default = jsQR;
exports.default = jsQR;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BitMatrix_1 = __webpack_require__(0);
var REGION_SIZE = 8;
var MIN_DYNAMIC_RANGE = 24;
function numBetween(value, min, max) {
    return value < min ? min : value > max ? max : value;
}
// Like BitMatrix but accepts arbitry Uint8 values
var Matrix = /** @class */ (function () {
    function Matrix(width, height) {
        this.width = width;
        this.data = new Uint8ClampedArray(width * height);
    }
    Matrix.prototype.get = function (x, y) {
        return this.data[y * this.width + x];
    };
    Matrix.prototype.set = function (x, y, value) {
        this.data[y * this.width + x] = value;
    };
    return Matrix;
}());
function binarize(data, width, height, returnInverted) {
    if (data.length !== width * height * 4) {
        throw new Error("Malformed data passed to binarizer.");
    }
    // Convert image to greyscale
    var greyscalePixels = new Matrix(width, height);
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var r = data[((y * width + x) * 4) + 0];
            var g = data[((y * width + x) * 4) + 1];
            var b = data[((y * width + x) * 4) + 2];
            greyscalePixels.set(x, y, 0.2126 * r + 0.7152 * g + 0.0722 * b);
        }
    }
    var horizontalRegionCount = Math.ceil(width / REGION_SIZE);
    var verticalRegionCount = Math.ceil(height / REGION_SIZE);
    var blackPoints = new Matrix(horizontalRegionCount, verticalRegionCount);
    for (var verticalRegion = 0; verticalRegion < verticalRegionCount; verticalRegion++) {
        for (var hortizontalRegion = 0; hortizontalRegion < horizontalRegionCount; hortizontalRegion++) {
            var sum = 0;
            var min = Infinity;
            var max = 0;
            for (var y = 0; y < REGION_SIZE; y++) {
                for (var x = 0; x < REGION_SIZE; x++) {
                    var pixelLumosity = greyscalePixels.get(hortizontalRegion * REGION_SIZE + x, verticalRegion * REGION_SIZE + y);
                    sum += pixelLumosity;
                    min = Math.min(min, pixelLumosity);
                    max = Math.max(max, pixelLumosity);
                }
            }
            var average = sum / (Math.pow(REGION_SIZE, 2));
            if (max - min <= MIN_DYNAMIC_RANGE) {
                // If variation within the block is low, assume this is a block with only light or only
                // dark pixels. In that case we do not want to use the average, as it would divide this
                // low contrast area into black and white pixels, essentially creating data out of noise.
                //
                // Default the blackpoint for these blocks to be half the min - effectively white them out
                average = min / 2;
                if (verticalRegion > 0 && hortizontalRegion > 0) {
                    // Correct the "white background" assumption for blocks that have neighbors by comparing
                    // the pixels in this block to the previously calculated black points. This is based on
                    // the fact that dark barcode symbology is always surrounded by some amount of light
                    // background for which reasonable black point estimates were made. The bp estimated at
                    // the boundaries is used for the interior.
                    // The (min < bp) is arbitrary but works better than other heuristics that were tried.
                    var averageNeighborBlackPoint = (blackPoints.get(hortizontalRegion, verticalRegion - 1) +
                        (2 * blackPoints.get(hortizontalRegion - 1, verticalRegion)) +
                        blackPoints.get(hortizontalRegion - 1, verticalRegion - 1)) / 4;
                    if (min < averageNeighborBlackPoint) {
                        average = averageNeighborBlackPoint;
                    }
                }
            }
            blackPoints.set(hortizontalRegion, verticalRegion, average);
        }
    }
    var binarized = BitMatrix_1.BitMatrix.createEmpty(width, height);
    var inverted = null;
    if (returnInverted) {
        inverted = BitMatrix_1.BitMatrix.createEmpty(width, height);
    }
    for (var verticalRegion = 0; verticalRegion < verticalRegionCount; verticalRegion++) {
        for (var hortizontalRegion = 0; hortizontalRegion < horizontalRegionCount; hortizontalRegion++) {
            var left = numBetween(hortizontalRegion, 2, horizontalRegionCount - 3);
            var top_1 = numBetween(verticalRegion, 2, verticalRegionCount - 3);
            var sum = 0;
            for (var xRegion = -2; xRegion <= 2; xRegion++) {
                for (var yRegion = -2; yRegion <= 2; yRegion++) {
                    sum += blackPoints.get(left + xRegion, top_1 + yRegion);
                }
            }
            var threshold = sum / 25;
            for (var xRegion = 0; xRegion < REGION_SIZE; xRegion++) {
                for (var yRegion = 0; yRegion < REGION_SIZE; yRegion++) {
                    var x = hortizontalRegion * REGION_SIZE + xRegion;
                    var y = verticalRegion * REGION_SIZE + yRegion;
                    var lum = greyscalePixels.get(x, y);
                    binarized.set(x, y, lum <= threshold);
                    if (returnInverted) {
                        inverted.set(x, y, !(lum <= threshold));
                    }
                }
            }
        }
    }
    if (returnInverted) {
        return { binarized: binarized, inverted: inverted };
    }
    return { binarized: binarized };
}
exports.binarize = binarize;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BitMatrix_1 = __webpack_require__(0);
var decodeData_1 = __webpack_require__(6);
var reedsolomon_1 = __webpack_require__(9);
var version_1 = __webpack_require__(10);
// tslint:disable:no-bitwise
function numBitsDiffering(x, y) {
    var z = x ^ y;
    var bitCount = 0;
    while (z) {
        bitCount++;
        z &= z - 1;
    }
    return bitCount;
}
function pushBit(bit, byte) {
    return (byte << 1) | bit;
}
// tslint:enable:no-bitwise
var FORMAT_INFO_TABLE = [
    { bits: 0x5412, formatInfo: { errorCorrectionLevel: 1, dataMask: 0 } },
    { bits: 0x5125, formatInfo: { errorCorrectionLevel: 1, dataMask: 1 } },
    { bits: 0x5E7C, formatInfo: { errorCorrectionLevel: 1, dataMask: 2 } },
    { bits: 0x5B4B, formatInfo: { errorCorrectionLevel: 1, dataMask: 3 } },
    { bits: 0x45F9, formatInfo: { errorCorrectionLevel: 1, dataMask: 4 } },
    { bits: 0x40CE, formatInfo: { errorCorrectionLevel: 1, dataMask: 5 } },
    { bits: 0x4F97, formatInfo: { errorCorrectionLevel: 1, dataMask: 6 } },
    { bits: 0x4AA0, formatInfo: { errorCorrectionLevel: 1, dataMask: 7 } },
    { bits: 0x77C4, formatInfo: { errorCorrectionLevel: 0, dataMask: 0 } },
    { bits: 0x72F3, formatInfo: { errorCorrectionLevel: 0, dataMask: 1 } },
    { bits: 0x7DAA, formatInfo: { errorCorrectionLevel: 0, dataMask: 2 } },
    { bits: 0x789D, formatInfo: { errorCorrectionLevel: 0, dataMask: 3 } },
    { bits: 0x662F, formatInfo: { errorCorrectionLevel: 0, dataMask: 4 } },
    { bits: 0x6318, formatInfo: { errorCorrectionLevel: 0, dataMask: 5 } },
    { bits: 0x6C41, formatInfo: { errorCorrectionLevel: 0, dataMask: 6 } },
    { bits: 0x6976, formatInfo: { errorCorrectionLevel: 0, dataMask: 7 } },
    { bits: 0x1689, formatInfo: { errorCorrectionLevel: 3, dataMask: 0 } },
    { bits: 0x13BE, formatInfo: { errorCorrectionLevel: 3, dataMask: 1 } },
    { bits: 0x1CE7, formatInfo: { errorCorrectionLevel: 3, dataMask: 2 } },
    { bits: 0x19D0, formatInfo: { errorCorrectionLevel: 3, dataMask: 3 } },
    { bits: 0x0762, formatInfo: { errorCorrectionLevel: 3, dataMask: 4 } },
    { bits: 0x0255, formatInfo: { errorCorrectionLevel: 3, dataMask: 5 } },
    { bits: 0x0D0C, formatInfo: { errorCorrectionLevel: 3, dataMask: 6 } },
    { bits: 0x083B, formatInfo: { errorCorrectionLevel: 3, dataMask: 7 } },
    { bits: 0x355F, formatInfo: { errorCorrectionLevel: 2, dataMask: 0 } },
    { bits: 0x3068, formatInfo: { errorCorrectionLevel: 2, dataMask: 1 } },
    { bits: 0x3F31, formatInfo: { errorCorrectionLevel: 2, dataMask: 2 } },
    { bits: 0x3A06, formatInfo: { errorCorrectionLevel: 2, dataMask: 3 } },
    { bits: 0x24B4, formatInfo: { errorCorrectionLevel: 2, dataMask: 4 } },
    { bits: 0x2183, formatInfo: { errorCorrectionLevel: 2, dataMask: 5 } },
    { bits: 0x2EDA, formatInfo: { errorCorrectionLevel: 2, dataMask: 6 } },
    { bits: 0x2BED, formatInfo: { errorCorrectionLevel: 2, dataMask: 7 } },
];
var DATA_MASKS = [
    function (p) { return ((p.y + p.x) % 2) === 0; },
    function (p) { return (p.y % 2) === 0; },
    function (p) { return p.x % 3 === 0; },
    function (p) { return (p.y + p.x) % 3 === 0; },
    function (p) { return (Math.floor(p.y / 2) + Math.floor(p.x / 3)) % 2 === 0; },
    function (p) { return ((p.x * p.y) % 2) + ((p.x * p.y) % 3) === 0; },
    function (p) { return ((((p.y * p.x) % 2) + (p.y * p.x) % 3) % 2) === 0; },
    function (p) { return ((((p.y + p.x) % 2) + (p.y * p.x) % 3) % 2) === 0; },
];
function buildFunctionPatternMask(version) {
    var dimension = 17 + 4 * version.versionNumber;
    var matrix = BitMatrix_1.BitMatrix.createEmpty(dimension, dimension);
    matrix.setRegion(0, 0, 9, 9, true); // Top left finder pattern + separator + format
    matrix.setRegion(dimension - 8, 0, 8, 9, true); // Top right finder pattern + separator + format
    matrix.setRegion(0, dimension - 8, 9, 8, true); // Bottom left finder pattern + separator + format
    // Alignment patterns
    for (var _i = 0, _a = version.alignmentPatternCenters; _i < _a.length; _i++) {
        var x = _a[_i];
        for (var _b = 0, _c = version.alignmentPatternCenters; _b < _c.length; _b++) {
            var y = _c[_b];
            if (!(x === 6 && y === 6 || x === 6 && y === dimension - 7 || x === dimension - 7 && y === 6)) {
                matrix.setRegion(x - 2, y - 2, 5, 5, true);
            }
        }
    }
    matrix.setRegion(6, 9, 1, dimension - 17, true); // Vertical timing pattern
    matrix.setRegion(9, 6, dimension - 17, 1, true); // Horizontal timing pattern
    if (version.versionNumber > 6) {
        matrix.setRegion(dimension - 11, 0, 3, 6, true); // Version info, top right
        matrix.setRegion(0, dimension - 11, 6, 3, true); // Version info, bottom left
    }
    return matrix;
}
function readCodewords(matrix, version, formatInfo) {
    var dataMask = DATA_MASKS[formatInfo.dataMask];
    var dimension = matrix.height;
    var functionPatternMask = buildFunctionPatternMask(version);
    var codewords = [];
    var currentByte = 0;
    var bitsRead = 0;
    // Read columns in pairs, from right to left
    var readingUp = true;
    for (var columnIndex = dimension - 1; columnIndex > 0; columnIndex -= 2) {
        if (columnIndex === 6) { // Skip whole column with vertical alignment pattern;
            columnIndex--;
        }
        for (var i = 0; i < dimension; i++) {
            var y = readingUp ? dimension - 1 - i : i;
            for (var columnOffset = 0; columnOffset < 2; columnOffset++) {
                var x = columnIndex - columnOffset;
                if (!functionPatternMask.get(x, y)) {
                    bitsRead++;
                    var bit = matrix.get(x, y);
                    if (dataMask({ y: y, x: x })) {
                        bit = !bit;
                    }
                    currentByte = pushBit(bit, currentByte);
                    if (bitsRead === 8) { // Whole bytes
                        codewords.push(currentByte);
                        bitsRead = 0;
                        currentByte = 0;
                    }
                }
            }
        }
        readingUp = !readingUp;
    }
    return codewords;
}
function readVersion(matrix) {
    var dimension = matrix.height;
    var provisionalVersion = Math.floor((dimension - 17) / 4);
    if (provisionalVersion <= 6) { // 6 and under dont have version info in the QR code
        return version_1.VERSIONS[provisionalVersion - 1];
    }
    var topRightVersionBits = 0;
    for (var y = 5; y >= 0; y--) {
        for (var x = dimension - 9; x >= dimension - 11; x--) {
            topRightVersionBits = pushBit(matrix.get(x, y), topRightVersionBits);
        }
    }
    var bottomLeftVersionBits = 0;
    for (var x = 5; x >= 0; x--) {
        for (var y = dimension - 9; y >= dimension - 11; y--) {
            bottomLeftVersionBits = pushBit(matrix.get(x, y), bottomLeftVersionBits);
        }
    }
    var bestDifference = Infinity;
    var bestVersion;
    for (var _i = 0, VERSIONS_1 = version_1.VERSIONS; _i < VERSIONS_1.length; _i++) {
        var version = VERSIONS_1[_i];
        if (version.infoBits === topRightVersionBits || version.infoBits === bottomLeftVersionBits) {
            return version;
        }
        var difference = numBitsDiffering(topRightVersionBits, version.infoBits);
        if (difference < bestDifference) {
            bestVersion = version;
            bestDifference = difference;
        }
        difference = numBitsDiffering(bottomLeftVersionBits, version.infoBits);
        if (difference < bestDifference) {
            bestVersion = version;
            bestDifference = difference;
        }
    }
    // We can tolerate up to 3 bits of error since no two version info codewords will
    // differ in less than 8 bits.
    if (bestDifference <= 3) {
        return bestVersion;
    }
}
function readFormatInformation(matrix) {
    var topLeftFormatInfoBits = 0;
    for (var x = 0; x <= 8; x++) {
        if (x !== 6) { // Skip timing pattern bit
            topLeftFormatInfoBits = pushBit(matrix.get(x, 8), topLeftFormatInfoBits);
        }
    }
    for (var y = 7; y >= 0; y--) {
        if (y !== 6) { // Skip timing pattern bit
            topLeftFormatInfoBits = pushBit(matrix.get(8, y), topLeftFormatInfoBits);
        }
    }
    var dimension = matrix.height;
    var topRightBottomRightFormatInfoBits = 0;
    for (var y = dimension - 1; y >= dimension - 7; y--) { // bottom left
        topRightBottomRightFormatInfoBits = pushBit(matrix.get(8, y), topRightBottomRightFormatInfoBits);
    }
    for (var x = dimension - 8; x < dimension; x++) { // top right
        topRightBottomRightFormatInfoBits = pushBit(matrix.get(x, 8), topRightBottomRightFormatInfoBits);
    }
    var bestDifference = Infinity;
    var bestFormatInfo = null;
    for (var _i = 0, FORMAT_INFO_TABLE_1 = FORMAT_INFO_TABLE; _i < FORMAT_INFO_TABLE_1.length; _i++) {
        var _a = FORMAT_INFO_TABLE_1[_i], bits = _a.bits, formatInfo = _a.formatInfo;
        if (bits === topLeftFormatInfoBits || bits === topRightBottomRightFormatInfoBits) {
            return formatInfo;
        }
        var difference = numBitsDiffering(topLeftFormatInfoBits, bits);
        if (difference < bestDifference) {
            bestFormatInfo = formatInfo;
            bestDifference = difference;
        }
        if (topLeftFormatInfoBits !== topRightBottomRightFormatInfoBits) { // also try the other option
            difference = numBitsDiffering(topRightBottomRightFormatInfoBits, bits);
            if (difference < bestDifference) {
                bestFormatInfo = formatInfo;
                bestDifference = difference;
            }
        }
    }
    // Hamming distance of the 32 masked codes is 7, by construction, so <= 3 bits differing means we found a match
    if (bestDifference <= 3) {
        return bestFormatInfo;
    }
    return null;
}
function getDataBlocks(codewords, version, ecLevel) {
    var ecInfo = version.errorCorrectionLevels[ecLevel];
    var dataBlocks = [];
    var totalCodewords = 0;
    ecInfo.ecBlocks.forEach(function (block) {
        for (var i = 0; i < block.numBlocks; i++) {
            dataBlocks.push({ numDataCodewords: block.dataCodewordsPerBlock, codewords: [] });
            totalCodewords += block.dataCodewordsPerBlock + ecInfo.ecCodewordsPerBlock;
        }
    });
    // In some cases the QR code will be malformed enough that we pull off more or less than we should.
    // If we pull off less there's nothing we can do.
    // If we pull off more we can safely truncate
    if (codewords.length < totalCodewords) {
        return null;
    }
    codewords = codewords.slice(0, totalCodewords);
    var shortBlockSize = ecInfo.ecBlocks[0].dataCodewordsPerBlock;
    // Pull codewords to fill the blocks up to the minimum size
    for (var i = 0; i < shortBlockSize; i++) {
        for (var _i = 0, dataBlocks_1 = dataBlocks; _i < dataBlocks_1.length; _i++) {
            var dataBlock = dataBlocks_1[_i];
            dataBlock.codewords.push(codewords.shift());
        }
    }
    // If there are any large blocks, pull codewords to fill the last element of those
    if (ecInfo.ecBlocks.length > 1) {
        var smallBlockCount = ecInfo.ecBlocks[0].numBlocks;
        var largeBlockCount = ecInfo.ecBlocks[1].numBlocks;
        for (var i = 0; i < largeBlockCount; i++) {
            dataBlocks[smallBlockCount + i].codewords.push(codewords.shift());
        }
    }
    // Add the rest of the codewords to the blocks. These are the error correction codewords.
    while (codewords.length > 0) {
        for (var _a = 0, dataBlocks_2 = dataBlocks; _a < dataBlocks_2.length; _a++) {
            var dataBlock = dataBlocks_2[_a];
            dataBlock.codewords.push(codewords.shift());
        }
    }
    return dataBlocks;
}
function decodeMatrix(matrix) {
    var version = readVersion(matrix);
    if (!version) {
        return null;
    }
    var formatInfo = readFormatInformation(matrix);
    if (!formatInfo) {
        return null;
    }
    var codewords = readCodewords(matrix, version, formatInfo);
    var dataBlocks = getDataBlocks(codewords, version, formatInfo.errorCorrectionLevel);
    if (!dataBlocks) {
        return null;
    }
    // Count total number of data bytes
    var totalBytes = dataBlocks.reduce(function (a, b) { return a + b.numDataCodewords; }, 0);
    var resultBytes = new Uint8ClampedArray(totalBytes);
    var resultIndex = 0;
    for (var _i = 0, dataBlocks_3 = dataBlocks; _i < dataBlocks_3.length; _i++) {
        var dataBlock = dataBlocks_3[_i];
        var correctedBytes = reedsolomon_1.decode(dataBlock.codewords, dataBlock.codewords.length - dataBlock.numDataCodewords);
        if (!correctedBytes) {
            return null;
        }
        for (var i = 0; i < dataBlock.numDataCodewords; i++) {
            resultBytes[resultIndex++] = correctedBytes[i];
        }
    }
    try {
        return decodeData_1.decode(resultBytes, version.versionNumber);
    }
    catch (_a) {
        return null;
    }
}
function decode(matrix) {
    if (matrix == null) {
        return null;
    }
    var result = decodeMatrix(matrix);
    if (result) {
        return result;
    }
    // Decoding didn't work, try mirroring the QR across the topLeft -> bottomRight line.
    for (var x = 0; x < matrix.width; x++) {
        for (var y = x + 1; y < matrix.height; y++) {
            if (matrix.get(x, y) !== matrix.get(y, x)) {
                matrix.set(x, y, !matrix.get(x, y));
                matrix.set(y, x, !matrix.get(y, x));
            }
        }
    }
    return decodeMatrix(matrix);
}
exports.decode = decode;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-bitwise
var BitStream_1 = __webpack_require__(7);
var shiftJISTable_1 = __webpack_require__(8);
var Mode;
(function (Mode) {
    Mode["Numeric"] = "numeric";
    Mode["Alphanumeric"] = "alphanumeric";
    Mode["Byte"] = "byte";
    Mode["Kanji"] = "kanji";
    Mode["ECI"] = "eci";
})(Mode = exports.Mode || (exports.Mode = {}));
var ModeByte;
(function (ModeByte) {
    ModeByte[ModeByte["Terminator"] = 0] = "Terminator";
    ModeByte[ModeByte["Numeric"] = 1] = "Numeric";
    ModeByte[ModeByte["Alphanumeric"] = 2] = "Alphanumeric";
    ModeByte[ModeByte["Byte"] = 4] = "Byte";
    ModeByte[ModeByte["Kanji"] = 8] = "Kanji";
    ModeByte[ModeByte["ECI"] = 7] = "ECI";
    // StructuredAppend = 0x3,
    // FNC1FirstPosition = 0x5,
    // FNC1SecondPosition = 0x9,
})(ModeByte || (ModeByte = {}));
function decodeNumeric(stream, size) {
    var bytes = [];
    var text = "";
    var characterCountSize = [10, 12, 14][size];
    var length = stream.readBits(characterCountSize);
    // Read digits in groups of 3
    while (length >= 3) {
        var num = stream.readBits(10);
        if (num >= 1000) {
            throw new Error("Invalid numeric value above 999");
        }
        var a = Math.floor(num / 100);
        var b = Math.floor(num / 10) % 10;
        var c = num % 10;
        bytes.push(48 + a, 48 + b, 48 + c);
        text += a.toString() + b.toString() + c.toString();
        length -= 3;
    }
    // If the number of digits aren't a multiple of 3, the remaining digits are special cased.
    if (length === 2) {
        var num = stream.readBits(7);
        if (num >= 100) {
            throw new Error("Invalid numeric value above 99");
        }
        var a = Math.floor(num / 10);
        var b = num % 10;
        bytes.push(48 + a, 48 + b);
        text += a.toString() + b.toString();
    }
    else if (length === 1) {
        var num = stream.readBits(4);
        if (num >= 10) {
            throw new Error("Invalid numeric value above 9");
        }
        bytes.push(48 + num);
        text += num.toString();
    }
    return { bytes: bytes, text: text };
}
var AlphanumericCharacterCodes = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8",
    "9", "A", "B", "C", "D", "E", "F", "G", "H",
    "I", "J", "K", "L", "M", "N", "O", "P", "Q",
    "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    " ", "$", "%", "*", "+", "-", ".", "/", ":",
];
function decodeAlphanumeric(stream, size) {
    var bytes = [];
    var text = "";
    var characterCountSize = [9, 11, 13][size];
    var length = stream.readBits(characterCountSize);
    while (length >= 2) {
        var v = stream.readBits(11);
        var a = Math.floor(v / 45);
        var b = v % 45;
        bytes.push(AlphanumericCharacterCodes[a].charCodeAt(0), AlphanumericCharacterCodes[b].charCodeAt(0));
        text += AlphanumericCharacterCodes[a] + AlphanumericCharacterCodes[b];
        length -= 2;
    }
    if (length === 1) {
        var a = stream.readBits(6);
        bytes.push(AlphanumericCharacterCodes[a].charCodeAt(0));
        text += AlphanumericCharacterCodes[a];
    }
    return { bytes: bytes, text: text };
}
function decodeByte(stream, size) {
    var bytes = [];
    var text = "";
    var characterCountSize = [8, 16, 16][size];
    var length = stream.readBits(characterCountSize);
    for (var i = 0; i < length; i++) {
        var b = stream.readBits(8);
        bytes.push(b);
    }
    try {
        text += decodeURIComponent(bytes.map(function (b) { return "%" + ("0" + b.toString(16)).substr(-2); }).join(""));
    }
    catch (_a) {
        // failed to decode
    }
    return { bytes: bytes, text: text };
}
function decodeKanji(stream, size) {
    var bytes = [];
    var text = "";
    var characterCountSize = [8, 10, 12][size];
    var length = stream.readBits(characterCountSize);
    for (var i = 0; i < length; i++) {
        var k = stream.readBits(13);
        var c = (Math.floor(k / 0xC0) << 8) | (k % 0xC0);
        if (c < 0x1F00) {
            c += 0x8140;
        }
        else {
            c += 0xC140;
        }
        bytes.push(c >> 8, c & 0xFF);
        text += String.fromCharCode(shiftJISTable_1.shiftJISTable[c]);
    }
    return { bytes: bytes, text: text };
}
function decode(data, version) {
    var _a, _b, _c, _d;
    var stream = new BitStream_1.BitStream(data);
    // There are 3 'sizes' based on the version. 1-9 is small (0), 10-26 is medium (1) and 27-40 is large (2).
    var size = version <= 9 ? 0 : version <= 26 ? 1 : 2;
    var result = {
        text: "",
        bytes: [],
        chunks: [],
        version: version,
    };
    while (stream.available() >= 4) {
        var mode = stream.readBits(4);
        if (mode === ModeByte.Terminator) {
            return result;
        }
        else if (mode === ModeByte.ECI) {
            if (stream.readBits(1) === 0) {
                result.chunks.push({
                    type: Mode.ECI,
                    assignmentNumber: stream.readBits(7),
                });
            }
            else if (stream.readBits(1) === 0) {
                result.chunks.push({
                    type: Mode.ECI,
                    assignmentNumber: stream.readBits(14),
                });
            }
            else if (stream.readBits(1) === 0) {
                result.chunks.push({
                    type: Mode.ECI,
                    assignmentNumber: stream.readBits(21),
                });
            }
            else {
                // ECI data seems corrupted
                result.chunks.push({
                    type: Mode.ECI,
                    assignmentNumber: -1,
                });
            }
        }
        else if (mode === ModeByte.Numeric) {
            var numericResult = decodeNumeric(stream, size);
            result.text += numericResult.text;
            (_a = result.bytes).push.apply(_a, numericResult.bytes);
            result.chunks.push({
                type: Mode.Numeric,
                text: numericResult.text,
            });
        }
        else if (mode === ModeByte.Alphanumeric) {
            var alphanumericResult = decodeAlphanumeric(stream, size);
            result.text += alphanumericResult.text;
            (_b = result.bytes).push.apply(_b, alphanumericResult.bytes);
            result.chunks.push({
                type: Mode.Alphanumeric,
                text: alphanumericResult.text,
            });
        }
        else if (mode === ModeByte.Byte) {
            var byteResult = decodeByte(stream, size);
            result.text += byteResult.text;
            (_c = result.bytes).push.apply(_c, byteResult.bytes);
            result.chunks.push({
                type: Mode.Byte,
                bytes: byteResult.bytes,
                text: byteResult.text,
            });
        }
        else if (mode === ModeByte.Kanji) {
            var kanjiResult = decodeKanji(stream, size);
            result.text += kanjiResult.text;
            (_d = result.bytes).push.apply(_d, kanjiResult.bytes);
            result.chunks.push({
                type: Mode.Kanji,
                bytes: kanjiResult.bytes,
                text: kanjiResult.text,
            });
        }
    }
    // If there is no data left, or the remaining bits are all 0, then that counts as a termination marker
    if (stream.available() === 0 || stream.readBits(stream.available()) === 0) {
        return result;
    }
}
exports.decode = decode;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// tslint:disable:no-bitwise
Object.defineProperty(exports, "__esModule", { value: true });
var BitStream = /** @class */ (function () {
    function BitStream(bytes) {
        this.byteOffset = 0;
        this.bitOffset = 0;
        this.bytes = bytes;
    }
    BitStream.prototype.readBits = function (numBits) {
        if (numBits < 1 || numBits > 32 || numBits > this.available()) {
            throw new Error("Cannot read " + numBits.toString() + " bits");
        }
        var result = 0;
        // First, read remainder from current byte
        if (this.bitOffset > 0) {
            var bitsLeft = 8 - this.bitOffset;
            var toRead = numBits < bitsLeft ? numBits : bitsLeft;
            var bitsToNotRead = bitsLeft - toRead;
            var mask = (0xFF >> (8 - toRead)) << bitsToNotRead;
            result = (this.bytes[this.byteOffset] & mask) >> bitsToNotRead;
            numBits -= toRead;
            this.bitOffset += toRead;
            if (this.bitOffset === 8) {
                this.bitOffset = 0;
                this.byteOffset++;
            }
        }
        // Next read whole bytes
        if (numBits > 0) {
            while (numBits >= 8) {
                result = (result << 8) | (this.bytes[this.byteOffset] & 0xFF);
                this.byteOffset++;
                numBits -= 8;
            }
            // Finally read a partial byte
            if (numBits > 0) {
                var bitsToNotRead = 8 - numBits;
                var mask = (0xFF >> bitsToNotRead) << bitsToNotRead;
                result = (result << numBits) | ((this.bytes[this.byteOffset] & mask) >> bitsToNotRead);
                this.bitOffset += numBits;
            }
        }
        return result;
    };
    BitStream.prototype.available = function () {
        return 8 * (this.bytes.length - this.byteOffset) - this.bitOffset;
    };
    return BitStream;
}());
exports.BitStream = BitStream;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftJISTable = {
    0x20: 0x0020,
    0x21: 0x0021,
    0x22: 0x0022,
    0x23: 0x0023,
    0x24: 0x0024,
    0x25: 0x0025,
    0x26: 0x0026,
    0x27: 0x0027,
    0x28: 0x0028,
    0x29: 0x0029,
    0x2A: 0x002A,
    0x2B: 0x002B,
    0x2C: 0x002C,
    0x2D: 0x002D,
    0x2E: 0x002E,
    0x2F: 0x002F,
    0x30: 0x0030,
    0x31: 0x0031,
    0x32: 0x0032,
    0x33: 0x0033,
    0x34: 0x0034,
    0x35: 0x0035,
    0x36: 0x0036,
    0x37: 0x0037,
    0x38: 0x0038,
    0x39: 0x0039,
    0x3A: 0x003A,
    0x3B: 0x003B,
    0x3C: 0x003C,
    0x3D: 0x003D,
    0x3E: 0x003E,
    0x3F: 0x003F,
    0x40: 0x0040,
    0x41: 0x0041,
    0x42: 0x0042,
    0x43: 0x0043,
    0x44: 0x0044,
    0x45: 0x0045,
    0x46: 0x0046,
    0x47: 0x0047,
    0x48: 0x0048,
    0x49: 0x0049,
    0x4A: 0x004A,
    0x4B: 0x004B,
    0x4C: 0x004C,
    0x4D: 0x004D,
    0x4E: 0x004E,
    0x4F: 0x004F,
    0x50: 0x0050,
    0x51: 0x0051,
    0x52: 0x0052,
    0x53: 0x0053,
    0x54: 0x0054,
    0x55: 0x0055,
    0x56: 0x0056,
    0x57: 0x0057,
    0x58: 0x0058,
    0x59: 0x0059,
    0x5A: 0x005A,
    0x5B: 0x005B,
    0x5C: 0x00A5,
    0x5D: 0x005D,
    0x5E: 0x005E,
    0x5F: 0x005F,
    0x60: 0x0060,
    0x61: 0x0061,
    0x62: 0x0062,
    0x63: 0x0063,
    0x64: 0x0064,
    0x65: 0x0065,
    0x66: 0x0066,
    0x67: 0x0067,
    0x68: 0x0068,
    0x69: 0x0069,
    0x6A: 0x006A,
    0x6B: 0x006B,
    0x6C: 0x006C,
    0x6D: 0x006D,
    0x6E: 0x006E,
    0x6F: 0x006F,
    0x70: 0x0070,
    0x71: 0x0071,
    0x72: 0x0072,
    0x73: 0x0073,
    0x74: 0x0074,
    0x75: 0x0075,
    0x76: 0x0076,
    0x77: 0x0077,
    0x78: 0x0078,
    0x79: 0x0079,
    0x7A: 0x007A,
    0x7B: 0x007B,
    0x7C: 0x007C,
    0x7D: 0x007D,
    0x7E: 0x203E,
    0x8140: 0x3000,
    0x8141: 0x3001,
    0x8142: 0x3002,
    0x8143: 0xFF0C,
    0x8144: 0xFF0E,
    0x8145: 0x30FB,
    0x8146: 0xFF1A,
    0x8147: 0xFF1B,
    0x8148: 0xFF1F,
    0x8149: 0xFF01,
    0x814A: 0x309B,
    0x814B: 0x309C,
    0x814C: 0x00B4,
    0x814D: 0xFF40,
    0x814E: 0x00A8,
    0x814F: 0xFF3E,
    0x8150: 0xFFE3,
    0x8151: 0xFF3F,
    0x8152: 0x30FD,
    0x8153: 0x30FE,
    0x8154: 0x309D,
    0x8155: 0x309E,
    0x8156: 0x3003,
    0x8157: 0x4EDD,
    0x8158: 0x3005,
    0x8159: 0x3006,
    0x815A: 0x3007,
    0x815B: 0x30FC,
    0x815C: 0x2015,
    0x815D: 0x2010,
    0x815E: 0xFF0F,
    0x815F: 0x005C,
    0x8160: 0x301C,
    0x8161: 0x2016,
    0x8162: 0xFF5C,
    0x8163: 0x2026,
    0x8164: 0x2025,
    0x8165: 0x2018,
    0x8166: 0x2019,
    0x8167: 0x201C,
    0x8168: 0x201D,
    0x8169: 0xFF08,
    0x816A: 0xFF09,
    0x816B: 0x3014,
    0x816C: 0x3015,
    0x816D: 0xFF3B,
    0x816E: 0xFF3D,
    0x816F: 0xFF5B,
    0x8170: 0xFF5D,
    0x8171: 0x3008,
    0x8172: 0x3009,
    0x8173: 0x300A,
    0x8174: 0x300B,
    0x8175: 0x300C,
    0x8176: 0x300D,
    0x8177: 0x300E,
    0x8178: 0x300F,
    0x8179: 0x3010,
    0x817A: 0x3011,
    0x817B: 0xFF0B,
    0x817C: 0x2212,
    0x817D: 0x00B1,
    0x817E: 0x00D7,
    0x8180: 0x00F7,
    0x8181: 0xFF1D,
    0x8182: 0x2260,
    0x8183: 0xFF1C,
    0x8184: 0xFF1E,
    0x8185: 0x2266,
    0x8186: 0x2267,
    0x8187: 0x221E,
    0x8188: 0x2234,
    0x8189: 0x2642,
    0x818A: 0x2640,
    0x818B: 0x00B0,
    0x818C: 0x2032,
    0x818D: 0x2033,
    0x818E: 0x2103,
    0x818F: 0xFFE5,
    0x8190: 0xFF04,
    0x8191: 0x00A2,
    0x8192: 0x00A3,
    0x8193: 0xFF05,
    0x8194: 0xFF03,
    0x8195: 0xFF06,
    0x8196: 0xFF0A,
    0x8197: 0xFF20,
    0x8198: 0x00A7,
    0x8199: 0x2606,
    0x819A: 0x2605,
    0x819B: 0x25CB,
    0x819C: 0x25CF,
    0x819D: 0x25CE,
    0x819E: 0x25C7,
    0x819F: 0x25C6,
    0x81A0: 0x25A1,
    0x81A1: 0x25A0,
    0x81A2: 0x25B3,
    0x81A3: 0x25B2,
    0x81A4: 0x25BD,
    0x81A5: 0x25BC,
    0x81A6: 0x203B,
    0x81A7: 0x3012,
    0x81A8: 0x2192,
    0x81A9: 0x2190,
    0x81AA: 0x2191,
    0x81AB: 0x2193,
    0x81AC: 0x3013,
    0x81B8: 0x2208,
    0x81B9: 0x220B,
    0x81BA: 0x2286,
    0x81BB: 0x2287,
    0x81BC: 0x2282,
    0x81BD: 0x2283,
    0x81BE: 0x222A,
    0x81BF: 0x2229,
    0x81C8: 0x2227,
    0x81C9: 0x2228,
    0x81CA: 0x00AC,
    0x81CB: 0x21D2,
    0x81CC: 0x21D4,
    0x81CD: 0x2200,
    0x81CE: 0x2203,
    0x81DA: 0x2220,
    0x81DB: 0x22A5,
    0x81DC: 0x2312,
    0x81DD: 0x2202,
    0x81DE: 0x2207,
    0x81DF: 0x2261,
    0x81E0: 0x2252,
    0x81E1: 0x226A,
    0x81E2: 0x226B,
    0x81E3: 0x221A,
    0x81E4: 0x223D,
    0x81E5: 0x221D,
    0x81E6: 0x2235,
    0x81E7: 0x222B,
    0x81E8: 0x222C,
    0x81F0: 0x212B,
    0x81F1: 0x2030,
    0x81F2: 0x266F,
    0x81F3: 0x266D,
    0x81F4: 0x266A,
    0x81F5: 0x2020,
    0x81F6: 0x2021,
    0x81F7: 0x00B6,
    0x81FC: 0x25EF,
    0x824F: 0xFF10,
    0x8250: 0xFF11,
    0x8251: 0xFF12,
    0x8252: 0xFF13,
    0x8253: 0xFF14,
    0x8254: 0xFF15,
    0x8255: 0xFF16,
    0x8256: 0xFF17,
    0x8257: 0xFF18,
    0x8258: 0xFF19,
    0x8260: 0xFF21,
    0x8261: 0xFF22,
    0x8262: 0xFF23,
    0x8263: 0xFF24,
    0x8264: 0xFF25,
    0x8265: 0xFF26,
    0x8266: 0xFF27,
    0x8267: 0xFF28,
    0x8268: 0xFF29,
    0x8269: 0xFF2A,
    0x826A: 0xFF2B,
    0x826B: 0xFF2C,
    0x826C: 0xFF2D,
    0x826D: 0xFF2E,
    0x826E: 0xFF2F,
    0x826F: 0xFF30,
    0x8270: 0xFF31,
    0x8271: 0xFF32,
    0x8272: 0xFF33,
    0x8273: 0xFF34,
    0x8274: 0xFF35,
    0x8275: 0xFF36,
    0x8276: 0xFF37,
    0x8277: 0xFF38,
    0x8278: 0xFF39,
    0x8279: 0xFF3A,
    0x8281: 0xFF41,
    0x8282: 0xFF42,
    0x8283: 0xFF43,
    0x8284: 0xFF44,
    0x8285: 0xFF45,
    0x8286: 0xFF46,
    0x8287: 0xFF47,
    0x8288: 0xFF48,
    0x8289: 0xFF49,
    0x828A: 0xFF4A,
    0x828B: 0xFF4B,
    0x828C: 0xFF4C,
    0x828D: 0xFF4D,
    0x828E: 0xFF4E,
    0x828F: 0xFF4F,
    0x8290: 0xFF50,
    0x8291: 0xFF51,
    0x8292: 0xFF52,
    0x8293: 0xFF53,
    0x8294: 0xFF54,
    0x8295: 0xFF55,
    0x8296: 0xFF56,
    0x8297: 0xFF57,
    0x8298: 0xFF58,
    0x8299: 0xFF59,
    0x829A: 0xFF5A,
    0x829F: 0x3041,
    0x82A0: 0x3042,
    0x82A1: 0x3043,
    0x82A2: 0x3044,
    0x82A3: 0x3045,
    0x82A4: 0x3046,
    0x82A5: 0x3047,
    0x82A6: 0x3048,
    0x82A7: 0x3049,
    0x82A8: 0x304A,
    0x82A9: 0x304B,
    0x82AA: 0x304C,
    0x82AB: 0x304D,
    0x82AC: 0x304E,
    0x82AD: 0x304F,
    0x82AE: 0x3050,
    0x82AF: 0x3051,
    0x82B0: 0x3052,
    0x82B1: 0x3053,
    0x82B2: 0x3054,
    0x82B3: 0x3055,
    0x82B4: 0x3056,
    0x82B5: 0x3057,
    0x82B6: 0x3058,
    0x82B7: 0x3059,
    0x82B8: 0x305A,
    0x82B9: 0x305B,
    0x82BA: 0x305C,
    0x82BB: 0x305D,
    0x82BC: 0x305E,
    0x82BD: 0x305F,
    0x82BE: 0x3060,
    0x82BF: 0x3061,
    0x82C0: 0x3062,
    0x82C1: 0x3063,
    0x82C2: 0x3064,
    0x82C3: 0x3065,
    0x82C4: 0x3066,
    0x82C5: 0x3067,
    0x82C6: 0x3068,
    0x82C7: 0x3069,
    0x82C8: 0x306A,
    0x82C9: 0x306B,
    0x82CA: 0x306C,
    0x82CB: 0x306D,
    0x82CC: 0x306E,
    0x82CD: 0x306F,
    0x82CE: 0x3070,
    0x82CF: 0x3071,
    0x82D0: 0x3072,
    0x82D1: 0x3073,
    0x82D2: 0x3074,
    0x82D3: 0x3075,
    0x82D4: 0x3076,
    0x82D5: 0x3077,
    0x82D6: 0x3078,
    0x82D7: 0x3079,
    0x82D8: 0x307A,
    0x82D9: 0x307B,
    0x82DA: 0x307C,
    0x82DB: 0x307D,
    0x82DC: 0x307E,
    0x82DD: 0x307F,
    0x82DE: 0x3080,
    0x82DF: 0x3081,
    0x82E0: 0x3082,
    0x82E1: 0x3083,
    0x82E2: 0x3084,
    0x82E3: 0x3085,
    0x82E4: 0x3086,
    0x82E5: 0x3087,
    0x82E6: 0x3088,
    0x82E7: 0x3089,
    0x82E8: 0x308A,
    0x82E9: 0x308B,
    0x82EA: 0x308C,
    0x82EB: 0x308D,
    0x82EC: 0x308E,
    0x82ED: 0x308F,
    0x82EE: 0x3090,
    0x82EF: 0x3091,
    0x82F0: 0x3092,
    0x82F1: 0x3093,
    0x8340: 0x30A1,
    0x8341: 0x30A2,
    0x8342: 0x30A3,
    0x8343: 0x30A4,
    0x8344: 0x30A5,
    0x8345: 0x30A6,
    0x8346: 0x30A7,
    0x8347: 0x30A8,
    0x8348: 0x30A9,
    0x8349: 0x30AA,
    0x834A: 0x30AB,
    0x834B: 0x30AC,
    0x834C: 0x30AD,
    0x834D: 0x30AE,
    0x834E: 0x30AF,
    0x834F: 0x30B0,
    0x8350: 0x30B1,
    0x8351: 0x30B2,
    0x8352: 0x30B3,
    0x8353: 0x30B4,
    0x8354: 0x30B5,
    0x8355: 0x30B6,
    0x8356: 0x30B7,
    0x8357: 0x30B8,
    0x8358: 0x30B9,
    0x8359: 0x30BA,
    0x835A: 0x30BB,
    0x835B: 0x30BC,
    0x835C: 0x30BD,
    0x835D: 0x30BE,
    0x835E: 0x30BF,
    0x835F: 0x30C0,
    0x8360: 0x30C1,
    0x8361: 0x30C2,
    0x8362: 0x30C3,
    0x8363: 0x30C4,
    0x8364: 0x30C5,
    0x8365: 0x30C6,
    0x8366: 0x30C7,
    0x8367: 0x30C8,
    0x8368: 0x30C9,
    0x8369: 0x30CA,
    0x836A: 0x30CB,
    0x836B: 0x30CC,
    0x836C: 0x30CD,
    0x836D: 0x30CE,
    0x836E: 0x30CF,
    0x836F: 0x30D0,
    0x8370: 0x30D1,
    0x8371: 0x30D2,
    0x8372: 0x30D3,
    0x8373: 0x30D4,
    0x8374: 0x30D5,
    0x8375: 0x30D6,
    0x8376: 0x30D7,
    0x8377: 0x30D8,
    0x8378: 0x30D9,
    0x8379: 0x30DA,
    0x837A: 0x30DB,
    0x837B: 0x30DC,
    0x837C: 0x30DD,
    0x837D: 0x30DE,
    0x837E: 0x30DF,
    0x8380: 0x30E0,
    0x8381: 0x30E1,
    0x8382: 0x30E2,
    0x8383: 0x30E3,
    0x8384: 0x30E4,
    0x8385: 0x30E5,
    0x8386: 0x30E6,
    0x8387: 0x30E7,
    0x8388: 0x30E8,
    0x8389: 0x30E9,
    0x838A: 0x30EA,
    0x838B: 0x30EB,
    0x838C: 0x30EC,
    0x838D: 0x30ED,
    0x838E: 0x30EE,
    0x838F: 0x30EF,
    0x8390: 0x30F0,
    0x8391: 0x30F1,
    0x8392: 0x30F2,
    0x8393: 0x30F3,
    0x8394: 0x30F4,
    0x8395: 0x30F5,
    0x8396: 0x30F6,
    0x839F: 0x0391,
    0x83A0: 0x0392,
    0x83A1: 0x0393,
    0x83A2: 0x0394,
    0x83A3: 0x0395,
    0x83A4: 0x0396,
    0x83A5: 0x0397,
    0x83A6: 0x0398,
    0x83A7: 0x0399,
    0x83A8: 0x039A,
    0x83A9: 0x039B,
    0x83AA: 0x039C,
    0x83AB: 0x039D,
    0x83AC: 0x039E,
    0x83AD: 0x039F,
    0x83AE: 0x03A0,
    0x83AF: 0x03A1,
    0x83B0: 0x03A3,
    0x83B1: 0x03A4,
    0x83B2: 0x03A5,
    0x83B3: 0x03A6,
    0x83B4: 0x03A7,
    0x83B5: 0x03A8,
    0x83B6: 0x03A9,
    0x83BF: 0x03B1,
    0x83C0: 0x03B2,
    0x83C1: 0x03B3,
    0x83C2: 0x03B4,
    0x83C3: 0x03B5,
    0x83C4: 0x03B6,
    0x83C5: 0x03B7,
    0x83C6: 0x03B8,
    0x83C7: 0x03B9,
    0x83C8: 0x03BA,
    0x83C9: 0x03BB,
    0x83CA: 0x03BC,
    0x83CB: 0x03BD,
    0x83CC: 0x03BE,
    0x83CD: 0x03BF,
    0x83CE: 0x03C0,
    0x83CF: 0x03C1,
    0x83D0: 0x03C3,
    0x83D1: 0x03C4,
    0x83D2: 0x03C5,
    0x83D3: 0x03C6,
    0x83D4: 0x03C7,
    0x83D5: 0x03C8,
    0x83D6: 0x03C9,
    0x8440: 0x0410,
    0x8441: 0x0411,
    0x8442: 0x0412,
    0x8443: 0x0413,
    0x8444: 0x0414,
    0x8445: 0x0415,
    0x8446: 0x0401,
    0x8447: 0x0416,
    0x8448: 0x0417,
    0x8449: 0x0418,
    0x844A: 0x0419,
    0x844B: 0x041A,
    0x844C: 0x041B,
    0x844D: 0x041C,
    0x844E: 0x041D,
    0x844F: 0x041E,
    0x8450: 0x041F,
    0x8451: 0x0420,
    0x8452: 0x0421,
    0x8453: 0x0422,
    0x8454: 0x0423,
    0x8455: 0x0424,
    0x8456: 0x0425,
    0x8457: 0x0426,
    0x8458: 0x0427,
    0x8459: 0x0428,
    0x845A: 0x0429,
    0x845B: 0x042A,
    0x845C: 0x042B,
    0x845D: 0x042C,
    0x845E: 0x042D,
    0x845F: 0x042E,
    0x8460: 0x042F,
    0x8470: 0x0430,
    0x8471: 0x0431,
    0x8472: 0x0432,
    0x8473: 0x0433,
    0x8474: 0x0434,
    0x8475: 0x0435,
    0x8476: 0x0451,
    0x8477: 0x0436,
    0x8478: 0x0437,
    0x8479: 0x0438,
    0x847A: 0x0439,
    0x847B: 0x043A,
    0x847C: 0x043B,
    0x847D: 0x043C,
    0x847E: 0x043D,
    0x8480: 0x043E,
    0x8481: 0x043F,
    0x8482: 0x0440,
    0x8483: 0x0441,
    0x8484: 0x0442,
    0x8485: 0x0443,
    0x8486: 0x0444,
    0x8487: 0x0445,
    0x8488: 0x0446,
    0x8489: 0x0447,
    0x848A: 0x0448,
    0x848B: 0x0449,
    0x848C: 0x044A,
    0x848D: 0x044B,
    0x848E: 0x044C,
    0x848F: 0x044D,
    0x8490: 0x044E,
    0x8491: 0x044F,
    0x849F: 0x2500,
    0x84A0: 0x2502,
    0x84A1: 0x250C,
    0x84A2: 0x2510,
    0x84A3: 0x2518,
    0x84A4: 0x2514,
    0x84A5: 0x251C,
    0x84A6: 0x252C,
    0x84A7: 0x2524,
    0x84A8: 0x2534,
    0x84A9: 0x253C,
    0x84AA: 0x2501,
    0x84AB: 0x2503,
    0x84AC: 0x250F,
    0x84AD: 0x2513,
    0x84AE: 0x251B,
    0x84AF: 0x2517,
    0x84B0: 0x2523,
    0x84B1: 0x2533,
    0x84B2: 0x252B,
    0x84B3: 0x253B,
    0x84B4: 0x254B,
    0x84B5: 0x2520,
    0x84B6: 0x252F,
    0x84B7: 0x2528,
    0x84B8: 0x2537,
    0x84B9: 0x253F,
    0x84BA: 0x251D,
    0x84BB: 0x2530,
    0x84BC: 0x2525,
    0x84BD: 0x2538,
    0x84BE: 0x2542,
    0x889F: 0x4E9C,
    0x88A0: 0x5516,
    0x88A1: 0x5A03,
    0x88A2: 0x963F,
    0x88A3: 0x54C0,
    0x88A4: 0x611B,
    0x88A5: 0x6328,
    0x88A6: 0x59F6,
    0x88A7: 0x9022,
    0x88A8: 0x8475,
    0x88A9: 0x831C,
    0x88AA: 0x7A50,
    0x88AB: 0x60AA,
    0x88AC: 0x63E1,
    0x88AD: 0x6E25,
    0x88AE: 0x65ED,
    0x88AF: 0x8466,
    0x88B0: 0x82A6,
    0x88B1: 0x9BF5,
    0x88B2: 0x6893,
    0x88B3: 0x5727,
    0x88B4: 0x65A1,
    0x88B5: 0x6271,
    0x88B6: 0x5B9B,
    0x88B7: 0x59D0,
    0x88B8: 0x867B,
    0x88B9: 0x98F4,
    0x88BA: 0x7D62,
    0x88BB: 0x7DBE,
    0x88BC: 0x9B8E,
    0x88BD: 0x6216,
    0x88BE: 0x7C9F,
    0x88BF: 0x88B7,
    0x88C0: 0x5B89,
    0x88C1: 0x5EB5,
    0x88C2: 0x6309,
    0x88C3: 0x6697,
    0x88C4: 0x6848,
    0x88C5: 0x95C7,
    0x88C6: 0x978D,
    0x88C7: 0x674F,
    0x88C8: 0x4EE5,
    0x88C9: 0x4F0A,
    0x88CA: 0x4F4D,
    0x88CB: 0x4F9D,
    0x88CC: 0x5049,
    0x88CD: 0x56F2,
    0x88CE: 0x5937,
    0x88CF: 0x59D4,
    0x88D0: 0x5A01,
    0x88D1: 0x5C09,
    0x88D2: 0x60DF,
    0x88D3: 0x610F,
    0x88D4: 0x6170,
    0x88D5: 0x6613,
    0x88D6: 0x6905,
    0x88D7: 0x70BA,
    0x88D8: 0x754F,
    0x88D9: 0x7570,
    0x88DA: 0x79FB,
    0x88DB: 0x7DAD,
    0x88DC: 0x7DEF,
    0x88DD: 0x80C3,
    0x88DE: 0x840E,
    0x88DF: 0x8863,
    0x88E0: 0x8B02,
    0x88E1: 0x9055,
    0x88E2: 0x907A,
    0x88E3: 0x533B,
    0x88E4: 0x4E95,
    0x88E5: 0x4EA5,
    0x88E6: 0x57DF,
    0x88E7: 0x80B2,
    0x88E8: 0x90C1,
    0x88E9: 0x78EF,
    0x88EA: 0x4E00,
    0x88EB: 0x58F1,
    0x88EC: 0x6EA2,
    0x88ED: 0x9038,
    0x88EE: 0x7A32,
    0x88EF: 0x8328,
    0x88F0: 0x828B,
    0x88F1: 0x9C2F,
    0x88F2: 0x5141,
    0x88F3: 0x5370,
    0x88F4: 0x54BD,
    0x88F5: 0x54E1,
    0x88F6: 0x56E0,
    0x88F7: 0x59FB,
    0x88F8: 0x5F15,
    0x88F9: 0x98F2,
    0x88FA: 0x6DEB,
    0x88FB: 0x80E4,
    0x88FC: 0x852D,
    0x8940: 0x9662,
    0x8941: 0x9670,
    0x8942: 0x96A0,
    0x8943: 0x97FB,
    0x8944: 0x540B,
    0x8945: 0x53F3,
    0x8946: 0x5B87,
    0x8947: 0x70CF,
    0x8948: 0x7FBD,
    0x8949: 0x8FC2,
    0x894A: 0x96E8,
    0x894B: 0x536F,
    0x894C: 0x9D5C,
    0x894D: 0x7ABA,
    0x894E: 0x4E11,
    0x894F: 0x7893,
    0x8950: 0x81FC,
    0x8951: 0x6E26,
    0x8952: 0x5618,
    0x8953: 0x5504,
    0x8954: 0x6B1D,
    0x8955: 0x851A,
    0x8956: 0x9C3B,
    0x8957: 0x59E5,
    0x8958: 0x53A9,
    0x8959: 0x6D66,
    0x895A: 0x74DC,
    0x895B: 0x958F,
    0x895C: 0x5642,
    0x895D: 0x4E91,
    0x895E: 0x904B,
    0x895F: 0x96F2,
    0x8960: 0x834F,
    0x8961: 0x990C,
    0x8962: 0x53E1,
    0x8963: 0x55B6,
    0x8964: 0x5B30,
    0x8965: 0x5F71,
    0x8966: 0x6620,
    0x8967: 0x66F3,
    0x8968: 0x6804,
    0x8969: 0x6C38,
    0x896A: 0x6CF3,
    0x896B: 0x6D29,
    0x896C: 0x745B,
    0x896D: 0x76C8,
    0x896E: 0x7A4E,
    0x896F: 0x9834,
    0x8970: 0x82F1,
    0x8971: 0x885B,
    0x8972: 0x8A60,
    0x8973: 0x92ED,
    0x8974: 0x6DB2,
    0x8975: 0x75AB,
    0x8976: 0x76CA,
    0x8977: 0x99C5,
    0x8978: 0x60A6,
    0x8979: 0x8B01,
    0x897A: 0x8D8A,
    0x897B: 0x95B2,
    0x897C: 0x698E,
    0x897D: 0x53AD,
    0x897E: 0x5186,
    0x8980: 0x5712,
    0x8981: 0x5830,
    0x8982: 0x5944,
    0x8983: 0x5BB4,
    0x8984: 0x5EF6,
    0x8985: 0x6028,
    0x8986: 0x63A9,
    0x8987: 0x63F4,
    0x8988: 0x6CBF,
    0x8989: 0x6F14,
    0x898A: 0x708E,
    0x898B: 0x7114,
    0x898C: 0x7159,
    0x898D: 0x71D5,
    0x898E: 0x733F,
    0x898F: 0x7E01,
    0x8990: 0x8276,
    0x8991: 0x82D1,
    0x8992: 0x8597,
    0x8993: 0x9060,
    0x8994: 0x925B,
    0x8995: 0x9D1B,
    0x8996: 0x5869,
    0x8997: 0x65BC,
    0x8998: 0x6C5A,
    0x8999: 0x7525,
    0x899A: 0x51F9,
    0x899B: 0x592E,
    0x899C: 0x5965,
    0x899D: 0x5F80,
    0x899E: 0x5FDC,
    0x899F: 0x62BC,
    0x89A0: 0x65FA,
    0x89A1: 0x6A2A,
    0x89A2: 0x6B27,
    0x89A3: 0x6BB4,
    0x89A4: 0x738B,
    0x89A5: 0x7FC1,
    0x89A6: 0x8956,
    0x89A7: 0x9D2C,
    0x89A8: 0x9D0E,
    0x89A9: 0x9EC4,
    0x89AA: 0x5CA1,
    0x89AB: 0x6C96,
    0x89AC: 0x837B,
    0x89AD: 0x5104,
    0x89AE: 0x5C4B,
    0x89AF: 0x61B6,
    0x89B0: 0x81C6,
    0x89B1: 0x6876,
    0x89B2: 0x7261,
    0x89B3: 0x4E59,
    0x89B4: 0x4FFA,
    0x89B5: 0x5378,
    0x89B6: 0x6069,
    0x89B7: 0x6E29,
    0x89B8: 0x7A4F,
    0x89B9: 0x97F3,
    0x89BA: 0x4E0B,
    0x89BB: 0x5316,
    0x89BC: 0x4EEE,
    0x89BD: 0x4F55,
    0x89BE: 0x4F3D,
    0x89BF: 0x4FA1,
    0x89C0: 0x4F73,
    0x89C1: 0x52A0,
    0x89C2: 0x53EF,
    0x89C3: 0x5609,
    0x89C4: 0x590F,
    0x89C5: 0x5AC1,
    0x89C6: 0x5BB6,
    0x89C7: 0x5BE1,
    0x89C8: 0x79D1,
    0x89C9: 0x6687,
    0x89CA: 0x679C,
    0x89CB: 0x67B6,
    0x89CC: 0x6B4C,
    0x89CD: 0x6CB3,
    0x89CE: 0x706B,
    0x89CF: 0x73C2,
    0x89D0: 0x798D,
    0x89D1: 0x79BE,
    0x89D2: 0x7A3C,
    0x89D3: 0x7B87,
    0x89D4: 0x82B1,
    0x89D5: 0x82DB,
    0x89D6: 0x8304,
    0x89D7: 0x8377,
    0x89D8: 0x83EF,
    0x89D9: 0x83D3,
    0x89DA: 0x8766,
    0x89DB: 0x8AB2,
    0x89DC: 0x5629,
    0x89DD: 0x8CA8,
    0x89DE: 0x8FE6,
    0x89DF: 0x904E,
    0x89E0: 0x971E,
    0x89E1: 0x868A,
    0x89E2: 0x4FC4,
    0x89E3: 0x5CE8,
    0x89E4: 0x6211,
    0x89E5: 0x7259,
    0x89E6: 0x753B,
    0x89E7: 0x81E5,
    0x89E8: 0x82BD,
    0x89E9: 0x86FE,
    0x89EA: 0x8CC0,
    0x89EB: 0x96C5,
    0x89EC: 0x9913,
    0x89ED: 0x99D5,
    0x89EE: 0x4ECB,
    0x89EF: 0x4F1A,
    0x89F0: 0x89E3,
    0x89F1: 0x56DE,
    0x89F2: 0x584A,
    0x89F3: 0x58CA,
    0x89F4: 0x5EFB,
    0x89F5: 0x5FEB,
    0x89F6: 0x602A,
    0x89F7: 0x6094,
    0x89F8: 0x6062,
    0x89F9: 0x61D0,
    0x89FA: 0x6212,
    0x89FB: 0x62D0,
    0x89FC: 0x6539,
    0x9040: 0x9B41,
    0x9041: 0x6666,
    0x9042: 0x68B0,
    0x9043: 0x6D77,
    0x9044: 0x7070,
    0x9045: 0x754C,
    0x9046: 0x7686,
    0x9047: 0x7D75,
    0x9048: 0x82A5,
    0x9049: 0x87F9,
    0x904A: 0x958B,
    0x904B: 0x968E,
    0x904C: 0x8C9D,
    0x904D: 0x51F1,
    0x904E: 0x52BE,
    0x904F: 0x5916,
    0x9050: 0x54B3,
    0x9051: 0x5BB3,
    0x9052: 0x5D16,
    0x9053: 0x6168,
    0x9054: 0x6982,
    0x9055: 0x6DAF,
    0x9056: 0x788D,
    0x9057: 0x84CB,
    0x9058: 0x8857,
    0x9059: 0x8A72,
    0x905A: 0x93A7,
    0x905B: 0x9AB8,
    0x905C: 0x6D6C,
    0x905D: 0x99A8,
    0x905E: 0x86D9,
    0x905F: 0x57A3,
    0x9060: 0x67FF,
    0x9061: 0x86CE,
    0x9062: 0x920E,
    0x9063: 0x5283,
    0x9064: 0x5687,
    0x9065: 0x5404,
    0x9066: 0x5ED3,
    0x9067: 0x62E1,
    0x9068: 0x64B9,
    0x9069: 0x683C,
    0x906A: 0x6838,
    0x906B: 0x6BBB,
    0x906C: 0x7372,
    0x906D: 0x78BA,
    0x906E: 0x7A6B,
    0x906F: 0x899A,
    0x9070: 0x89D2,
    0x9071: 0x8D6B,
    0x9072: 0x8F03,
    0x9073: 0x90ED,
    0x9074: 0x95A3,
    0x9075: 0x9694,
    0x9076: 0x9769,
    0x9077: 0x5B66,
    0x9078: 0x5CB3,
    0x9079: 0x697D,
    0x907A: 0x984D,
    0x907B: 0x984E,
    0x907C: 0x639B,
    0x907D: 0x7B20,
    0x907E: 0x6A2B,
    0x9080: 0x6A7F,
    0x9081: 0x68B6,
    0x9082: 0x9C0D,
    0x9083: 0x6F5F,
    0x9084: 0x5272,
    0x9085: 0x559D,
    0x9086: 0x6070,
    0x9087: 0x62EC,
    0x9088: 0x6D3B,
    0x9089: 0x6E07,
    0x908A: 0x6ED1,
    0x908B: 0x845B,
    0x908C: 0x8910,
    0x908D: 0x8F44,
    0x908E: 0x4E14,
    0x908F: 0x9C39,
    0x9090: 0x53F6,
    0x9091: 0x691B,
    0x9092: 0x6A3A,
    0x9093: 0x9784,
    0x9094: 0x682A,
    0x9095: 0x515C,
    0x9096: 0x7AC3,
    0x9097: 0x84B2,
    0x9098: 0x91DC,
    0x9099: 0x938C,
    0x909A: 0x565B,
    0x909B: 0x9D28,
    0x909C: 0x6822,
    0x909D: 0x8305,
    0x909E: 0x8431,
    0x909F: 0x7CA5,
    0x90A0: 0x5208,
    0x90A1: 0x82C5,
    0x90A2: 0x74E6,
    0x90A3: 0x4E7E,
    0x90A4: 0x4F83,
    0x90A5: 0x51A0,
    0x90A6: 0x5BD2,
    0x90A7: 0x520A,
    0x90A8: 0x52D8,
    0x90A9: 0x52E7,
    0x90AA: 0x5DFB,
    0x90AB: 0x559A,
    0x90AC: 0x582A,
    0x90AD: 0x59E6,
    0x90AE: 0x5B8C,
    0x90AF: 0x5B98,
    0x90B0: 0x5BDB,
    0x90B1: 0x5E72,
    0x90B2: 0x5E79,
    0x90B3: 0x60A3,
    0x90B4: 0x611F,
    0x90B5: 0x6163,
    0x90B6: 0x61BE,
    0x90B7: 0x63DB,
    0x90B8: 0x6562,
    0x90B9: 0x67D1,
    0x90BA: 0x6853,
    0x90BB: 0x68FA,
    0x90BC: 0x6B3E,
    0x90BD: 0x6B53,
    0x90BE: 0x6C57,
    0x90BF: 0x6F22,
    0x90C0: 0x6F97,
    0x90C1: 0x6F45,
    0x90C2: 0x74B0,
    0x90C3: 0x7518,
    0x90C4: 0x76E3,
    0x90C5: 0x770B,
    0x90C6: 0x7AFF,
    0x90C7: 0x7BA1,
    0x90C8: 0x7C21,
    0x90C9: 0x7DE9,
    0x90CA: 0x7F36,
    0x90CB: 0x7FF0,
    0x90CC: 0x809D,
    0x90CD: 0x8266,
    0x90CE: 0x839E,
    0x90CF: 0x89B3,
    0x90D0: 0x8ACC,
    0x90D1: 0x8CAB,
    0x90D2: 0x9084,
    0x90D3: 0x9451,
    0x90D4: 0x9593,
    0x90D5: 0x9591,
    0x90D6: 0x95A2,
    0x90D7: 0x9665,
    0x90D8: 0x97D3,
    0x90D9: 0x9928,
    0x90DA: 0x8218,
    0x90DB: 0x4E38,
    0x90DC: 0x542B,
    0x90DD: 0x5CB8,
    0x90DE: 0x5DCC,
    0x90DF: 0x73A9,
    0x90E0: 0x764C,
    0x90E1: 0x773C,
    0x90E2: 0x5CA9,
    0x90E3: 0x7FEB,
    0x90E4: 0x8D0B,
    0x90E5: 0x96C1,
    0x90E6: 0x9811,
    0x90E7: 0x9854,
    0x90E8: 0x9858,
    0x90E9: 0x4F01,
    0x90EA: 0x4F0E,
    0x90EB: 0x5371,
    0x90EC: 0x559C,
    0x90ED: 0x5668,
    0x90EE: 0x57FA,
    0x90EF: 0x5947,
    0x90F0: 0x5B09,
    0x90F1: 0x5BC4,
    0x90F2: 0x5C90,
    0x90F3: 0x5E0C,
    0x90F4: 0x5E7E,
    0x90F5: 0x5FCC,
    0x90F6: 0x63EE,
    0x90F7: 0x673A,
    0x90F8: 0x65D7,
    0x90F9: 0x65E2,
    0x90FA: 0x671F,
    0x90FB: 0x68CB,
    0x90FC: 0x68C4,
    0x9140: 0x6A5F,
    0x9141: 0x5E30,
    0x9142: 0x6BC5,
    0x9143: 0x6C17,
    0x9144: 0x6C7D,
    0x9145: 0x757F,
    0x9146: 0x7948,
    0x9147: 0x5B63,
    0x9148: 0x7A00,
    0x9149: 0x7D00,
    0x914A: 0x5FBD,
    0x914B: 0x898F,
    0x914C: 0x8A18,
    0x914D: 0x8CB4,
    0x914E: 0x8D77,
    0x914F: 0x8ECC,
    0x9150: 0x8F1D,
    0x9151: 0x98E2,
    0x9152: 0x9A0E,
    0x9153: 0x9B3C,
    0x9154: 0x4E80,
    0x9155: 0x507D,
    0x9156: 0x5100,
    0x9157: 0x5993,
    0x9158: 0x5B9C,
    0x9159: 0x622F,
    0x915A: 0x6280,
    0x915B: 0x64EC,
    0x915C: 0x6B3A,
    0x915D: 0x72A0,
    0x915E: 0x7591,
    0x915F: 0x7947,
    0x9160: 0x7FA9,
    0x9161: 0x87FB,
    0x9162: 0x8ABC,
    0x9163: 0x8B70,
    0x9164: 0x63AC,
    0x9165: 0x83CA,
    0x9166: 0x97A0,
    0x9167: 0x5409,
    0x9168: 0x5403,
    0x9169: 0x55AB,
    0x916A: 0x6854,
    0x916B: 0x6A58,
    0x916C: 0x8A70,
    0x916D: 0x7827,
    0x916E: 0x6775,
    0x916F: 0x9ECD,
    0x9170: 0x5374,
    0x9171: 0x5BA2,
    0x9172: 0x811A,
    0x9173: 0x8650,
    0x9174: 0x9006,
    0x9175: 0x4E18,
    0x9176: 0x4E45,
    0x9177: 0x4EC7,
    0x9178: 0x4F11,
    0x9179: 0x53CA,
    0x917A: 0x5438,
    0x917B: 0x5BAE,
    0x917C: 0x5F13,
    0x917D: 0x6025,
    0x917E: 0x6551,
    0x9180: 0x673D,
    0x9181: 0x6C42,
    0x9182: 0x6C72,
    0x9183: 0x6CE3,
    0x9184: 0x7078,
    0x9185: 0x7403,
    0x9186: 0x7A76,
    0x9187: 0x7AAE,
    0x9188: 0x7B08,
    0x9189: 0x7D1A,
    0x918A: 0x7CFE,
    0x918B: 0x7D66,
    0x918C: 0x65E7,
    0x918D: 0x725B,
    0x918E: 0x53BB,
    0x918F: 0x5C45,
    0x9190: 0x5DE8,
    0x9191: 0x62D2,
    0x9192: 0x62E0,
    0x9193: 0x6319,
    0x9194: 0x6E20,
    0x9195: 0x865A,
    0x9196: 0x8A31,
    0x9197: 0x8DDD,
    0x9198: 0x92F8,
    0x9199: 0x6F01,
    0x919A: 0x79A6,
    0x919B: 0x9B5A,
    0x919C: 0x4EA8,
    0x919D: 0x4EAB,
    0x919E: 0x4EAC,
    0x919F: 0x4F9B,
    0x91A0: 0x4FA0,
    0x91A1: 0x50D1,
    0x91A2: 0x5147,
    0x91A3: 0x7AF6,
    0x91A4: 0x5171,
    0x91A5: 0x51F6,
    0x91A6: 0x5354,
    0x91A7: 0x5321,
    0x91A8: 0x537F,
    0x91A9: 0x53EB,
    0x91AA: 0x55AC,
    0x91AB: 0x5883,
    0x91AC: 0x5CE1,
    0x91AD: 0x5F37,
    0x91AE: 0x5F4A,
    0x91AF: 0x602F,
    0x91B0: 0x6050,
    0x91B1: 0x606D,
    0x91B2: 0x631F,
    0x91B3: 0x6559,
    0x91B4: 0x6A4B,
    0x91B5: 0x6CC1,
    0x91B6: 0x72C2,
    0x91B7: 0x72ED,
    0x91B8: 0x77EF,
    0x91B9: 0x80F8,
    0x91BA: 0x8105,
    0x91BB: 0x8208,
    0x91BC: 0x854E,
    0x91BD: 0x90F7,
    0x91BE: 0x93E1,
    0x91BF: 0x97FF,
    0x91C0: 0x9957,
    0x91C1: 0x9A5A,
    0x91C2: 0x4EF0,
    0x91C3: 0x51DD,
    0x91C4: 0x5C2D,
    0x91C5: 0x6681,
    0x91C6: 0x696D,
    0x91C7: 0x5C40,
    0x91C8: 0x66F2,
    0x91C9: 0x6975,
    0x91CA: 0x7389,
    0x91CB: 0x6850,
    0x91CC: 0x7C81,
    0x91CD: 0x50C5,
    0x91CE: 0x52E4,
    0x91CF: 0x5747,
    0x91D0: 0x5DFE,
    0x91D1: 0x9326,
    0x91D2: 0x65A4,
    0x91D3: 0x6B23,
    0x91D4: 0x6B3D,
    0x91D5: 0x7434,
    0x91D6: 0x7981,
    0x91D7: 0x79BD,
    0x91D8: 0x7B4B,
    0x91D9: 0x7DCA,
    0x91DA: 0x82B9,
    0x91DB: 0x83CC,
    0x91DC: 0x887F,
    0x91DD: 0x895F,
    0x91DE: 0x8B39,
    0x91DF: 0x8FD1,
    0x91E0: 0x91D1,
    0x91E1: 0x541F,
    0x91E2: 0x9280,
    0x91E3: 0x4E5D,
    0x91E4: 0x5036,
    0x91E5: 0x53E5,
    0x91E6: 0x533A,
    0x91E7: 0x72D7,
    0x91E8: 0x7396,
    0x91E9: 0x77E9,
    0x91EA: 0x82E6,
    0x91EB: 0x8EAF,
    0x91EC: 0x99C6,
    0x91ED: 0x99C8,
    0x91EE: 0x99D2,
    0x91EF: 0x5177,
    0x91F0: 0x611A,
    0x91F1: 0x865E,
    0x91F2: 0x55B0,
    0x91F3: 0x7A7A,
    0x91F4: 0x5076,
    0x91F5: 0x5BD3,
    0x91F6: 0x9047,
    0x91F7: 0x9685,
    0x91F8: 0x4E32,
    0x91F9: 0x6ADB,
    0x91FA: 0x91E7,
    0x91FB: 0x5C51,
    0x91FC: 0x5C48,
    0x9240: 0x6398,
    0x9241: 0x7A9F,
    0x9242: 0x6C93,
    0x9243: 0x9774,
    0x9244: 0x8F61,
    0x9245: 0x7AAA,
    0x9246: 0x718A,
    0x9247: 0x9688,
    0x9248: 0x7C82,
    0x9249: 0x6817,
    0x924A: 0x7E70,
    0x924B: 0x6851,
    0x924C: 0x936C,
    0x924D: 0x52F2,
    0x924E: 0x541B,
    0x924F: 0x85AB,
    0x9250: 0x8A13,
    0x9251: 0x7FA4,
    0x9252: 0x8ECD,
    0x9253: 0x90E1,
    0x9254: 0x5366,
    0x9255: 0x8888,
    0x9256: 0x7941,
    0x9257: 0x4FC2,
    0x9258: 0x50BE,
    0x9259: 0x5211,
    0x925A: 0x5144,
    0x925B: 0x5553,
    0x925C: 0x572D,
    0x925D: 0x73EA,
    0x925E: 0x578B,
    0x925F: 0x5951,
    0x9260: 0x5F62,
    0x9261: 0x5F84,
    0x9262: 0x6075,
    0x9263: 0x6176,
    0x9264: 0x6167,
    0x9265: 0x61A9,
    0x9266: 0x63B2,
    0x9267: 0x643A,
    0x9268: 0x656C,
    0x9269: 0x666F,
    0x926A: 0x6842,
    0x926B: 0x6E13,
    0x926C: 0x7566,
    0x926D: 0x7A3D,
    0x926E: 0x7CFB,
    0x926F: 0x7D4C,
    0x9270: 0x7D99,
    0x9271: 0x7E4B,
    0x9272: 0x7F6B,
    0x9273: 0x830E,
    0x9274: 0x834A,
    0x9275: 0x86CD,
    0x9276: 0x8A08,
    0x9277: 0x8A63,
    0x9278: 0x8B66,
    0x9279: 0x8EFD,
    0x927A: 0x981A,
    0x927B: 0x9D8F,
    0x927C: 0x82B8,
    0x927D: 0x8FCE,
    0x927E: 0x9BE8,
    0x9280: 0x5287,
    0x9281: 0x621F,
    0x9282: 0x6483,
    0x9283: 0x6FC0,
    0x9284: 0x9699,
    0x9285: 0x6841,
    0x9286: 0x5091,
    0x9287: 0x6B20,
    0x9288: 0x6C7A,
    0x9289: 0x6F54,
    0x928A: 0x7A74,
    0x928B: 0x7D50,
    0x928C: 0x8840,
    0x928D: 0x8A23,
    0x928E: 0x6708,
    0x928F: 0x4EF6,
    0x9290: 0x5039,
    0x9291: 0x5026,
    0x9292: 0x5065,
    0x9293: 0x517C,
    0x9294: 0x5238,
    0x9295: 0x5263,
    0x9296: 0x55A7,
    0x9297: 0x570F,
    0x9298: 0x5805,
    0x9299: 0x5ACC,
    0x929A: 0x5EFA,
    0x929B: 0x61B2,
    0x929C: 0x61F8,
    0x929D: 0x62F3,
    0x929E: 0x6372,
    0x929F: 0x691C,
    0x92A0: 0x6A29,
    0x92A1: 0x727D,
    0x92A2: 0x72AC,
    0x92A3: 0x732E,
    0x92A4: 0x7814,
    0x92A5: 0x786F,
    0x92A6: 0x7D79,
    0x92A7: 0x770C,
    0x92A8: 0x80A9,
    0x92A9: 0x898B,
    0x92AA: 0x8B19,
    0x92AB: 0x8CE2,
    0x92AC: 0x8ED2,
    0x92AD: 0x9063,
    0x92AE: 0x9375,
    0x92AF: 0x967A,
    0x92B0: 0x9855,
    0x92B1: 0x9A13,
    0x92B2: 0x9E78,
    0x92B3: 0x5143,
    0x92B4: 0x539F,
    0x92B5: 0x53B3,
    0x92B6: 0x5E7B,
    0x92B7: 0x5F26,
    0x92B8: 0x6E1B,
    0x92B9: 0x6E90,
    0x92BA: 0x7384,
    0x92BB: 0x73FE,
    0x92BC: 0x7D43,
    0x92BD: 0x8237,
    0x92BE: 0x8A00,
    0x92BF: 0x8AFA,
    0x92C0: 0x9650,
    0x92C1: 0x4E4E,
    0x92C2: 0x500B,
    0x92C3: 0x53E4,
    0x92C4: 0x547C,
    0x92C5: 0x56FA,
    0x92C6: 0x59D1,
    0x92C7: 0x5B64,
    0x92C8: 0x5DF1,
    0x92C9: 0x5EAB,
    0x92CA: 0x5F27,
    0x92CB: 0x6238,
    0x92CC: 0x6545,
    0x92CD: 0x67AF,
    0x92CE: 0x6E56,
    0x92CF: 0x72D0,
    0x92D0: 0x7CCA,
    0x92D1: 0x88B4,
    0x92D2: 0x80A1,
    0x92D3: 0x80E1,
    0x92D4: 0x83F0,
    0x92D5: 0x864E,
    0x92D6: 0x8A87,
    0x92D7: 0x8DE8,
    0x92D8: 0x9237,
    0x92D9: 0x96C7,
    0x92DA: 0x9867,
    0x92DB: 0x9F13,
    0x92DC: 0x4E94,
    0x92DD: 0x4E92,
    0x92DE: 0x4F0D,
    0x92DF: 0x5348,
    0x92E0: 0x5449,
    0x92E1: 0x543E,
    0x92E2: 0x5A2F,
    0x92E3: 0x5F8C,
    0x92E4: 0x5FA1,
    0x92E5: 0x609F,
    0x92E6: 0x68A7,
    0x92E7: 0x6A8E,
    0x92E8: 0x745A,
    0x92E9: 0x7881,
    0x92EA: 0x8A9E,
    0x92EB: 0x8AA4,
    0x92EC: 0x8B77,
    0x92ED: 0x9190,
    0x92EE: 0x4E5E,
    0x92EF: 0x9BC9,
    0x92F0: 0x4EA4,
    0x92F1: 0x4F7C,
    0x92F2: 0x4FAF,
    0x92F3: 0x5019,
    0x92F4: 0x5016,
    0x92F5: 0x5149,
    0x92F6: 0x516C,
    0x92F7: 0x529F,
    0x92F8: 0x52B9,
    0x92F9: 0x52FE,
    0x92FA: 0x539A,
    0x92FB: 0x53E3,
    0x92FC: 0x5411,
    0x9340: 0x540E,
    0x9341: 0x5589,
    0x9342: 0x5751,
    0x9343: 0x57A2,
    0x9344: 0x597D,
    0x9345: 0x5B54,
    0x9346: 0x5B5D,
    0x9347: 0x5B8F,
    0x9348: 0x5DE5,
    0x9349: 0x5DE7,
    0x934A: 0x5DF7,
    0x934B: 0x5E78,
    0x934C: 0x5E83,
    0x934D: 0x5E9A,
    0x934E: 0x5EB7,
    0x934F: 0x5F18,
    0x9350: 0x6052,
    0x9351: 0x614C,
    0x9352: 0x6297,
    0x9353: 0x62D8,
    0x9354: 0x63A7,
    0x9355: 0x653B,
    0x9356: 0x6602,
    0x9357: 0x6643,
    0x9358: 0x66F4,
    0x9359: 0x676D,
    0x935A: 0x6821,
    0x935B: 0x6897,
    0x935C: 0x69CB,
    0x935D: 0x6C5F,
    0x935E: 0x6D2A,
    0x935F: 0x6D69,
    0x9360: 0x6E2F,
    0x9361: 0x6E9D,
    0x9362: 0x7532,
    0x9363: 0x7687,
    0x9364: 0x786C,
    0x9365: 0x7A3F,
    0x9366: 0x7CE0,
    0x9367: 0x7D05,
    0x9368: 0x7D18,
    0x9369: 0x7D5E,
    0x936A: 0x7DB1,
    0x936B: 0x8015,
    0x936C: 0x8003,
    0x936D: 0x80AF,
    0x936E: 0x80B1,
    0x936F: 0x8154,
    0x9370: 0x818F,
    0x9371: 0x822A,
    0x9372: 0x8352,
    0x9373: 0x884C,
    0x9374: 0x8861,
    0x9375: 0x8B1B,
    0x9376: 0x8CA2,
    0x9377: 0x8CFC,
    0x9378: 0x90CA,
    0x9379: 0x9175,
    0x937A: 0x9271,
    0x937B: 0x783F,
    0x937C: 0x92FC,
    0x937D: 0x95A4,
    0x937E: 0x964D,
    0x9380: 0x9805,
    0x9381: 0x9999,
    0x9382: 0x9AD8,
    0x9383: 0x9D3B,
    0x9384: 0x525B,
    0x9385: 0x52AB,
    0x9386: 0x53F7,
    0x9387: 0x5408,
    0x9388: 0x58D5,
    0x9389: 0x62F7,
    0x938A: 0x6FE0,
    0x938B: 0x8C6A,
    0x938C: 0x8F5F,
    0x938D: 0x9EB9,
    0x938E: 0x514B,
    0x938F: 0x523B,
    0x9390: 0x544A,
    0x9391: 0x56FD,
    0x9392: 0x7A40,
    0x9393: 0x9177,
    0x9394: 0x9D60,
    0x9395: 0x9ED2,
    0x9396: 0x7344,
    0x9397: 0x6F09,
    0x9398: 0x8170,
    0x9399: 0x7511,
    0x939A: 0x5FFD,
    0x939B: 0x60DA,
    0x939C: 0x9AA8,
    0x939D: 0x72DB,
    0x939E: 0x8FBC,
    0x939F: 0x6B64,
    0x93A0: 0x9803,
    0x93A1: 0x4ECA,
    0x93A2: 0x56F0,
    0x93A3: 0x5764,
    0x93A4: 0x58BE,
    0x93A5: 0x5A5A,
    0x93A6: 0x6068,
    0x93A7: 0x61C7,
    0x93A8: 0x660F,
    0x93A9: 0x6606,
    0x93AA: 0x6839,
    0x93AB: 0x68B1,
    0x93AC: 0x6DF7,
    0x93AD: 0x75D5,
    0x93AE: 0x7D3A,
    0x93AF: 0x826E,
    0x93B0: 0x9B42,
    0x93B1: 0x4E9B,
    0x93B2: 0x4F50,
    0x93B3: 0x53C9,
    0x93B4: 0x5506,
    0x93B5: 0x5D6F,
    0x93B6: 0x5DE6,
    0x93B7: 0x5DEE,
    0x93B8: 0x67FB,
    0x93B9: 0x6C99,
    0x93BA: 0x7473,
    0x93BB: 0x7802,
    0x93BC: 0x8A50,
    0x93BD: 0x9396,
    0x93BE: 0x88DF,
    0x93BF: 0x5750,
    0x93C0: 0x5EA7,
    0x93C1: 0x632B,
    0x93C2: 0x50B5,
    0x93C3: 0x50AC,
    0x93C4: 0x518D,
    0x93C5: 0x6700,
    0x93C6: 0x54C9,
    0x93C7: 0x585E,
    0x93C8: 0x59BB,
    0x93C9: 0x5BB0,
    0x93CA: 0x5F69,
    0x93CB: 0x624D,
    0x93CC: 0x63A1,
    0x93CD: 0x683D,
    0x93CE: 0x6B73,
    0x93CF: 0x6E08,
    0x93D0: 0x707D,
    0x93D1: 0x91C7,
    0x93D2: 0x7280,
    0x93D3: 0x7815,
    0x93D4: 0x7826,
    0x93D5: 0x796D,
    0x93D6: 0x658E,
    0x93D7: 0x7D30,
    0x93D8: 0x83DC,
    0x93D9: 0x88C1,
    0x93DA: 0x8F09,
    0x93DB: 0x969B,
    0x93DC: 0x5264,
    0x93DD: 0x5728,
    0x93DE: 0x6750,
    0x93DF: 0x7F6A,
    0x93E0: 0x8CA1,
    0x93E1: 0x51B4,
    0x93E2: 0x5742,
    0x93E3: 0x962A,
    0x93E4: 0x583A,
    0x93E5: 0x698A,
    0x93E6: 0x80B4,
    0x93E7: 0x54B2,
    0x93E8: 0x5D0E,
    0x93E9: 0x57FC,
    0x93EA: 0x7895,
    0x93EB: 0x9DFA,
    0x93EC: 0x4F5C,
    0x93ED: 0x524A,
    0x93EE: 0x548B,
    0x93EF: 0x643E,
    0x93F0: 0x6628,
    0x93F1: 0x6714,
    0x93F2: 0x67F5,
    0x93F3: 0x7A84,
    0x93F4: 0x7B56,
    0x93F5: 0x7D22,
    0x93F6: 0x932F,
    0x93F7: 0x685C,
    0x93F8: 0x9BAD,
    0x93F9: 0x7B39,
    0x93FA: 0x5319,
    0x93FB: 0x518A,
    0x93FC: 0x5237,
    0x9440: 0x5BDF,
    0x9441: 0x62F6,
    0x9442: 0x64AE,
    0x9443: 0x64E6,
    0x9444: 0x672D,
    0x9445: 0x6BBA,
    0x9446: 0x85A9,
    0x9447: 0x96D1,
    0x9448: 0x7690,
    0x9449: 0x9BD6,
    0x944A: 0x634C,
    0x944B: 0x9306,
    0x944C: 0x9BAB,
    0x944D: 0x76BF,
    0x944E: 0x6652,
    0x944F: 0x4E09,
    0x9450: 0x5098,
    0x9451: 0x53C2,
    0x9452: 0x5C71,
    0x9453: 0x60E8,
    0x9454: 0x6492,
    0x9455: 0x6563,
    0x9456: 0x685F,
    0x9457: 0x71E6,
    0x9458: 0x73CA,
    0x9459: 0x7523,
    0x945A: 0x7B97,
    0x945B: 0x7E82,
    0x945C: 0x8695,
    0x945D: 0x8B83,
    0x945E: 0x8CDB,
    0x945F: 0x9178,
    0x9460: 0x9910,
    0x9461: 0x65AC,
    0x9462: 0x66AB,
    0x9463: 0x6B8B,
    0x9464: 0x4ED5,
    0x9465: 0x4ED4,
    0x9466: 0x4F3A,
    0x9467: 0x4F7F,
    0x9468: 0x523A,
    0x9469: 0x53F8,
    0x946A: 0x53F2,
    0x946B: 0x55E3,
    0x946C: 0x56DB,
    0x946D: 0x58EB,
    0x946E: 0x59CB,
    0x946F: 0x59C9,
    0x9470: 0x59FF,
    0x9471: 0x5B50,
    0x9472: 0x5C4D,
    0x9473: 0x5E02,
    0x9474: 0x5E2B,
    0x9475: 0x5FD7,
    0x9476: 0x601D,
    0x9477: 0x6307,
    0x9478: 0x652F,
    0x9479: 0x5B5C,
    0x947A: 0x65AF,
    0x947B: 0x65BD,
    0x947C: 0x65E8,
    0x947D: 0x679D,
    0x947E: 0x6B62,
    0x9480: 0x6B7B,
    0x9481: 0x6C0F,
    0x9482: 0x7345,
    0x9483: 0x7949,
    0x9484: 0x79C1,
    0x9485: 0x7CF8,
    0x9486: 0x7D19,
    0x9487: 0x7D2B,
    0x9488: 0x80A2,
    0x9489: 0x8102,
    0x948A: 0x81F3,
    0x948B: 0x8996,
    0x948C: 0x8A5E,
    0x948D: 0x8A69,
    0x948E: 0x8A66,
    0x948F: 0x8A8C,
    0x9490: 0x8AEE,
    0x9491: 0x8CC7,
    0x9492: 0x8CDC,
    0x9493: 0x96CC,
    0x9494: 0x98FC,
    0x9495: 0x6B6F,
    0x9496: 0x4E8B,
    0x9497: 0x4F3C,
    0x9498: 0x4F8D,
    0x9499: 0x5150,
    0x949A: 0x5B57,
    0x949B: 0x5BFA,
    0x949C: 0x6148,
    0x949D: 0x6301,
    0x949E: 0x6642,
    0x949F: 0x6B21,
    0x94A0: 0x6ECB,
    0x94A1: 0x6CBB,
    0x94A2: 0x723E,
    0x94A3: 0x74BD,
    0x94A4: 0x75D4,
    0x94A5: 0x78C1,
    0x94A6: 0x793A,
    0x94A7: 0x800C,
    0x94A8: 0x8033,
    0x94A9: 0x81EA,
    0x94AA: 0x8494,
    0x94AB: 0x8F9E,
    0x94AC: 0x6C50,
    0x94AD: 0x9E7F,
    0x94AE: 0x5F0F,
    0x94AF: 0x8B58,
    0x94B0: 0x9D2B,
    0x94B1: 0x7AFA,
    0x94B2: 0x8EF8,
    0x94B3: 0x5B8D,
    0x94B4: 0x96EB,
    0x94B5: 0x4E03,
    0x94B6: 0x53F1,
    0x94B7: 0x57F7,
    0x94B8: 0x5931,
    0x94B9: 0x5AC9,
    0x94BA: 0x5BA4,
    0x94BB: 0x6089,
    0x94BC: 0x6E7F,
    0x94BD: 0x6F06,
    0x94BE: 0x75BE,
    0x94BF: 0x8CEA,
    0x94C0: 0x5B9F,
    0x94C1: 0x8500,
    0x94C2: 0x7BE0,
    0x94C3: 0x5072,
    0x94C4: 0x67F4,
    0x94C5: 0x829D,
    0x94C6: 0x5C61,
    0x94C7: 0x854A,
    0x94C8: 0x7E1E,
    0x94C9: 0x820E,
    0x94CA: 0x5199,
    0x94CB: 0x5C04,
    0x94CC: 0x6368,
    0x94CD: 0x8D66,
    0x94CE: 0x659C,
    0x94CF: 0x716E,
    0x94D0: 0x793E,
    0x94D1: 0x7D17,
    0x94D2: 0x8005,
    0x94D3: 0x8B1D,
    0x94D4: 0x8ECA,
    0x94D5: 0x906E,
    0x94D6: 0x86C7,
    0x94D7: 0x90AA,
    0x94D8: 0x501F,
    0x94D9: 0x52FA,
    0x94DA: 0x5C3A,
    0x94DB: 0x6753,
    0x94DC: 0x707C,
    0x94DD: 0x7235,
    0x94DE: 0x914C,
    0x94DF: 0x91C8,
    0x94E0: 0x932B,
    0x94E1: 0x82E5,
    0x94E2: 0x5BC2,
    0x94E3: 0x5F31,
    0x94E4: 0x60F9,
    0x94E5: 0x4E3B,
    0x94E6: 0x53D6,
    0x94E7: 0x5B88,
    0x94E8: 0x624B,
    0x94E9: 0x6731,
    0x94EA: 0x6B8A,
    0x94EB: 0x72E9,
    0x94EC: 0x73E0,
    0x94ED: 0x7A2E,
    0x94EE: 0x816B,
    0x94EF: 0x8DA3,
    0x94F0: 0x9152,
    0x94F1: 0x9996,
    0x94F2: 0x5112,
    0x94F3: 0x53D7,
    0x94F4: 0x546A,
    0x94F5: 0x5BFF,
    0x94F6: 0x6388,
    0x94F7: 0x6A39,
    0x94F8: 0x7DAC,
    0x94F9: 0x9700,
    0x94FA: 0x56DA,
    0x94FB: 0x53CE,
    0x94FC: 0x5468,
    0x9540: 0x5B97,
    0x9541: 0x5C31,
    0x9542: 0x5DDE,
    0x9543: 0x4FEE,
    0x9544: 0x6101,
    0x9545: 0x62FE,
    0x9546: 0x6D32,
    0x9547: 0x79C0,
    0x9548: 0x79CB,
    0x9549: 0x7D42,
    0x954A: 0x7E4D,
    0x954B: 0x7FD2,
    0x954C: 0x81ED,
    0x954D: 0x821F,
    0x954E: 0x8490,
    0x954F: 0x8846,
    0x9550: 0x8972,
    0x9551: 0x8B90,
    0x9552: 0x8E74,
    0x9553: 0x8F2F,
    0x9554: 0x9031,
    0x9555: 0x914B,
    0x9556: 0x916C,
    0x9557: 0x96C6,
    0x9558: 0x919C,
    0x9559: 0x4EC0,
    0x955A: 0x4F4F,
    0x955B: 0x5145,
    0x955C: 0x5341,
    0x955D: 0x5F93,
    0x955E: 0x620E,
    0x955F: 0x67D4,
    0x9560: 0x6C41,
    0x9561: 0x6E0B,
    0x9562: 0x7363,
    0x9563: 0x7E26,
    0x9564: 0x91CD,
    0x9565: 0x9283,
    0x9566: 0x53D4,
    0x9567: 0x5919,
    0x9568: 0x5BBF,
    0x9569: 0x6DD1,
    0x956A: 0x795D,
    0x956B: 0x7E2E,
    0x956C: 0x7C9B,
    0x956D: 0x587E,
    0x956E: 0x719F,
    0x956F: 0x51FA,
    0x9570: 0x8853,
    0x9571: 0x8FF0,
    0x9572: 0x4FCA,
    0x9573: 0x5CFB,
    0x9574: 0x6625,
    0x9575: 0x77AC,
    0x9576: 0x7AE3,
    0x9577: 0x821C,
    0x9578: 0x99FF,
    0x9579: 0x51C6,
    0x957A: 0x5FAA,
    0x957B: 0x65EC,
    0x957C: 0x696F,
    0x957D: 0x6B89,
    0x957E: 0x6DF3,
    0x9580: 0x6E96,
    0x9581: 0x6F64,
    0x9582: 0x76FE,
    0x9583: 0x7D14,
    0x9584: 0x5DE1,
    0x9585: 0x9075,
    0x9586: 0x9187,
    0x9587: 0x9806,
    0x9588: 0x51E6,
    0x9589: 0x521D,
    0x958A: 0x6240,
    0x958B: 0x6691,
    0x958C: 0x66D9,
    0x958D: 0x6E1A,
    0x958E: 0x5EB6,
    0x958F: 0x7DD2,
    0x9590: 0x7F72,
    0x9591: 0x66F8,
    0x9592: 0x85AF,
    0x9593: 0x85F7,
    0x9594: 0x8AF8,
    0x9595: 0x52A9,
    0x9596: 0x53D9,
    0x9597: 0x5973,
    0x9598: 0x5E8F,
    0x9599: 0x5F90,
    0x959A: 0x6055,
    0x959B: 0x92E4,
    0x959C: 0x9664,
    0x959D: 0x50B7,
    0x959E: 0x511F,
    0x959F: 0x52DD,
    0x95A0: 0x5320,
    0x95A1: 0x5347,
    0x95A2: 0x53EC,
    0x95A3: 0x54E8,
    0x95A4: 0x5546,
    0x95A5: 0x5531,
    0x95A6: 0x5617,
    0x95A7: 0x5968,
    0x95A8: 0x59BE,
    0x95A9: 0x5A3C,
    0x95AA: 0x5BB5,
    0x95AB: 0x5C06,
    0x95AC: 0x5C0F,
    0x95AD: 0x5C11,
    0x95AE: 0x5C1A,
    0x95AF: 0x5E84,
    0x95B0: 0x5E8A,
    0x95B1: 0x5EE0,
    0x95B2: 0x5F70,
    0x95B3: 0x627F,
    0x95B4: 0x6284,
    0x95B5: 0x62DB,
    0x95B6: 0x638C,
    0x95B7: 0x6377,
    0x95B8: 0x6607,
    0x95B9: 0x660C,
    0x95BA: 0x662D,
    0x95BB: 0x6676,
    0x95BC: 0x677E,
    0x95BD: 0x68A2,
    0x95BE: 0x6A1F,
    0x95BF: 0x6A35,
    0x95C0: 0x6CBC,
    0x95C1: 0x6D88,
    0x95C2: 0x6E09,
    0x95C3: 0x6E58,
    0x95C4: 0x713C,
    0x95C5: 0x7126,
    0x95C6: 0x7167,
    0x95C7: 0x75C7,
    0x95C8: 0x7701,
    0x95C9: 0x785D,
    0x95CA: 0x7901,
    0x95CB: 0x7965,
    0x95CC: 0x79F0,
    0x95CD: 0x7AE0,
    0x95CE: 0x7B11,
    0x95CF: 0x7CA7,
    0x95D0: 0x7D39,
    0x95D1: 0x8096,
    0x95D2: 0x83D6,
    0x95D3: 0x848B,
    0x95D4: 0x8549,
    0x95D5: 0x885D,
    0x95D6: 0x88F3,
    0x95D7: 0x8A1F,
    0x95D8: 0x8A3C,
    0x95D9: 0x8A54,
    0x95DA: 0x8A73,
    0x95DB: 0x8C61,
    0x95DC: 0x8CDE,
    0x95DD: 0x91A4,
    0x95DE: 0x9266,
    0x95DF: 0x937E,
    0x95E0: 0x9418,
    0x95E1: 0x969C,
    0x95E2: 0x9798,
    0x95E3: 0x4E0A,
    0x95E4: 0x4E08,
    0x95E5: 0x4E1E,
    0x95E6: 0x4E57,
    0x95E7: 0x5197,
    0x95E8: 0x5270,
    0x95E9: 0x57CE,
    0x95EA: 0x5834,
    0x95EB: 0x58CC,
    0x95EC: 0x5B22,
    0x95ED: 0x5E38,
    0x95EE: 0x60C5,
    0x95EF: 0x64FE,
    0x95F0: 0x6761,
    0x95F1: 0x6756,
    0x95F2: 0x6D44,
    0x95F3: 0x72B6,
    0x95F4: 0x7573,
    0x95F5: 0x7A63,
    0x95F6: 0x84B8,
    0x95F7: 0x8B72,
    0x95F8: 0x91B8,
    0x95F9: 0x9320,
    0x95FA: 0x5631,
    0x95FB: 0x57F4,
    0x95FC: 0x98FE,
    0x9640: 0x62ED,
    0x9641: 0x690D,
    0x9642: 0x6B96,
    0x9643: 0x71ED,
    0x9644: 0x7E54,
    0x9645: 0x8077,
    0x9646: 0x8272,
    0x9647: 0x89E6,
    0x9648: 0x98DF,
    0x9649: 0x8755,
    0x964A: 0x8FB1,
    0x964B: 0x5C3B,
    0x964C: 0x4F38,
    0x964D: 0x4FE1,
    0x964E: 0x4FB5,
    0x964F: 0x5507,
    0x9650: 0x5A20,
    0x9651: 0x5BDD,
    0x9652: 0x5BE9,
    0x9653: 0x5FC3,
    0x9654: 0x614E,
    0x9655: 0x632F,
    0x9656: 0x65B0,
    0x9657: 0x664B,
    0x9658: 0x68EE,
    0x9659: 0x699B,
    0x965A: 0x6D78,
    0x965B: 0x6DF1,
    0x965C: 0x7533,
    0x965D: 0x75B9,
    0x965E: 0x771F,
    0x965F: 0x795E,
    0x9660: 0x79E6,
    0x9661: 0x7D33,
    0x9662: 0x81E3,
    0x9663: 0x82AF,
    0x9664: 0x85AA,
    0x9665: 0x89AA,
    0x9666: 0x8A3A,
    0x