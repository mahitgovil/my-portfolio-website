import { useEffect, useRef } from "react";

// Put the ref on a list: each item's drawing switches on once, when it comes into view.
export function useLit() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-lit");
          observer.unobserve(entry.target);
        }),
      { threshold: 0.35 }
    );
    [...ref.current.children].forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}
