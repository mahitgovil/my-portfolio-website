/* global gsap */

import React, { useCallback, useEffect } from "react";
import "../styles/animatedbackground.css";

// Hero image variants live in public/assets/hero/ (generated from the original space.jpg).
// The same <picture> is in the static shell in public/index.html (so the image downloads and
// shows before this bundle has even loaded) - keep the two in sync.
const HERO_BASE = `${process.env.PUBLIC_URL}/assets/hero/hero`;
const HERO_WIDTHS = [640, 960, 1280, 1920];
const heroSrcSet = ext =>
  HERO_WIDTHS.map(w => `${HERO_BASE}-${w}.${ext} ${w}w`).join(", ");

export default function AnimatedBackground() {
  // Fade the image in once it has loaded. If it is already cached/preloaded by the time this
  // mounts, show it straight away (no fade, no flash of the placeholder).
  const heroImgRef = useCallback(img => {
    if (img && img.complete && img.naturalWidth > 0) {
      img.classList.add("is-loaded");
    }
  }, []);

  useEffect(() => {
    // gsap is a deferred CDN script. Normally it has already run by now; if not, wait for
    // the window "load" event (by then all deferred scripts have executed).
    var teardown = null;
    function start() {
      teardown = main();
    }
    if (window.gsap) {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }
    return function () {
      window.removeEventListener("load", start);
      if (teardown) teardown();
    };

    function main() {
      var width,
        height,
        largeHeader,
        canvas,
        ctx,
        points = [],
        target,
        rafId = null,
        running = false, // is the draw loop currently scheduled?
        inView = true, // is the hero on screen?
        resizeTimer = null,
        observer = null;

      var reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Main
      initHeader();
      initAnimation();
      addListeners();

      function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: width / 2, y: height / 2 };

        largeHeader = document.getElementById("large-header");
        largeHeader.style.height = height + "px";

        canvas = document.getElementById("demo-canvas");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");

        // create points (fewer on small screens: same look, much less work per frame)
        var cells = width < 768 ? 14 : 20;
        points = [];
        for (var x = 0; x < width; x = x + width / cells) {
          for (var y = 0; y < height; y = y + height / cells) {
            var px = x + (Math.random() * width) / cells;
            var py = y + (Math.random() * height) / cells;
            var p = { x: px, originX: px, y: py, originY: py };
            points.push(p);
          }
        }

        // for each point find the 5 closest points
        for (var i = 0; i < points.length; i++) {
          var closest = [];
          var p1 = points[i];
          for (var j = 0; j < points.length; j++) {
            var p2 = points[j];
            if (!(p1 === p2)) {
              var placed = false;
              for (var k = 0; k < 5; k++) {
                if (!placed) {
                  if (closest[k] === undefined) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }

              for (var m = 0; m < 5; m++) {
                if (!placed) {
                  if (getDistance(p1, p2) < getDistance(p1, closest[m])) {
                    closest[m] = p2;
                    placed = true;
                  }
                }
              }
            }
          }
          p1.closest = closest;
        }

        // assign a circle to each point
        for (var n in points) {
          var c = new Circle(
            points[n],
            2 + Math.random() * 2,
            "rgba(255,255,255,0.3)"
          );
          points[n].circle = c;
        }
      }

      // Event handling
      function addListeners() {
        if (!("ontouchstart" in window)) {
          window.addEventListener("mousemove", mouseMove, { passive: true });
        }
        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", updateRunning);

        // Only animate while the hero is actually on screen. (The old check read
        // document.body.scrollTop, which is always 0, so it never paused.)
        if ("IntersectionObserver" in window) {
          observer = new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
            updateRunning();
          });
          observer.observe(largeHeader);
        }
      }

      function mouseMove(e) {
        let posx = 0;
        let posy = 0;
        if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
        } else if (e.clientX || e.clientY) {
          posx =
            e.clientX +
            document.body.scrollLeft +
            document.documentElement.scrollLeft;
          posy =
            e.clientY +
            document.body.scrollTop +
            document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
      }

      // Mobile browsers fire "resize" while you scroll (the URL bar shows/hides).
      // Re-allocating the canvas each time caused stutter, so ignore small height
      // changes and debounce the rest.
      function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          var w = window.innerWidth;
          var h = window.innerHeight;
          if (w === width && Math.abs(h - height) < 150) return;
          stopLoop();
          killTweens();
          initHeader(); // rebuild for the new size (e.g. rotating a phone)
          startShifting();
          updateRunning();
        }, 150);
      }

      // animation
      function initAnimation() {
        startShifting();
        updateRunning();
      }

      function startShifting() {
        if (reduceMotion) return;
        for (var i in points) {
          shiftPoint(points[i]);
        }
      }

      function killTweens() {
        for (var i in points) {
          gsap.killTweensOf(points[i]);
        }
      }

      function updateRunning() {
        var shouldRun = inView && !document.hidden;
        if (reduceMotion) {
          drawFrame(); // one still frame
          return;
        }
        if (shouldRun && !running) {
          running = true;
          gsap.globalTimeline.resume();
          rafId = requestAnimationFrame(loop);
        } else if (!shouldRun && running) {
          stopLoop();
          gsap.globalTimeline.pause(); // freeze the point tweens too
        }
      }

      function stopLoop() {
        running = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
      }

      function loop() {
        if (!running) return;
        drawFrame();
        rafId = requestAnimationFrame(loop);
      }

      function drawFrame() {
        ctx.clearRect(0, 0, width, height);
        for (var i in points) {
          // detect points in range
          var d = getDistance(target, points[i]);
          if (d < 4000) {
            points[i].active = 0.3;
            points[i].circle.active = 0.6;
          } else if (d < 20000) {
            points[i].active = 0.1;
            points[i].circle.active = 0.3;
          } else if (d < 40000) {
            points[i].active = 0.02;
            points[i].circle.active = 0.1;
          } else {
            points[i].active = 0;
            points[i].circle.active = 0;
          }

          drawLines(points[i]);
          points[i].circle.draw();
        }
      }

      function shiftPoint(p) {
        gsap.to(p, 1 + 1 * Math.random(), {
          x: p.originX - 50 + Math.random() * 100,
          y: p.originY - 50 + Math.random() * 100,
          ease: gsap.easeInOut,
          onComplete: function () {
            shiftPoint(p);
          },
        });
      }

      // Canvas manipulation
      function drawLines(p) {
        if (!p.active) return;
        for (var i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = "rgba(156,217,249," + p.active + ")";
          ctx.stroke();
        }
      }

      function Circle(pos, rad, color) {
        var _this = this;

        // constructor
        (function () {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
        })();

        this.draw = function () {
          if (!_this.active) return;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = "rgba(156,217,249," + _this.active + ")";
          ctx.fill();
        };
      }

      // Util
      function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
      }

      // Cleanup (also keeps React StrictMode's double-mount from running two loops)
      return function cleanup() {
        stopLoop();
        killTweens();
        gsap.globalTimeline.resume();
        clearTimeout(resizeTimer);
        if (observer) observer.disconnect();
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", updateRunning);
      };
    }
  }, []);

  return (
    <div id="large-header" className="large-header">
      <picture className="hero-bg">
        <source type="image/avif" srcSet={heroSrcSet("avif")} sizes="100vw" />
        <source type="image/webp" srcSet={heroSrcSet("webp")} sizes="100vw" />
        <img
          ref={heroImgRef}
          // if the static shell's copy already finished loading, start fully visible so there is
          // no fade/flash when React swaps the shell for this element
          className={`hero-bg__img${window.__heroLoaded ? " is-loaded" : ""}`}
          src={`${HERO_BASE}-1280.jpg`}
          srcSet={heroSrcSet("jpg")}
          sizes="100vw"
          alt=""
          fetchpriority="high"
          onLoad={e => e.currentTarget.classList.add("is-loaded")}
        />
      </picture>
      <canvas id="demo-canvas"></canvas>
      <h1 className="main-title">
        Hi! I'm Mahit <span className="thin">Govil</span>
      </h1>
      <p className="hero_desc hero-text">
        Software Engineer & Full-Stack Developer.
      </p>
    </div>
  );
}
