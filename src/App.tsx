/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ConfigPanel from './components/ConfigPanel';
import RenderDashboard from './components/RenderDashboard';

export default function App() {
  return (
    <div className="flex h-screen w-full bg-neutral-950 font-sans overflow-hidden">
      <RenderDashboard />
      <div className="w-[320px] shrink-0 border-l border-neutral-800 bg-neutral-900 z-10 relative">
        <ConfigPanel />
      </div>
    </div>
  );
}
