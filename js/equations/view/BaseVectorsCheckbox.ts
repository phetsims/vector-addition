// Copyright 2019-2025, University of Colorado Boulder

/**
 * BaseVectorsCheckbox is the checkbox used to control visibility of base vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionCheckbox from '../../common/view/VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class BaseVectorsCheckbox extends VectorAdditionCheckbox {

  public constructor( baseVectorsVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette,
                      tandem: Tandem ) {

    const icon = VectorAdditionIconFactory.createVectorIcon( 50, {
      fill: vectorColorPalette.baseVectorFillProperty,
      stroke: vectorColorPalette.baseVectorStrokeProperty,
      lineWidth: VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS.lineWidth
    } );

    super( baseVectorsVisibleProperty, icon, {
      accessibleName: VectorAdditionStrings.a11y.baseVectorsCheckbox.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionStrings.a11y.baseVectorsCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'BaseVectorsCheckbox', BaseVectorsCheckbox );