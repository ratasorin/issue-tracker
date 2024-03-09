import { MouseEvent } from "react";

export const animateRipple = (event: MouseEvent<HTMLButtonElement>) => {
  const button = event.currentTarget;

  if (!button) return;

  // cleanup any residue
  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }

  const circle = document.createElement("span");
  const diameter = 50;
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.minWidth = circle.style.minHeight = `${diameter}px`;
  circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
  circle.style.top = `${0}px`;
  circle.classList.add("ripple");

  button.appendChild(circle);
};
