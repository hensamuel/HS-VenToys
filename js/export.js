function generateThemeTxt(theme) {
  let txt = `# Tema gerado pelo HS VenToys\n`;
  txt += `title-text: "${theme.name}"\n`;
  if (theme.resolution.auto) {
    txt += `desktop-image: "background.png"\n`; // ou omitir para auto
  } else {
    txt += `desktop-image: "background.png"\n`;
  }
  txt += `desktop-color: "${theme.background.color}"\n`;
  if (theme.font.custom && theme.font.filename) {
    txt += `loadfont "${theme.font.filename}"\n`;
  }

  // Menu
  txt += `\n+ boot_menu {\n`;
  txt += `    left = ${theme.menu.left}%\n`;
  txt += `    top = ${theme.menu.top}%\n`;
  txt += `    width = ${theme.menu.width}%\n`;
  txt += `    height = ${theme.menu.height}%\n`;
  txt += `    item_color = "${theme.menu.item_color}"\n`;
  txt += `    selected_item_color = "${theme.menu.selected_item_color}"\n`;
  txt += `    item_height = ${theme.menu.item_height}\n`;
  txt += `    item_padding = ${theme.menu.item_padding}\n`;
  txt += `    item_spacing = ${theme.menu.item_spacing}\n`;
  txt += `    icon_width = ${theme.menu.icon_width}\n`;
  txt += `    icon_height = ${theme.menu.icon_height}\n`;
  txt += `    item_icon_space = ${theme.menu.item_icon_space}\n`;
  txt += `    scrollbar = ${theme.menu.scrollbar}\n`;
  txt += `    scrollbar_width = ${theme.menu.scrollbar_width}\n`;
  txt += `    circular_menu = ${theme.menu.circular}\n`;
  txt += `}\n`;

  // Progress bar
  if (theme.progressBar.enabled) {
    txt += `\n+ progress_bar {\n`;
    txt += `    id = "__timeout__"\n`;
    txt += `    left = ${theme.progressBar.left}%\n`;
    txt += `    top = ${theme.progressBar.top}%\n`;
    txt += `    width = ${theme.progressBar.width}%\n`;
    txt += `    height = ${theme.progressBar.height}\n`;
    txt += `    fg_color = "${theme.progressBar.fg_color}"\n`;
    txt += `    bg_color = "${theme.progressBar.bg_color}"\n`;
    txt += `    border_color = "${theme.progressBar.border_color}"\n`;
    txt += `    show_text = ${theme.progressBar.show_text}\n`;
    if (theme.progressBar.show_text) {
      txt += `    text = "${theme.progressBar.text}"\n`;
      txt += `    text_color = "${theme.progressBar.text_color}"\n`;
    }
    txt += `}\n`;
  }

  // Labels
  theme.labels.forEach((label, i) => {
    txt += `\n+ label {\n`;
    txt += `    text = "${label.text}"\n`;
    txt += `    left = ${label.left}%\n`;
    txt += `    top = ${label.top}%\n`;
    txt += `    color = "${label.color}"\n`;
    txt += `    font_size = ${label.size}\n`;
    txt += `    align = "${label.align}"\n`;
    txt += `}\n`;
  });

  // Timeout message
  if (theme.timeout.enabled) {
    txt += `\n+ vmessage {\n`;
    txt += `    id = "__timeout__"\n`;
    txt += `    text = "${theme.timeout.text}"\n`;
    txt += `    left = ${theme.timeout.left}%\n`;
    txt += `    top = ${theme.timeout.top}%\n`;
    txt += `    color = "${theme.timeout.color}"\n`;
    txt += `}\n`;
  }

  return txt;
}

function exportThemeToZip(theme) {
  const zip = new JSZip();
  const folder = theme.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'tema';
  const base = `ventoy/theme/${folder}/`;

  // theme.txt
  zip.file(base + 'theme.txt', generateThemeTxt(theme));

  // Background
  if (theme.background.data) {
    const bg = theme.background.data.split(',')[1];
    zip.file(base + 'background.png', bg, { base64: true });
  }

  // Ícones
  if (theme.icons.length) {
    const iconFolder = base + 'icons/';
    theme.icons.forEach(icon => {
      if (icon.data && icon.name) {
        zip.file(iconFolder + icon.name, icon.data.split(',')[1], { base64: true });
      }
    });
  }

  // Fonte
  if (theme.font.custom && theme.font.data) {
    zip.file(base + theme.font.filename, theme.font.data.split(',')[1], { base64: true });
  }

  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, `${folder}-ventoy-theme.zip`);
  });
}

function generateVentoyJson(theme) {
  const folder = theme.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'tema';
  const json = {
    theme: {
      file: `ventoy/theme/${folder}/theme.txt`,
      gfxmode: theme.resolution.auto ? "auto" : `${theme.resolution.width}x${theme.resolution.height}`
    }
  };
  if (theme.font.custom && theme.font.filename) {
    json.theme.font = [`ventoy/theme/${folder}/${theme.font.filename}`];
  }
  if (theme.icons.length) {
    json.theme.icons = theme.icons.map(icon => ({
      class: icon.class,
      file: `ventoy/theme/${folder}/icons/${icon.name}`
    }));
  }
  return json;
}

function exportVentoyJsonFile(theme) {
  const json = generateVentoyJson(theme);
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  saveAs(blob, 'ventoy.json');
}
