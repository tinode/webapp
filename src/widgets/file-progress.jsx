// File uload/download progress indicator with a cancel inside.
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class FileProgress extends React.PureComponent {
  render() {
    return (
      <div className="uploader">
        <div><span style={{width: (this.props.progress * 100) + "%"}}></span></div>
        {this.props.progress < 0.999 ?
          <a href="#" onClick={(e) => {e.preventDefault(); this.props.onCancel();}}>
            <i className="material-icons">close</i> <FormattedMessage id="action_cancel"
              defaultMessage="cancel" description="Call to action [cancel]" />
          </a>
          :
          <FormattedMessage id="upload_finishing" defaultMessage="finishing..."
            description="Notification that upload is finishing" />
        }
      </div>
    );
  }
}
