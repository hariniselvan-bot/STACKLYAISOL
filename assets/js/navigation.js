/* =========================================================
   STACKLY — navigation.js
   Fixed Header + Mobile Menu + 404 Back Navigation
   ========================================================= */

(function () {

    "use strict";


    /* =========================================================
       HELPER
       ========================================================= */

    const $ = (selector, context = document) => {
        return context.querySelector(selector);
    };


    /* =========================================================
       HEADER
       ========================================================= */

    function updateHeader() {

        const header = $("header");
        const nav = $(".nav");

        if (!header) return;

        const scrollY =
            window.scrollY ||
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            0;


        /*
         * DO NOT change position here.
         * Your CSS controls fixed positioning.
         */


        if (scrollY > 20) {

            header.classList.add("scrolled");

            if (nav) {
                nav.classList.add("scrolled");
            }

        } else {

            header.classList.remove("scrolled");

            if (nav) {
                nav.classList.remove("scrolled");
            }

        }

    }


    /* =========================================================
       SCROLL
       ========================================================= */

    let ticking = false;

    window.addEventListener(
        "scroll",
        function () {

            if (!ticking) {

                window.requestAnimationFrame(function () {

                    updateHeader();

                    ticking = false;

                });

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    /* =========================================================
       MOBILE MENU
       ========================================================= */

    const burger = $(".burger");
    const mobileMenu = $(".mobile-menu");
    const closeButton = $(".mm-close");


    function openMobileMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.add("open");

        document.body.classList.add("menu-open");


        if (burger) {

            burger.classList.add("active");

            burger.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function closeMobileMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.remove("open");

        document.body.classList.remove("menu-open");


        if (burger) {

            burger.classList.remove("active");

            burger.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (burger) {

        burger.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (
                    mobileMenu &&
                    mobileMenu.classList.contains("open")
                ) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                closeMobileMenu();

            }
        );

    }


    /* =========================================================
       ESC KEY
       ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                mobileMenu &&
                mobileMenu.classList.contains("open")
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =========================================================
       MOBILE LINKS
       ========================================================= */

    if (mobileMenu) {

        mobileMenu
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        closeMobileMenu();

                    }
                );

            });

    }


    /* =========================================================
       404 — SAVE PREVIOUS PAGE
       ========================================================= */

    window.save404PreviousPage = function () {

        try {

            const currentURL =
                window.location.href;


            if (
                currentURL &&
                !currentURL.includes("/404.html")
            ) {

                sessionStorage.setItem(
                    "404PreviousPage",
                    currentURL
                );

            }

        } catch (error) {

            console.warn(
                "Stackly: Could not save previous page.",
                error
            );

        }

    };


    /* =========================================================
       404 — SMART BACK
       ========================================================= */

    const back404 = $("[data-back]");


    if (
        back404 &&
        back404.dataset.stacklyBackBound !== "true"
    ) {

        back404.dataset.stacklyBackBound = "true";


        back404.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    back404.dataset.processing === "true"
                ) {
                    return;
                }


                back404.dataset.processing = "true";


                /*
                 * First try browser history.
                 */
                if (window.history.length > 1) {

                    window.history.back();

                    return;

                }


                /*
                 * Session storage fallback.
                 */
                let previousPage = null;


                try {

                    previousPage =
                        sessionStorage.getItem(
                            "404PreviousPage"
                        );

                } catch (error) {

                    console.warn(
                        "Stackly: Could not read previous page.",
                        error
                    );

                }


                if (previousPage) {

                    try {

                        sessionStorage.removeItem(
                            "404PreviousPage"
                        );

                    } catch (error) {}

                    window.location.href =
                        previousPage;

                    return;

                }


                /*
                 * Referrer fallback.
                 */
                const referrer =
                    document.referrer || "";


                if (
                    referrer &&
                    !referrer.includes("/404.html")
                ) {

                    window.location.href =
                        referrer;

                    return;

                }


                /*
                 * Final fallback.
                 */
                window.location.href =
                    "index.html";

            }
        );

    }


    /* =========================================================
       PAGE RESTORATION
       ========================================================= */

    function restoreNavigation() {

        /*
         * DO NOT modify position.
         * Only restore the header state.
         */

        updateHeader();


        window.dispatchEvent(
            new CustomEvent(
                "stackly:navigation-restored"
            )
        );

    }


    /* =========================================================
       PAGE SHOW
       ========================================================= */

    window.addEventListener(
        "pageshow",
        function () {

            /*
             * Immediately restore header.
             */
            restoreNavigation();


            /*
             * Browser may restore scroll position
             * after pageshow.
             */

            setTimeout(
                restoreNavigation,
                50
            );


            setTimeout(
                restoreNavigation,
                200
            );


            setTimeout(
                restoreNavigation,
                500
            );

        }
    );


    /* =========================================================
       DOM READY
       ========================================================= */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                restoreNavigation();

            },
            {
                once: true
            }
        );

    } else {

        restoreNavigation();

    }


    /* =========================================================
       HASH CHANGE
       ========================================================= */

    window.addEventListener(
        "hashchange",
        function () {

            restoreNavigation();

        }
    );


    /* =========================================================
       RESIZE
       ========================================================= */

    window.addEventListener(
        "resize",
        function () {

            updateHeader();

        },
        {
            passive: true
        }
    );


})();