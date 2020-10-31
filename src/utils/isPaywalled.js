export default function isPaywalled () {
  if (window.location.search.includes('salesposter')) return true; // For easier testing
  // Hacky ...
  const test1 = window.__PRELOADED_STATE__
             && window.__PRELOADED_STATE__.page
             && window.__PRELOADED_STATE__.page.compositions
             && window.__PRELOADED_STATE__.page.compositions[0]
             && JSON.stringify(window.__PRELOADED_STATE__.page.compositions[0]).includes('salesposter');

  const test2 = window.__PRELOADED_STATE__
             && window.__PRELOADED_STATE__.location
             && window.__PRELOADED_STATE__.location.pathname
             && window.__PRELOADED_STATE__.location.pathname.includes('salesposter');
  // ... very hacky.
  return test1 || test2;
}
