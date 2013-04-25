/**
 * @namespace
 */
mindmaps.Util = mindmaps.Util || {};

mindmaps.Util.colors10 = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd' , '#8c564b' , '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
mindmaps.Util.colors20 = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
mindmaps.Util.colors20b = ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b', '#e7969c', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6']
mindmaps.Util.colors20c = ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc', '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9']
mindmaps.Util.touchHandler = function (event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
    }


    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}
/**
 * Tracks an event to google analytics.
 */
mindmaps.Util.trackEvent = function (category, action, label) {
    if (!window._gaq) {
        return;
    }

    if (label) {
        _gaq.push([ '_trackEvent', category, action, label]);
    } else {
        _gaq.push([ '_trackEvent', category, action]);
    }
}

/**
 * Creates a UUID in compliance with RFC4122.
 *
 * @static
 * @returns {String} a unique id
 */
mindmaps.Util.createUUID = function () {
    // http://www.ietf.org/rfc/rfc4122.txt
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Returns an ID used by model objects.
 *
 * @returns {String} id
 */
mindmaps.Util.getId = function () {
    return mindmaps.Util.createUUID();
};

/**
 * Creates a random color.
 *
 * @returns {String} color in hex format
 */
mindmaps.Util.randomColor = function () {

    return mindmaps.Util.colors20[
        Math.round(Math.random() * 20)
        ]
};


mindmaps.Util.getUrlParams = function () {
    // http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript/2880929#2880929
    var urlParams = {};
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) {
            return decodeURIComponent(s.replace(a, " "));
        },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
        urlParams[d(e[1])] = d(e[2]);

    return urlParams;
};

function timeit(func, caption) {
    var start = new Date().getTime();
    func();
    var stop = new Date().getTime();
    var diff = stop - start;
    console.log(caption || "", diff, "ms");
}

mindmaps.Util.distance = function (offsetX, offsetY) {
    return Math.sqrt(offsetX * offsetX + offsetY * offsetY);
};


/**
 * test Default documents
 */

function getBinaryMapWithDepth(depth) {
    var mm = new mindmaps.MindMap();
    var root = mm.root;

    function createTwoChildren(node, depth) {
        if (depth === 0) {
            return;
        }

        var left = mm.createNode();
        left.text.caption = "Node " + left.id;
        node.addChild(left);
        createTwoChildren(left, depth - 1);

        var right = mm.createNode();
        right.text.caption = "Node " + right.id;
        node.addChild(right);
        createTwoChildren(right, depth - 1);
    }

    // depth 10: about 400kb, 800kb in chrome
    // depth 12: about 1600kb
    // depth 16: 25mb
    var depth = depth || 10;
    createTwoChildren(root, depth);

    // generate positions for all nodes.
    // tree grows balanced from left to right
    root.offset = new mindmaps.Point(400, 400);
    // var offset = Math.pow(2, depth-1) * 10;
    var offset = 80;
    var c = root.children.values();
    setOffset(c[0], 0, -offset);
    setOffset(c[1], 0, offset);
    function setOffset(node, depth, offsetY) {
        node.offset = new mindmaps.Point((depth + 1) * 50, offsetY);

        if (node.isLeaf()) {
            return;
        }

        var c = node.children.values();
        var left = c[0];
        setOffset(left, depth + 1, offsetY - offsetY / 2);

        var right = c[1];
        setOffset(right, depth + 1, offsetY + offsetY / 2);
    }

    // color nodes
    c[0].branchColor = mindmaps.Util.randomColor();
    c[0].forEachDescendant(function (node) {
        node.branchColor = mindmaps.Util.randomColor();
    });
    c[1].branchColor = mindmaps.Util.randomColor();
    c[1].forEachDescendant(function (node) {
        node.branchColor = mindmaps.Util.randomColor();
    });

    return mm;
}

/**
 * <pre>
 *        r
 *    /     |        \
 *   0    1     2
 *       / \     / | \  \
 *        10  11  20 21 22 23
 *        |
 *        100
 *        |
 *        1000
 * </pre>
 */
function getDefaultTestMap() {
    var mm = new mindmaps.MindMap();
    var root = mm.root;

    var n0 = mm.createNode();
    var n1 = mm.createNode();
    var n2 = mm.createNode();
    root.addChild(n0);
    root.addChild(n1);
    root.addChild(n2);

    var n10 = mm.createNode();
    var n11 = mm.createNode();
    n1.addChild(n10);
    n1.addChild(n11);

    var n20 = mm.createNode();
    var n21 = mm.createNode();
    var n22 = mm.createNode();
    var n23 = mm.createNode();
    n2.addChild(n20);
    n2.addChild(n21);
    n2.addChild(n22);
    n2.addChild(n23);

    var n100 = mm.createNode();
    n10.addChild(n100);

    var n1000 = mm.createNode();
    n100.addChild(n1000);

    return mm;
}

function getDefaultTestDocument() {
    var doc = new mindmaps.Document();
    doc.title = "test document";
    doc.mindmap = getDefaultTestMap();

    return doc;
}

function getSimpleMap() {
    var mm = new mindmaps.MindMap();
    var root = mm.root;

    var n0 = mm.createNode();
    var n1 = mm.createNode();
    root.addChild(n0);
    root.addChild(n1);

    return mm;
}
