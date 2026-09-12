import React from 'react';
import { IntlContext } from 'react-intl-original';

export * from 'react-intl-original';

// React Intl 10 removed this HOC. Keep the existing class components working
// while the application is migrated to hooks.
export function injectIntl(WrappedComponent) {
  function InjectIntl(props) {
    const intl = React.useContext(IntlContext);
    return React.createElement(WrappedComponent, {...props, intl: intl});
  }

  InjectIntl.displayName = `injectIntl(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return InjectIntl;
}
