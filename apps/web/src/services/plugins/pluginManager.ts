import { DomainContext } from '../contextDetectionService';
import { type DomainComponent, componentFactory } from '../componentFactory';

export interface ComponentPlugin {
  domain: DomainContext;
  components: Record<string, DomainComponent>;
  initialize: () => void;
}

class PluginManager {
  private plugins: ComponentPlugin[] = [];

  registerPlugin(plugin: ComponentPlugin): void {
    this.plugins.push(plugin);
    plugin.initialize();
  }

  getPlugins(): ComponentPlugin[] {
    return [...this.plugins];
  }
}

export const pluginManager = new PluginManager();

// Example of a domain plugin
export const createDomainPlugin = (
  domain: DomainContext,
  components: Record<string, DomainComponent>,
): ComponentPlugin => {
  return {
    domain,
    components,
    initialize: () => {
      for (const [entityType, component] of Object.entries(components)) {
        componentFactory.registerComponent(domain, entityType, component);
      }
    },
  };
};
