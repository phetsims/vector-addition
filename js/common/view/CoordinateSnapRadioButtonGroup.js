// Copyright 2019-2023, University of Colorado Boulder

/**
 * Radio button group for switching between polar and Cartesian snap modes.
 *
 * See https://github.com/phetsims/vector-addition/issues/21 for a visual.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import vectorAddition from '../../vectorAddition.js';
import CoordinateSnapModes from '../model/CoordinateSnapModes.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';

export default class CoordinateSnapRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<CoordinateSnapModes>} coordinateSnapModeProperty
   * @param {VectorColorPalette} cartesianVectorColorPalette
   * @param {VectorColorPalette} polarVectorColorPalette
   * @param {Object} [options]
   */
  constructor( coordinateSnapModeProperty, cartesianVectorColorPalette, polarVectorColorPalette, options ) {

    assert && assert( coordinateSnapModeProperty instanceof EnumerationProperty && CoordinateSnapModes.enumeration.includes( coordinateSnapModeProperty.value ),
      `invalid coordinateSnapModeProperty: ${coordinateSnapModeProperty}` );
    assert && assert( cartesianVectorColorPalette instanceof VectorColorPalette, `invalid cartesianVectorColorPalette: ${cartesianVectorColorPalette}` );
    assert && assert( polarVectorColorPalette instanceof VectorColorPalette, `invalid polarVectorColorPalette: ${polarVectorColorPalette}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, options );

    // Create the description of the buttons
    const content = [
      {
        value: CoordinateSnapModes.CARTESIAN,
        createNode: () => VectorAdditionIconFactory.createCartesianSnapModeIcon( cartesianVectorColorPalette )
      },
      {
        value: CoordinateSnapModes.POLAR,
        createNode: () => VectorAdditionIconFactory.createPolarSnapModeIcon( polarVectorColorPalette )
      }
    ];

    super( coordinateSnapModeProperty, content, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'CoordinateSnapRadioButtonGroup is not intended to be disposed' );
  }
}

vectorAddition.register( 'CoordinateSnapRadioButtonGroup', CoordinateSnapRadioButtonGroup );