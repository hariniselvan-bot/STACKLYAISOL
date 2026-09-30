/* =========================================================
   STACKLY — navigation.js
   Mobile menu accessibility
   404 smart back navigation
   Previous page + section restoration
   Header state restoration after Back / Forward
   ========================================================= */

(function () {

    "use strict";

    const $ = (selector, context = document) =>
        context.querySelector(selector);


    /* =========================================================
       RESTORE PAGE TRANSITION STATE
       main.js temporarily transforms <body> during navigation.
       A transformed ancestor can affect fixed-position children.
       Always clear that state when a page is restored.
       ========================================================= */

    function restoreBodyState() {

        if (!document.body) return;

        document.body.style.opacity = "";
        document.body.style.transform = "";
        document.body.style.filter = "";
        document.body.style.transition = "";
        document.body.style.overflow = "";
    }


    /* =========================================================
       HEADER STATE
       IMPORTANT:
       Do NOT change position/top/transform here.
       The original CSS controls the fixed .nav.
       ========================================================= */

    function refreshHeaderState() {

        const nav = $(".nav");

        if (!nav) {
            return;
        }

        const scrollY =
            window.scrollY ||
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            0;

        nav.classList.toggle("scrolled", scrollY > 40);
    }


    /* =========================================================
       SCROLL
       ========================================================= */

    let scrollTicking = false;

    window.addEventListener(
        "scroll",
        function () {

            if (scrollTicking) {
                return;
            }

            scrollTicking = true;

            requestAnimationFrame(function () {

                refreshHeaderState();

                scrollTicking = false;

            });

        },
        { passive: true }
    );


    /* =========================================================
       MOBILE MENU — ESC TO CLOSE
       ========================================================= */

    document.addEventListener("keydown", function (event) {

        if (event.key !== "Escape") {
            return;
        }

        const mobileMenu = $(".mobile-menu");
        const burger = $(".burger");

        if (
            mobileMenu &&
            mobileMenu.classList.contains("open") &&
            burger
        ) {
            burger.click();
        }

    });


    /* =========================================================
       MOBILE MENU ACCESSIBILITY
       ========================================================= */

    const burger = $(".burger");
    const mobileMenu = $(".mobile-menu");

    if (burger && mobileMenu) {

        const menuObserver =
            new MutationObserver(function () {

                if (mobileMenu.classList.contains("open")) {
                    burger.focus();
                }

            });

        menuObserver.observe(mobileMenu, {
            attributes: true,
            attributeFilter: ["class"]
        });

    }


    /* =========================================================
       404 — SAVE CURRENT PAGE
       ========================================================= */

    window.save404PreviousPage = function () {

        try {

            const currentURL = window.location.href;

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
                "Stackly: Unable to save 404 previous page.",
                error
            );

        }

    };


    /* =========================================================
       404 — SMART GO BACK
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

                if (back404.dataset.processing === "true") {
                    return;
                }

                back404.dataset.processing = "true";


                /*
                 * Prefer normal browser history.
                 * This preserves the exact scroll position
                 * when the browser restores the previous page.
                 */
                if (window.history.length > 1) {

                    window.history.back();

                    return;

                }


                let previousPage = null;

                try {

                    previousPage =
                        sessionStorage.getItem(
                            "404PreviousPage"
                        );

                } catch (error) {

                    console.warn(
                        "Stackly: Unable to read 404 previous page.",
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


                window.location.href =
                    "index.html";

            }
        );

    }


    /* =========================================================
       NAVIGATION RESTORATION
       ========================================================= */

    function refreshNavigationState() {

        refreshHeaderState();

        window.dispatchEvent(
            new CustomEvent(
                "stackly:navigation-restored"
            )
        );

    }


    /* =========================================================
       BFCACHE / BACK / FORWARD
       ========================================================= */

    window.addEventListener(
        "pageshow",
        function () {

            restoreBodyState();
            refreshNavigationState();

            /*
             * Browser may restore scroll position just after
             * pageshow, so check again.
             */
            setTimeout(
                refreshNavigationState,
                50
            );

            setTimeout(
                refreshNavigationState,
                250
            );

            setTimeout(
                refreshNavigationState,
                600
            );

        }
    );


    /* =========================================================
       HASH CHANGE
       ========================================================= */

    window.addEventListener(
        "hashchange",
        function () {

            setTimeout(
                refreshNavigationState,
                50
            );

        }
    );


    /* =========================================================
       INITIAL LOAD
       ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            refreshNavigationState,
            { once: true }
        );

    } else {

        refreshNavigationState();

    }


})();
