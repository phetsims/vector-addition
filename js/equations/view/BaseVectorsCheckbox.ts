// Copyright 2019-2023, University of Colorado Boulder

/**
 * BaseVectorsCheckbox is the checkbox used to control visibility of base vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionCheckbox from '../../common/view/VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';
import Property from '../../../../axon/js/Property.js';

export default class BaseVectorsCheckbox extends VectorAdditionCheckbox {

  public constructor( baseVectorsVisibleProperty: Property<boolean>, vectorColorPalette: VectorColorPalette ) {

    const icon = VectorAdditionIconFactory.createVectorIcon( 50, {
      fill: vectorColorPalette.baseVectorFill,
      stroke: vectorColorPalette.baseVectorStroke,
      lineWidth: VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS.lineWidth
    } );

    super( baseVectorsVisibleProperty, icon );
  }
}

vectorAddition.register( 'BaseVectorsCheckbox', BaseVectorsCheckbox );