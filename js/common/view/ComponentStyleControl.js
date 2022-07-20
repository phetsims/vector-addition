// Copyright 2019-2022, University of Colorado Boulder

/**
 * ComponentStyleControl is the control for selecting how to visually represent component vectors.
 * It consists of a labeled group of radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Brandon Li
 */

import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import { AlignBox, Text, VBox } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import vectorAdditionStrings from '../../vectorAdditionStrings.js';
import ComponentVectorStyles from '../model/ComponentVectorStyles.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentStyleRadioButtonGroup from './ComponentStyleRadioButtonGroup.js';

class ComponentStyleControl extends VBox {

  /**
   * @param {EnumerationDeprecatedProperty} componentStyleProperty - value of type ComponentVectorStyles
   * @param {Object} [options]
   */
  constructor( componentStyleProperty, options ) {

    assert && assert( componentStyleProperty instanceof EnumerationDeprecatedProperty && ComponentVectorStyles.includes( componentStyleProperty.value ),
      `invalid componentStyleProperty: ${componentStyleProperty}` );

    options = merge( {
      align: 'left',
      spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING,
      maxWidth: 200
    }, options );

    const children = [];

    // 'Components' label, left justified
    const componentsText = new Text( vectorAdditionStrings.components, {
      font: VectorAdditionConstants.TITLE_FONT,
      maxWidth: options.maxWidth
    } );
    children.push( componentsText );

    // Radio buttons, centered in maxWidth by using an AlignBox
    const componentStyleRadioButtonGroup = new ComponentStyleRadioButtonGroup( componentStyleProperty );
    children.push( new AlignBox( componentStyleRadioButtonGroup, {
      alignBounds: new Bounds2( 0, 0, options.maxWidth, componentStyleRadioButtonGroup.height )
    } ) );

    assert && assert( !options.children, 'ComponentStyleControl sets children' );
    options.children = children;

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ComponentStyleControl is not intended to be disposed' );
  }
}

vectorAddition.register( 'ComponentStyleControl', ComponentStyleControl );
export default ComponentStyleControl;