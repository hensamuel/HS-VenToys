document.addEventListener('alpine:init', () => {
  Alpine.data('themeBuilder', () => ({
    theme: {
      name: 'Meu Tema',
      resolution: { auto: true, width: 1920, height: 1080 },
      background: { data: null, mode: 'stretch', color: '#000000' },
      menu: {
        visible: true,
        left: 30, top: 20, width: 40, height: 60,
        item_color: '#cccccc', selected_item_color: '#ffffff',
        item_height: 24, item_padding: 8, item_spacing: 4,
        icon_width: 32, icon_height: 32, item_icon_space: 10,
        scrollbar: true, scrollbar_width: 10,
        circular: false
      },
      progressBar: {
        enabled: false,
        left: 35, top: 85, width: 30, height: 10,
        fg_color: '#00ff00', bg_color: '#333333', border_color: '#ffffff',
        show_text: false, text: 'Carregando...', text_color: '#ffffff'
      },
      labels: [],
      icons: [],
      font: { custom: false, data: null, filename: '' },
      timeout: { enabled: false, text: 'Inicializando em %d segundos...', color: '#ffffff', left: 10, top: 5 }
    },
    selectedElement: null,
    selectedLabelId: null,
    activeTab: 'elements',
    showTemplates: false,

    // Histórico
    history: [],
    historyIndex: -1,
    maxHistory: 50,

    init() {
      this.pushHistory();
      this.$watch('theme', () => this.pushHistory(), { deep: true });
      this.$nextTick(() => setupInteract(this));
      const saved = localStorage.getItem('hs-ventoys-theme');
      if (saved) {
        try { this.theme = JSON.parse(saved); } catch(e){}
      }
    },

    // Computed
    get scaledWidth() {
      const maxWidth = window.innerWidth * 0.6;
      const scale = Math.min(1, maxWidth / this.theme.resolution.width);
      return this.theme.resolution.width * scale;
    },
    get scaledHeight() {
      const maxHeight = window.innerHeight * 0.8;
      const scale = Math.min(1, maxHeight / this.theme.resolution.height);
      return this.theme.resolution.height * scale;
    },
    get previewBg() {
      if (this.theme.background.data) {
        const modeMap = { stretch: '100% 100%', aspect: 'contain', center: 'auto' };
        return `url(${this.theme.background.data}) ${modeMap[this.theme.background.mode]} no-repeat center center`;
      }
      return this.theme.background.color;
    },
    get selectedLabel() {
      if (this.selectedLabelId) {
        return this.theme.labels.find(l => l.id == this.selectedLabelId);
      }
      return null;
    },

    // Ações
    selectElement(type, id = null) {
      if (type === 'label' && id) {
        this.selectedElement = 'label-' + id;
        this.selectedLabelId = id;
      } else {
        this.selectedElement = type;
        this.selectedLabelId = null;
      }
    },
    addLabel() {
      this.theme.labels.push({ id: Date.now(), text: 'Novo texto', left: 10, top: 90, color: '#ffffff', size: 14, align: 'left' });
      this.$nextTick(() => setupLabelsDraggable(this));
    },
    removeLabel(id) {
      this.theme.labels = this.theme.labels.filter(l => l.id != id);
      if (this.selectedElement === 'label-' + id) this.selectedElement = null;
      this.$nextTick(() => setupLabelsDraggable(this));
    },
    addIcon() { this.theme.icons.push({ class: '', name: '', data: null }); },
    removeIcon(index) { this.theme.icons.splice(index, 1); },
    handleBgUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => this.theme.background.data = ev.target.result;
      reader.readAsDataURL(file);
    },
    handleFontUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.theme.font.filename = file.name;
      const reader = new FileReader();
      reader.onload = ev => this.theme.font.data = ev.target.result;
      reader.readAsDataURL(file);
    },
    handleIconUpload(index, e) {
      const file = e.target.files[0];
      if (!file) return;
      this.theme.icons[index].name = file.name;
      const reader = new FileReader();
      reader.onload = ev => this.theme.icons[index].data = ev.target.result;
      reader.readAsDataURL(file);
    },
    newProject() {
      if (confirm('Isso apagará as alterações não salvas. Continuar?')) {
        localStorage.removeItem('hs-ventoys-theme');
        location.reload();
      }
    },
    saveProject() {
      localStorage.setItem('hs-ventoys-theme', JSON.stringify(this.theme));
      alert('Projeto salvo!');
    },
    loadProject() {
      const saved = localStorage.getItem('hs-ventoys-theme');
      if (saved) { this.theme = JSON.parse(saved); alert('Projeto carregado.'); }
      else alert('Nenhum projeto salvo.');
    },
    openTemplates() { this.showTemplates = true; },
    loadTemplate(type) {
      const defaults = {
        default: {
          name: 'Padrão', resolution: { auto: false, width: 1920, height: 1080 },
          background: { data: null, mode: 'stretch', color: '#1a1a2e' },
          menu: { visible: true, left: 25, top: 25, width: 50, height: 50, item_color: '#e0e0e0', selected_item_color: '#00d2ff', item_height: 28, item_padding: 10, item_spacing: 5, icon_width: 32, icon_height: 32, item_icon_space: 10, scrollbar: true, scrollbar_width: 10, circular: false },
          progressBar: { enabled: true, left: 30, top: 80, width: 40, height: 12, fg_color: '#00d2ff', bg_color: '#333', border_color: '#555', show_text: true, text: 'Carregando... %d%%', text_color: '#fff' },
          labels: [], icons: [], font: { custom: false, data: null, filename: '' },
          timeout: { enabled: true, text: 'Inicializando em %d segundos...', color: '#aaa', left: 5, top: 5 }
        },
        minimal: {
          name: 'Minimalista', resolution: { auto: true, width: 1920, height: 1080 },
          background: { data: null, mode: 'center', color: '#000' },
          menu: { visible: true, left: 40, top: 40, width: 20, height: 30, item_color: '#888', selected_item_color: '#fff', item_height: 20, item_padding: 4, item_spacing: 2, icon_width: 24, icon_height: 24, item_icon_space: 5, scrollbar: false, scrollbar_width: 8, circular: true },
          progressBar: { enabled: false }, labels: [], icons: [], font: { custom: false }, timeout: { enabled: false }
        },
        gamer: {
          name: 'Gamer', resolution: { auto: false, width: 1920, height: 1080 },
          background: { data: null, mode: 'stretch', color: '#0d0d0d' },
          menu: { visible: true, left: 20, top: 20, width: 30, height: 70, item_color: '#ff0055', selected_item_color: '#00ff88', item_height: 30, item_padding: 12, item_spacing: 6, icon_width: 40, icon_height: 40, item_icon_space: 12, scrollbar: true, scrollbar_width: 12, circular: true },
          progressBar: { enabled: true, left: 60, top: 85, width: 30, height: 8, fg_color: '#ff0055', bg_color: '#1a1a1a', border_color: '#ff0055', show_text: false },
          labels: [], icons: [], font: { custom: false }, timeout: { enabled: true, text: '>> %d <<', color: '#ff0055', left: 5, top: 5 }
        }
      };
      this.theme = JSON.parse(JSON.stringify(defaults[type]));
      this.showTemplates = false;
      this.$nextTick(() => setupInteract(this));
    },

    // Undo/Redo
    pushHistory() {
      const state = JSON.stringify(this.theme);
      if (this.history[this.historyIndex] === state) return;
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(state);
      if (this.history.length > this.maxHistory) this.history.shift();
      this.historyIndex = this.history.length - 1;
    },
    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.theme = JSON.parse(this.history[this.historyIndex]);
      }
    },
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.theme = JSON.parse(this.history[this.historyIndex]);
      }
    },

    // Exportações (chamadas dos botões)
    exportZip() { exportThemeToZip(this.theme); },
    exportVentoyJson() { exportVentoyJsonFile(this.theme); }
  }));
});
