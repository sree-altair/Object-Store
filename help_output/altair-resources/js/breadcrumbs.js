var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) {var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); }

 } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Crumb =
// text: the text content, the caption.
// trail: is the CrumbTrail Object to which this Crumb belongs.
// index: is the place in the CrumbTrail: 0 - home, N - nth crumb.
function Crumb(element, trail, index) {
    _classCallCheck(this, Crumb);

    // Creates the Crumb element that will be later used in
    // composing the DOM
    this.element = element;
    this.element.trail = trail;
    this.element.index = index ? index : 0;
};

// This class represents a breadcrumbs UI item in the DOM


var CrumbTrail = function () {

    // id: this is the element id of the DOM element that wil lcontain the
    //     breadcrumbs.
    // list: is the list of string that will be turned into breadcrumbs
    function CrumbTrail(id) {
        _classCallCheck(this, CrumbTrail);

        // There are two elements in the current HTML code that are identified
        // by the query '.wh_breadcrumb ol', we need the second one.
        // Once/if the duplication is corrected, the below line should read as
        // this.targetElement = document.querySelector(id)
        this.targetElement = document.querySelectorAll(id)[1];
        this.crumbs = [];

        // Add all of the crumbs to the trail
        var list = this.targetElement.childNodes;
        for (var i = 0; i < list.length; i++) {
            // Only add <li> elements
            if (list[i].nodeName == "LI") {
                this.addCrumb(list[i], i);
            }
        }



        // Initial trail fit into its container
        this.fitTrailToContainer();

        // Set up resize event so that the trail gets re-fitted when the
        // window gets resized.
        window.addEventListener("resize", resizeThrottler, false);
        var resizeTimeout;
        function resizeThrottler() {
            // ignore resize events as long as an actualResizeHandler execution is in the queue
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(function () {
                    resizeTimeout = null;
                    actualResizeHandler();

                    // The actualResizeHandler will execute at a rate of 15fps
                }, 66);
            }
        }
        var this_trail = this;
        function actualResizeHandler() {
            this_trail.fitTrailToContainer();
        }
    }

    // Adds a crumb to the trail
    // text: the string appearing in the crumbs
    // index: the place in the crumb trail for this crumb


    _createClass(CrumbTrail, [{
        key: "addCrumb",
        value: function addCrumb(text, index) {
            var crumb = new Crumb(text, this, index);
            this.crumbs.push(crumb);
        }

        // This function fits the breadcrumb trail within its containing element

    }, {
        key: "fitTrailToContainer",
        value: function fitTrailToContainer() {

            var parentElementContentWidth = 0;
            var trailWidth = 0;
            var overflowList = undefined;
            var overflowWrap = undefined;

            console.groupCollapsed("Fitting trail to container [fitTrailToContainer() ]");

            // Delete all visualized crumbs
            // This felt more economical than trying to work without disposing the elements
            var myNode = this.targetElement;
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }


            parentElementContentWidth = getElementContentWidth(this.targetElement.parentElement);
            console.log("Current parentElement content width is: " + parentElementContentWidth);
            console.group("Adding crumbs to the trail...");

            // Add the home crumb
            this.crumbs[0].element.onclick = this.breadcrumbClick;
            this.targetElement.appendChild(this.crumbs[0].element);
            // Calculate the trail lenght (well, width) after the insertion.
            // Elements have to be inserted before their size is known
            // Might try to use "visibility: hidden" in case this turns out to be
            // too flashy
            trailWidth += this.crumbs[0].element.offsetWidth;

            console.log("Current trail width is: " + trailWidth);

            // We have the home element (index 0) in place already, now since we
            // want the roght most element to be visible, we start fomr that and add
            // the elements in reserve order so that we can see when the need to
            // generate a collapsed dropdown list comes in
            for (var i = this.crumbs.length - 1; i > 0; i--) {
                // Add the click event to the crumb (we removed all the elements not
                // not long ago, so we need to do this again. Perhaps would be
                // better to just detach them from the DOM? IS that even possible?
                this.crumbs[i].element.onclick = this.breadcrumbClick;

                // The very first time we cross this point, we are not yet
                // overflowing, but from the 2-nd iteration we might
                if (!overflowList) {

                    // We got to add the element to the DOM for the browser to
                    // render it and tell us its size. Are there alternatives?
                    this.targetElement.firstChild.insertAdjacentHTML('afterend',this.crumbs[i].element.outerHTML)
                    // trailWidth += this.crumbs[i].element.offsetWidth;
                    trailWidth += this.targetElement.firstChild.nextSibling.offsetWidth;

                    console.log("Last added item was " + this.targetElement.firstChild.nextSibling.offsetWidth + "px wide");
                    console.log("Current trail width is: " + trailWidth);

                    // The just added crumb causes overflow if the total trail width
                    // is more than it's container's. We trigger the overflow only
                    // is the element being added is not the right most, as we do
                    // not want that element to ever be collapsed into the overflow
                    // dropdown
                    // The '26' represents the size of the overflowWrap element.
                    // In case the trail does not fold enough leaving some of the
                    // last element ut of sight, try adjusting this number.
                    if (trailWidth + 26 >= parentElementContentWidth && this.targetElement.children.length > 2) {
                        // If we exceeded the container's width we replace the just
                        // added crumb with the overflow placeholder (...) and place
                        // the current crumb as its first child.

                        console.log('Cannot fit the crumb. Overflowing.');

                        // Remove the just added crumb
                        //this.crumbs[i].element.remove();
                        // this.crumbs[i].element.parentElement.removeChild(this.crumbs[i].element)
                        this.targetElement.firstChild.nextSibling.remove()

                        // Create the overflow element, which is still a <li> like
                        // any other crumb
                        overflowWrap = document.createElement('li');
                        overflowWrap.classList.add("overflow-wrapper");
                        overflowWrap.textContent = "...";
                        // overflowWrap.title = "Click to expand"

                        // The overflow element will next a <ul> list where we will
                        // append all of the other crumbs from now on, as we run out
                        // of space within our containing element
                        overflowList = document.createElement('ul');
                        overflowList.classList.add("collapsed");

                        // Append the overflow list as a child of the element
                        // actually on the breadcrumbs trail
                        overflowWrap.appendChild(overflowList);

                        // Finally, insert the current crumb as a child (the 1st) of
                        // the overflow list.
                        overflowList.appendChild(this.crumbs[i].element);

                        // Insert the overflowWrap (...) element after the home
                        // element
                        // this.targetElement.firstChild.insertAdjacentElement('afterend', overflowWrap);
                        this.targetElement.firstChild.insertAdjacentHTML('afterend',overflowWrap.outerHTML)

                        // When clicking on the overflow collector element, display
                        // the overflow list.
                        // overflowWrap.onclick = function () {
                        //     overflowList.classList.toggle("collapsed");
                        // };
                        document.querySelector('.overflow-wrapper').addEventListener("click",
                            function() { this.querySelector('ul').classList.toggle('collapsed') }
                        );
                    }
                } else {
                    // If we are in overflow mode, add the crumb to the overflow
                    // element list, in reverse order
                    // document.querySelector('.overflow-wrapper ul').lastChild.appendChild(this.crumbs[i].element);
                    document.querySelector('.overflow-wrapper ul').insertBefore(this.crumbs[i].element, document.querySelector('.overflow-wrapper ul').lastChild);
                }
            }


            console.groupEnd();
            console.groupEnd();
        }

        // The "click" handler to each crumb.

    }, {
        key: "breadcrumbClick",
        value: function breadcrumbClick(event) {

            // Do not propagate the event
            event.stopPropagation();

            // Identify the clicked child position
            // console.log(`You clicked on crumb number ${event.target.index}`)
            if (event.target.index + 1 < event.target.trail.crumbs.length) {
                // If the clicked element is not the last crumb on the trail,
                // remove the elements on its right before re-fitting the trail.
                // Each element in the DOM that is also a crumb, holds it's own
                // index as a property, so that we do not have to compute the
                // clicked element position on the trail to know what elements are
                // on its right. We simply discard from the Object.crumbs array all
                // of the elements that have an index greater than the clicked one.
                // Mind the +1, which is because of the 0 based array.
                event.target.trail.crumbs.splice(-1 * event.target.trail.crumbs.length + event.target.index + 1);
            }
            // Refit the trail in its container as we might have removed one or more
            // crumbs because of the click.
            event.target.trail.fitTrailToContainer();
        }
    }]);

    return CrumbTrail;
}();

function getElementContentWidth(element) {
    var styles = window.getComputedStyle(element);
    var padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    return element.clientWidth - padding;
}

var trail = undefined;
document.onreadystatechange = function () {
    // alternative to DOMContentLoaded event
    if (document.readyState === "interactive") {
        // We init a new crumbs trail passing the parent element
        // which is expected to be a list <ul> or <ol> containing
        // one or more <li> elements. The first <li> is expected to
        // be the "home" element.
        console.log('Init crumbs trail...');
        trail = new CrumbTrail('.wh_breadcrumb ol');
    }
};
