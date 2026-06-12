<script lang="ts">
  import { Resizable, Icon } from 'nearbytes-widgets';
  import { Boxes } from '@lucide/svelte';
  import { useAppState } from '../../context.js';
  import ProfileSelector from '../profile/ProfileSelector.svelte';
  import FinderShell from './FinderShell.svelte';
  import ChatPane from '../chat/ChatPane.svelte';
  import StatusBar from './StatusBar.svelte';

  const app = useAppState();
</script>

<div class="flex h-full min-h-0 w-full flex-col overflow-hidden bg-nb-bg font-sans text-nb-text antialiased">
  <header
    class="titlebar flex h-[52px] shrink-0 items-center border-b border-nb-hairline bg-nb-sidebar/95 backdrop-blur-2xl"
  >
    <!-- macOS hiddenInset traffic lights (~78px); keep title out of this zone -->
    <div class="titlebar-drag titlebar-traffic w-[78px] shrink-0" aria-hidden="true"></div>
    <div class="titlebar-drag flex min-w-0 flex-1 items-center gap-2 px-1">
      <span class="flex size-6 items-center justify-center rounded-md bg-nb-accent/15 text-nb-accent">
        <Icon glyph={Boxes} size={15} />
      </span>
      <span class="text-[15px] font-semibold tracking-tight text-nb-text">NearBytes</span>
    </div>
    <div class="titlebar-no-drag shrink-0 pr-4">
      <ProfileSelector />
    </div>
  </header>

  <main class="flex min-h-0 flex-1 overflow-hidden">
    <Resizable.PaneGroup direction="horizontal" class="h-full min-h-0 w-full flex-1">
      <Resizable.Pane defaultSize={72} minSize={50}>
        <FinderShell />
      </Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane defaultSize={28} minSize={20} maxSize={45}>
        <ChatPane
          chat={app.chat}
          timeline={app.timeline}
          hubLabel={app.activeHub}
          ownKey={app.identity.publicKey}
        />
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </main>

  <StatusBar status={app.status} peerId={app.identity.peerId} />
</div>
