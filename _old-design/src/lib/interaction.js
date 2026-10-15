// Original Svelte implementations of the interaction ideas in the six
// supplied Skiper UI references. No licensed React source is bundled.
export function fitHeadline(node) {
  let width = 0;
  let frame = 0;
  let forceFit = false;
  let alive = true;
  const fit = (force = false) => {
    if (!alive || (!force && width === node.parentElement.clientWidth)) return;
    width = node.parentElement.clientWidth;
    node.style.fontSize = '';
    if (node.scrollWidth > node.clientWidth) {
      node.style.fontSize = `${((parseFloat(getComputedStyle(node).fontSize) * node.clientWidth) / node.scrollWidth) * 0.985}px`;
    }
  };
  const schedule = (force = false) => {
    forceFit ||= force;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      fit(forceFit);
      forceFit = false;
    });
  };
  const observer = new ResizeObserver(() => schedule());
  observer.observe(node.parentElement);
  document.fonts.ready.then(() => {
    if (alive) schedule(true);
  });
  fit(true);
  return {
    destroy() {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    },
  };
}

export function reveal(node) {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches || !('IntersectionObserver' in window)) return;
  node.classList.add('will-reveal');
  const show = () => {
    node.classList.add('revealed');
    observer.disconnect();
  };
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) show();
    },
    { threshold: 0.08 },
  );
  observer.observe(node);
  media.addEventListener('change', show);
  return {
    destroy() {
      observer.disconnect();
      media.removeEventListener('change', show);
    },
  };
}

export function cursorTrail(node, images = []) {
  const media = matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );
  const children = new Set();
  let last = null,
    sequence = 0;
  function move(event) {
    if (
      !media.matches ||
      !images.length ||
      event.target.closest('a,button,input')
    )
      return;
    const point = { x: event.clientX, y: event.clientY };
    if (last && Math.hypot(point.x - last.x, point.y - last.y) < 100) return;
    last = point;
    const bounds = node.getBoundingClientRect();
    const img = document.createElement('img');
    img.src = images[sequence++ % images.length];
    img.alt = '';
    img.className = 'cursor-poster';
    img.setAttribute('aria-hidden', 'true');
    img.style.left = `${point.x - bounds.left}px`;
    img.style.top = `${point.y - bounds.top}px`;
    img.style.setProperty('--tilt', `${sequence % 2 ? -12 : 10}deg`);
    node.append(img);
    children.add(img);
    if (children.size > 6) {
      const oldest = children.values().next().value;
      oldest.remove();
      children.delete(oldest);
    }
    img.addEventListener(
      'animationend',
      () => {
        img.remove();
        children.delete(img);
      },
      { once: true },
    );
  }
  const clear = () => {
    children.forEach((img) => img.remove());
    children.clear();
    last = null;
  };
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerleave', clear);
  media.addEventListener('change', clear);
  return {
    destroy() {
      clear();
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', clear);
      media.removeEventListener('change', clear);
    },
  };
}

export function drawingTrail(node) {
  const media = matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );
  const canvas = document.createElement('canvas');
  canvas.className = 'drawing-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  node.append(canvas);
  const ctx = canvas.getContext('2d');
  let points = [],
    frame = 0;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio, 2);
    canvas.width = node.clientWidth * ratio;
    canvas.height = node.clientHeight * ratio;
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(node);
  function paint(now) {
    if (!ctx) return;
    ctx.clearRect(0, 0, node.clientWidth, node.clientHeight);
    points = points.filter((point) => now - point.time < 650);
    for (let i = 1; i < points.length; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(237,90,58,${1 - (now - points[i].time) / 650})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.moveTo(points[i - 1].x, points[i - 1].y);
      ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
    }
    frame = points.length ? requestAnimationFrame(paint) : 0;
  }
  function move(event) {
    if (!media.matches) return;
    const rect = node.getBoundingClientRect();
    points.push({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      time: performance.now(),
    });
    if (!frame) frame = requestAnimationFrame(paint);
  }
  function clear() {
    points = [];
    cancelAnimationFrame(frame);
    frame = 0;
    ctx?.clearRect(0, 0, node.clientWidth, node.clientHeight);
  }
  node.addEventListener('pointermove', move);
  media.addEventListener('change', clear);
  return {
    destroy() {
      clear();
      ro.disconnect();
      canvas.remove();
      node.removeEventListener('pointermove', move);
      media.removeEventListener('change', clear);
    },
  };
}
