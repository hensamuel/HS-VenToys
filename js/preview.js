function setupInteract(instance) {
  // Menu
  interact('#menu-element').draggable({
    listeners: {
      move(event) {
        const dx = (event.dx / instance.scaledWidth) * 100;
        const dy = (event.dy / instance.scaledHeight) * 100;
        instance.theme.menu.left = Math.max(0, Math.min(100, instance.theme.menu.left + dx));
        instance.theme.menu.top = Math.max(0, Math.min(100, instance.theme.menu.top + dy));
        instance.$nextTick(() => {});
      }
    }
  }).resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        let { left, top, width, height } = instance.theme.menu;
        const scaleX = 100 / instance.scaledWidth;
        const scaleY = 100 / instance.scaledHeight;
        if (event.edges.left) { const delta = event.dx * scaleX; left += delta; width -= delta; }
        if (event.edges.right) { width += event.dx * scaleX; }
        if (event.edges.top) { const delta = event.dy * scaleY; top += delta; height -= delta; }
        if (event.edges.bottom) { height += event.dy * scaleY; }
        instance.theme.menu.left = Math.max(0, Math.min(100, left));
        instance.theme.menu.top = Math.max(0, Math.min(100, top));
        instance.theme.menu.width = Math.max(5, Math.min(100, width));
        instance.theme.menu.height = Math.max(5, Math.min(100, height));
      }
    }
  });

  // Progress Bar
  if (instance.theme.progressBar.enabled) {
    setupProgressInteract(instance);
  }
  instance.$watch('theme.progressBar.enabled', (val) => {
    if (val) setupProgressInteract(instance);
  });

  function setupProgressInteract(instance) {
    const el = document.getElementById('progress-element');
    if (!el) return;
    interact(el).draggable({
      listeners: {
        move(event) {
          const dx = (event.dx / instance.scaledWidth) * 100;
          const dy = (event.dy / instance.scaledHeight) * 100;
          instance.theme.progressBar.left = Math.max(0, Math.min(100, instance.theme.progressBar.left + dx));
          instance.theme.progressBar.top = Math.max(0, Math.min(100, instance.theme.progressBar.top + dy));
        }
      }
    }).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          let { left, top, width, height } = instance.theme.progressBar;
          const scaleX = 100 / instance.scaledWidth;
          const scaleY = 100 / instance.scaledHeight;
          if (event.edges.left) { left += event.dx * scaleX; width -= event.dx * scaleX; }
          if (event.edges.right) { width += event.dx * scaleX; }
          if (event.edges.top) { top += event.dy * scaleY; height -= event.dy * scaleY; }
          if (event.edges.bottom) { height += event.dy * scaleY; }
          instance.theme.progressBar.left = Math.max(0, Math.min(100, left));
          instance.theme.progressBar.top = Math.max(0, Math.min(100, top));
          instance.theme.progressBar.width = Math.max(2, Math.min(100, width));
          instance.theme.progressBar.height = Math.max(4, Math.min(200, height));
        }
      }
    });
  }

  setupLabelsDraggable(instance);
  instance.$watch('theme.labels.length', () => {
    instance.$nextTick(() => setupLabelsDraggable(instance));
  });
}

function setupLabelsDraggable(instance) {
  instance.theme.labels.forEach(label => {
    const id = `#label-${label.id}`;
    const el = document.querySelector(id);
    if (!el) return;
    interact(id).unset();
    interact(id).draggable({
      listeners: {
        move(event) {
          const dx = (event.dx / instance.scaledWidth) * 100;
          const dy = (event.dy / instance.scaledHeight) * 100;
          label.left = Math.max(0, Math.min(100, label.left + dx));
          label.top = Math.max(0, Math.min(100, label.top + dy));
        }
      }
    });
  });
}
