import React from 'react'; // TODO put this as a dep dependency in this package, correct version will be installed in react-demo

import tippy from './js/tippy'; // TODO wrapper for this mutable object
import { Browser } from './js/core/globals'; // TODO wrapper for this mutable object

// TODO exported from tippy-package
const stopPortalEvent = e => e.stopPropagation();

// import Tippy, { dd } from '../tippy' // relative import for now 

const defaultProps = {
  html: null,
  position: 'top',
  animation: 'shift',
  animateFill: true,
  arrow: false,
  delay: 0,
  hideDelay: 0,
  trigger: 'mouseenter focus',
  duration: 375,
  hideDuration: 375,
  interactive: false,
  interactiveBorder: 2,
  theme: 'dark',
  offset: 0,
  hideOnClick: true,
  hideOnScroll: false,
  multiple: false,
  followCursor: false,
  inertia: false,
  popperOptions: {},
  onShow: () => {},
  onShown: () => {},
  onHide: () => {},
  onHidden: () => {},
  disabled: false,
  arrowSize: 'regular',
  size: 'regular',
  className: '',
  style: {},
  distance: 10,
  onRequestClose: () => {},
  appendTo: () => document.body,
  sticky: false,
  stickyDuration: 200,
  tag: 'div',
  touchHold: false,
  unmountHTMLWhenHide: false,
  zIndex: 9999
};

const propKeys = Object.keys(defaultProps);

class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.initTippy = this._initTippy.bind(this);
    this.destroyTippy = this._destroyTippy.bind(this);
    this.updateTippy = this._updateTippy.bind(this);
    this.updateReactDom = this._updateReactDom.bind(this);
    this.showTooltip = this._showTooltip.bind(this);
    this.hideTooltip = this._hideTooltip.bind(this);
    this.updateSettings = this._updateSettings.bind(this);

    this.state = {
      reactDOMValue: null,
    }
  }

  componentDidMount() {
    if (typeof window === 'undefined' || typeof document === 'undefined' ) {
      return;
    }
    this.initTippy();
  }

  componentWillUnmount() {
    if (typeof window === 'undefined' || typeof document === 'undefined' ) {
      return;
    }
    this.destroyTippy();
  }

  componentDidUpdate(prevProps) {
    if (typeof window === 'undefined' || typeof document === 'undefined' ) {
      return;
    }

    if (this.props.disabled === false && prevProps.disabled === true) {
      this.updateSettings('disabled', false);
      this.destroyTippy();
      this.initTippy();
      return;
    }

    if (this.props.disabled === true && prevProps.disabled === false) {
      this.updateSettings('disabled', true);
      this.destroyTippy();
      return;
    }

    // open tooltip
    if (this.props.open === true && !prevProps.open) {
      this.updateSettings('open', true);
      setTimeout(() => {
        this.showTooltip();
      }, 0)
    }
    if (this.props.open === false && prevProps.open === true) {
      this.updateSettings('open', false);
      this.hideTooltip();
    }

    if (this.props.html !== prevProps.html) {
      this.updateReactDom();
    }

    // Update content
    if (this.props.title !== prevProps.title) {
      this.updateTippy();
    }

    // update tippy settings
    propKeys.forEach(key => {
      const propValue = this.props[key];
      if (propValue !== prevProps[key]) {
        this.updateSettings(key, propValue);
      }
    });
  }

  _showTooltip() {
    if (typeof window === 'undefined' || typeof document === 'undefined' ) {
      return;
    }
    if (this.tippy) {
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      setTimeout(() => this.tippy.show(popper, this.props.duration), 0);
    }
  }

  _hideTooltip() {
    if (typeof window === 'undefined' || typeof document === 'undefined' ) {
      return;
    }
    if (this.tippy) {
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      setTimeout(() => { this.tippy.hide(popper, this.props.hideDuration); }, 0);
    }
  }

  _updateSettings(name, value) {
    if (typeof window === 'undefined' || typeof document === 'undefined' ) {
      return;
    }
    if (this.tippy) {
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      this.tippy.updateSettings(popper, name, value);
    }
  }

  _updateReactDom() {
    if (typeof window === 'undefined' || typeof document === 'undefined' ) {
      return;
    }
    if (this.tippy) {
      this.updateSettings('reactDOM', this.props.html);
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      const isVisible = popper.style.visibility === 'visible' || this.props.open;
      if (isVisible) {
        this.tippy.updateForReact(popper, this.props.html);
      }
    }
  }

  _updateTippy() {
    if (typeof window === 'undefined' || typeof document === 'undefined' ) {
      return;
    }
    if (this.tippy) {
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      this.tippy.update(popper);
    }
  }

  _initTippy() {
      // TODO wrap this in an exported function in the new base package which may serve Vue and Svelte
      if (typeof window === 'undefined' || typeof document === 'undefined' || !Browser.SUPPORTED) {
      return;
    }
    if (!this.props.disabled) {
      if (this.props.title) {
        this.tooltipDOM.setAttribute('title', this.props.title);
      }

      // TODO new API for exported tooltip object
      this.tippy = tippy(this.tooltipDOM, {
        animation: this.props.animation,
        animateFill: this.props.animateFill,
        appendTo: this.props.appendTo,
        arrow: this.props.arrow,
        arrowSize: this.props.arrowSize,
        delay: this.props.delay,
        disabled: this.props.disabled,
        distance: this.props.distance,
        duration: this.props.duration,
        followCursor: this.props.followCursor,
        hideDelay: this.props.hideDelay,
        hideDuration: this.props.hideDuration,
        hideOnClick: this.props.hideOnClick,
        hideOnScroll: this.props.hideOnScroll,
        inertia: this.props.inertia,
        interactive: this.props.interactive,
        interactiveBorder: this.props.interactiveBorder,
        multiple: this.props.multiple,
        offset: this.props.offset,
        onHide: this.props.onHide,
        onHidden: this.props.onHidden,
        onRequestClose: this.props.onRequestClose,
        onShow: this.props.onShow,
        onShown: this.props.onShown,
        open: this.props.open,
        popperOptions: this.props.popperOptions,
        position: this.props.position,
        size: this.props.size,
        sticky: this.props.sticky,
        stickyDuration: this.props.stickyDuration,
        tag: this.props.tag,
        theme: this.props.theme,
        touchHold: this.props.touchHold,
        trigger: this.props.trigger,
        unmountHTMLWhenHide: this.props.unmountHTMLWhenHide,
        zIndex: this.props.zIndex,
        // not part of prop parameters - is this a constant?
        performance: true,
        // TODO leaking abstraction
        html: undefined, // ???
        setReactDOMValue: newReactDOM => this.setState({ reactDOMValue: newReactDOM }),
        reactDOM: this.props.html,
      })

      if (this.props.open) {
        this.showTooltip();
      }
    } else {
      this.tippy = null;
    }
  }

  _destroyTippy() {
    if (typeof window === 'undefined' || typeof document === 'undefined' ) {
      return;
    }
    if (this.tippy) {
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      this.updateSettings('open', false);
      this.tippy.hide(popper, 0);
      this.tippy.destroy(popper);
      this.tippy = null;
    }
  }

  render() {
    let {
      tag: Tag,
    } = this.props;

    return (
      <React.Fragment>
        <Tag
          ref={(tooltip) =>
            { this.tooltipDOM = tooltip; }}
            title={this.props.title}
            className={this.props.className}
            tabIndex={this.props.tabIndex}
            style={{
              display: 'inline',
                ...this.props.style
            }}
          >
            {this.props.children}

        </Tag>
        {this.state.reactDOMValue && (
          <div
            onClick={stopPortalEvent}
            onContextMenu={stopPortalEvent}
            onDoubleClick={stopPortalEvent}
            onDrag={stopPortalEvent}
            onDragEnd={stopPortalEvent}
            onDragEnter={stopPortalEvent}
            onDragExit={stopPortalEvent}
            onDragLeave={stopPortalEvent}
            onDragOver={stopPortalEvent}
            onDragStart={stopPortalEvent}
            onDrop={stopPortalEvent}
            onMouseDown={stopPortalEvent}
            onMouseEnter={stopPortalEvent}
            onMouseLeave={stopPortalEvent}
            onMouseMove={stopPortalEvent}
            onMouseOver={stopPortalEvent}
            onMouseOut={stopPortalEvent}
            onMouseUp={stopPortalEvent}

            onKeyDown={stopPortalEvent}
            onKeyPress={stopPortalEvent}
            onKeyUp={stopPortalEvent}

            onFocus={stopPortalEvent}
            onBlur={stopPortalEvent}

            onChange={stopPortalEvent}
            onInput={stopPortalEvent}
            onInvalid={stopPortalEvent}
            onSubmit={stopPortalEvent}
          >
            {this.state.reactDOMValue}
          </div>
        )}
      </React.Fragment>
    );
  }
}


Tooltip.defaultProps = defaultProps;

export default Tooltip;
