// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAdditionGridCheckbox is a specialization of common-code GridCheckbox, styled for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import GridCheckbox from '../../../../scenery-phet/js/GridCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class VectorAdditionGridCheckbox extends GridCheckbox {

  public constructor( gridVisibleProperty: Property<boolean>, tandem: Tandem ) {

    super( gridVisibleProperty, {
      boxWidth: VectorAdditionConstants.CHECKBOX_BOX_WIDTH,
      iconOptions: { size: 24 },
      accessibleName: VectorAdditionStrings.a11y.gridCheckbox.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionStrings.a11y.gridCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    this.touchArea = this.localBounds.dilatedXY( 5, 1 );
  }
}

vectorAddition.register( 'VectorAdditionGridCheckbox', VectorAdditionGridCheckbox );