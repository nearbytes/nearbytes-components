<script lang="ts">
  import { Resizable } from 'nearbytes-widgets';
  import SourcesPanel from '../sources/SourcesPanel.svelte';
  import FileBrowser from '../files/FileBrowser.svelte';
  import FileInspector from '../files/FileInspector.svelte';
  import { useAppState } from '../../context.js';

  // Finder-like file manager shell: sources · browser · inspector.
  const app = useAppState();
</script>

<Resizable.PaneGroup direction="horizontal" class="h-full">
  <Resizable.Pane defaultSize={20} minSize={14} maxSize={32}>
    <SourcesPanel />
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={52} minSize={30}>
    <FileBrowser files={app.files} />
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={28} minSize={18} maxSize={40}>
    <FileInspector files={app.files} />
  </Resizable.Pane>
</Resizable.PaneGroup>
