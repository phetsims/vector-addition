// Copyright 2019-2023, University of Colorado Boulder

/**
 * BaseVectorsCheckbox is the checkbox used to control visibility of base vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionCheckbox from '../../common/view/VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';

export default class BaseVectorsCheckbox extends VectorAdditionCheckbox {

  /**
   * @param {BooleanProperty} baseVectorsVisibleProperty
   * @param {VectorColorPalette} vectorColorPalette
   * @param {Object} [options]
   */
  constructor( baseVectorsVisibleProperty, vectorColorPalette, options ) {

    // Type check arguments
    assert && assert( baseVectorsVisibleProperty instanceof BooleanProperty, `invalid baseVectorsVisibleProperty: ${baseVectorsVisibleProperty}` );
    assert && assert( vectorColorPalette instanceof VectorColorPalette, `invalid vectorColorPalette: ${vectorColorPalette}` );

    const icon = VectorAdditionIconFactory.createVectorIcon( {
      fill: vectorColorPalette.baseVectorFill,
      stroke: vectorColorPalette.baseVectorStroke,
      lineWidth: VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS.lineWidth,
      length: 50
    } );

    super( baseVectorsVisibleProperty, icon, options );
  }
}

vectorAddition.register( 'BaseVectorsCheckbox', BaseVectorsCheckbox );