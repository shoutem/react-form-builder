import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { SketchPicker } from 'react-color';
import { FontIcon } from '@shoutem/react-web-ui';
import _ from 'lodash';
import colorString from 'color-string';
import LOCALIZATION from './localization';
import './style.scss';

const DEFAULT_COLOR = '#fff';

function rgbArrayToObject(rgba) {
  if (!rgba) {
    return null;
  }

  return {
    r: rgba[0],
    g: rgba[1],
    b: rgba[2],
    a: rgba[3],
  };
}

function rgbObjectToArray(rgba) {
  if (!rgba) {
    return null;
  }

  return [
    _.isNumber(rgba.r) ? rgba.r : 255,
    _.isNumber(rgba.g) ? rgba.g : 255,
    _.isNumber(rgba.b) ? rgba.b : 255,
    _.isNumber(rgba.a) ? rgba.a : 1,
  ];
}

function createColorPickerText(color) {
  if (!color) {
    return i18next.t(LOCALIZATION.UNDEFINED_COLOR);
  }

  const hexColor = colorString.to.hex(color);
  if (!hexColor) {
    return i18next.t(LOCALIZATION.INVALID_COLOR);
  }

  const hexColorText = hexColor.substring(1);
  const alpha = color[3];

  if (alpha === 1) {
    return hexColorText;
  }

  const alphaText = `(${_.round(alpha * 100, 2)}%)`;
  return `${hexColorText} ${alphaText}`;
}

export default class ColorPicker extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { value } = this.props;
    const color = value || DEFAULT_COLOR;

    this.state = {
      displayColorPicker: false,
      color: colorString.get.rgb(color),
    };
  }

  componentDidUpdate() {
    const popover = this.refs.colorPickerPopover;

    if (popover) {
      this.repositionPopover(popover);
    }
  }

  handleColorPickerClick() {
    this.setState({ displayColorPicker: true });
  }

  handleColorPickerChange(colorObj) {
    const { onChange, name } = this.props;
    const color = rgbObjectToArray(colorObj.rgb);
    this.setState({ color });

    const colorRgba = colorString.to.rgb(color);
    onChange(colorRgba, name);
  }

  handleColorPickerClose() {
    this.setState({ displayColorPicker: false });
  }

  repositionPopover(popover) {
    const doc = document.querySelector('html');
    const documentBounds = doc.getBoundingClientRect();
    const picker = this.refs.colorPicker;
    const pickerBounds = picker.getBoundingClientRect();

    popover.style.setProperty('top', `${pickerBounds.top}px`);
    const popoverBounds = popover.getBoundingClientRect();

    if (documentBounds.bottom < popoverBounds.bottom) {
      const topOffset = pickerBounds.bottom - popoverBounds.height;
      popover.style.setProperty('top', `${topOffset}px`);
    }

    if (documentBounds.right < popoverBounds.right) {
      const leftOffset =
        pickerBounds.left + pickerBounds.width - popoverBounds.width;
      popover.style.setProperty('left', `${leftOffset}px`);
    }
  }

  render() {
    const { color } = this.state;

    const colorPickerText = createColorPickerText(color);
    const swatchColor = {
      backgroundColor: colorString.to.rgb(color),
    };

    return (
      <div className="color-picker" ref="colorPicker">
        {this.state.displayColorPicker && (
          <div className="color-picker__popover" ref="colorPickerPopover">
            <div
              className="color-picker__cover"
              onClick={this.handleColorPickerClose}
            ></div>
            <SketchPicker
              color={rgbArrayToObject(color)}
              onChange={this.handleColorPickerChange}
            />
          </div>
        )}
        <div
          className="color-picker__input"
          onClick={this.handleColorPickerClick}
        >
          <div className="color-picker__swatch" style={swatchColor}></div>
          {this.props.displayColorValue && (
            <span className="color-picker__text">{colorPickerText}</span>
          )}
          <FontIcon name="sortarrowdown" size="11.5px" />
        </div>
      </div>
    );
  }
}

ColorPicker.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  displayColorValue: PropTypes.bool,
};

ColorPicker.defaultProps = {
  value: DEFAULT_COLOR,
  displayColorValue: false,
};
