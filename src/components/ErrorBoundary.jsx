import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[bobworld] render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="center">
          <div className="glassmorphism p-2 b-r-8 c-intro text-center">
            <h2 className="mt-h">Something broke the scene</h2>
            <p>{String(this.state.error?.message || this.state.error)}</p>
            <p>
              <button className="button mt-1" onClick={() => window.location.reload()}>
                Reload
              </button>
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
