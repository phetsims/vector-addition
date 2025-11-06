// Copyright 2019-2025, University of Colorado Boulder

/**
 * BaseVectorsCheckbox is the checkbox used to control visibility of base vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class BaseVectorsCheckbox extends Checkbox {

  public constructor( baseVectorsVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette,
                      tandem: Tandem ) {

    const icon = VectorAdditionIconFactory.createVectorIcon( 50, {
      fill: vectorColorPalette.baseVectorFillProperty,
      stroke: vectorColorPalette.baseVectorStrokeProperty,
      lineWidth: VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS.lineWidth
    } );

    const options = combineOptions<CheckboxOptions>( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, {
      accessibleName: VectorAdditionStrings.a11y.baseVectorsCheckbox.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionStrings.a11y.baseVectorsCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    super( baseVectorsVisibleProperty, icon, options );
  }
}

vectorAddition.register( 'BaseVectorsCheckbox', BaseVectorsCheckbox );