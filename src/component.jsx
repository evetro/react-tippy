import React from 'react';
import ReactDOM from 'react-dom';

import Tippy from './js/tippy';
import { Browser } from './js/core/globals';
import { CONTENT } from './selectors.ts'

const defaultProps = {
  animateFill: true,
  animation: 'shift',
  appendTo: () => document.body,
  arrow: false,
  arrowSize: 'regular',
  children: undefined,
  className: '',
  delay: 0,
  disabled: false,
  distance: 10,
  duration: 375,
  followCursor: false,
  hideDelay: 0,
  hideDuration: 375,
  hideOnClick: true,
  hideOnScroll: false,
  html: null,
  inertia: false,
  interactive: false,
  interactiveBorder: 2,
  multiple: false,
  offset: 0,
  onHidden: () => {},
  onHide: () => {},
  onRequestClose: () => {},
  onShow: () => {},
  onShown: () => {},
  open: false,
  popperOptions: {},
  position: 'top',
  size: 'regular',
  sticky: false,
  stickyDuration: 200,
  style: {},
  tabIndex: undefined,
  tag: 'div',
  theme: 'dark',
  title: undefined,
  touchHold: false,
  trigger: 'mouseenter focus',
  unmountHTMLWhenHide: false,
  zIndex: 9999
};

const propKeys = Object.keys(defaultProps);

const noBrowser = () => (
  typeof window === 'undefined' || typeof document === 'undefined'
)

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
    this.renderReactDom = this._renderReactDom.bind(this);
    this.unmountReactDom = this._unmountReactDom.bind(this);
  }

  componentDidMount() {
    if (noBrowser()) {
      return;
    }
    this.initTippy();
  }

  componentWillUnmount() {
    if (noBrowser()) {
      return;
    }
    this.destroyTippy();
  }

  componentDidUpdate(prevProps) {
    if (noBrowser()) {
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
    if (noBrowser()) {
      return;
    }
    if (this.tippy) {
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      setTimeout(() => this.tippy.show(popper, this.props.duration), 0);
    }
  }

  _hideTooltip() {
    if (noBrowser()) {
      return;
    }
    if (this.tippy) {
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      setTimeout(() => { this.tippy.hide(popper, this.props.hideDuration); }, 0);
    }
  }

  _updateSettings(name, value) {
    if (noBrowser()) {
      return;
    }
    if (this.tippy) {
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      this.tippy.updateSettings(popper, name, value);
    }
  }

  _updateReactDom() {
    if (noBrowser()) {
      return;
    }
    if (this.tippy) {
      this.updateSettings('reactDOM', this.props.html);
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      const isVisible = popper.style.visibility === 'visible' || this.props.open;
      if (isVisible) {
        ReactDOM.render(
          this.props.html,
          popper.querySelector(CONTENT)
        );
      }
    }
  }

  _renderReactDom(popper) {
    if (this.props.html) {
      ReactDOM.render(
        this.props.html,
        popper.querySelector(CONTENT)
      );
    }
  }

  _unmountReactDom(content) {
    if (this.props.html) {
      ReactDOM.unmountComponentAtNode(content)
    }
  }

  _updateTippy() {
    if (noBrowser()) {
      return;
    }
    if (this.tippy) {
      const popper = this.tippy.getPopperElement(this.tooltipDOM);
      this.tippy.update(popper);
    }
  }

  _initTippy() {
      if (noBrowser() || !Browser.SUPPORTED) {
      return;
    }
    if (!this.props.disabled) {
      if (this.props.title) {
        this.tooltipDOM.setAttribute('title', this.props.title);
      }

      this.tippy = new Tippy(this.tooltipDOM, {
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
        html: undefined,
        useVirtualDom: Boolean(this.props.html),
        renderVirtualDom: this.renderReactDom,
        unmountFromVirtualDom: this.unmountReactDom
      })

      if (this.props.open) {
        this.showTooltip();
      }
    } else {
      this.tippy = null;
    }
  }

  _destroyTippy() {
    if (noBrowser()) {
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
    const Tag = this.props.tag;
    return (
      <Tag
        ref={(tooltip) =>
          { this.tooltipDOM = tooltip; }}
          title={this.props.title}
          className={this.props.className}
          tabIndex={this.props.tabIndex}
          style={{ display: 'inline', ...this.props.style }}
        >
          {this.props.children}
      </Tag>
    );
  }
}

Tooltip.defaultProps = defaultProps;

export default Tooltip;
