import { useEffect, useRef, type MouseEvent } from "react";

export default function AnimatedFaq({ question, answer }: { question: string; answer: string }) {
  const details = useRef<HTMLDetailsElement>(null);
  const animation = useRef<Animation | null>(null);
  const expanding = useRef(false);

  useEffect(() => () => animation.current?.cancel(), []);

  function toggle(event: MouseEvent<HTMLElement>) {
    const element = details.current;
    if (!element) return;
    event.preventDefault();
    const open = animation.current ? !expanding.current : !element.open;
    const from = element.getBoundingClientRect().height;
    animation.current?.cancel();
    animation.current = null;
    expanding.current = open;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.open = open;
      return;
    }
    // Measure both native states; keep the answer visible until closing finishes.
    element.open = open;
    const to = element.getBoundingClientRect().height;
    element.open = true;
    const motion = element.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: 280, easing: "cubic-bezier(.2,.7,.2,1)",
    });
    animation.current = motion;
    motion.onfinish = () => {
      element.open = open;
      animation.current = null;
    };
  }

  return <details ref={details} className="animated-faq">
    <summary onClick={toggle}>{question}<span aria-hidden="true" className="faq-indicator">+</span></summary>
    <p>{answer}</p>
  </details>;
}
