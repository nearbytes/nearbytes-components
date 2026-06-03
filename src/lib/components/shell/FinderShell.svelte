<script lang="ts">
  import { Resizable } from 'nearbytes-widgets';
  import SourcesPanel from '../sources/SourcesPanel.svelte';
  import FileBrowser from '../files/FileBrowser.svelte';
  import FileInspector from '../files/FileInspector.svelte';
  import { useAppState } from '../../context.js';

  const app = useAppState();
</script>

<Resizable.PaneGroup direction="horizontal" class="h-full min-h-0 flex-1">
  <Resizable.Pane defaultSize={22} minSize={16} maxSize={34}>
    <SourcesPanel />
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={48} minSize={28}>
    <FileBrowser files={app.files} hubLabel={app.activeHub} />
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={30} minSize={20} maxSize={44}>
    <FileInspector files={app.files} />
  </Resizable.Pane>
</Resizable.PaneGroup>
