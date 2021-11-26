// Copyright 2019-2020, University of Colorado Boulder

/**
 * VectorCheckbox is a checkbox that is labeled with a vector symbol and vector arrow.
 * It's used to control the visibility of the sum ('c' or 'f') vector in the Equations screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { LayoutBox } from '../../../../scenery/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';

class VectorCheckbox extends VectorAdditionCheckbox {

  /**
   * @param {BooleanProperty} vectorVisibleProperty
   * @param {string} symbol
   * @param {Object} [options]
   */
  constructor( vectorVisibleProperty, symbol, options ) {

    // Type check arguments
    assert && assert( vectorVisibleProperty instanceof BooleanProperty, `invalid vectorVisibleProperty: ${vectorVisibleProperty}` );
    assert && assert( typeof symbol === 'string', `invalid symbol: ${symbol}` );

    options = merge( {
      vectorFill: Color.WHITE,
      vectorStroke: Color.BLACK
    }, options );

    const symbolNode = new ArrowOverSymbolNode( symbol, {
      maxWidth: 95 // determined empirically
    } );

    const icon = VectorAdditionIconFactory.createVectorIcon( {
      fill: options.vectorFill,
      stroke: options.vectorStroke,
      length: 35
    } );

    const content = new LayoutBox( {
      orientation: 'horizontal',
      spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
      children: [ symbolNode, icon ]
    } );

    super( content, vectorVisibleProperty, options );
  }
}

vectorAddition.register( 'VectorCheckbox', VectorCheckbox );
export default VectorCheckbox;