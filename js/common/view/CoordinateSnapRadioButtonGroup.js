// Copyright 2019, University of Colorado Boulder

/**
 * Radio button group for switching between polar and cartesian mode.
 *
 * See https://github.com/phetsims/vector-addition/issues/21 for a visual.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class CoordinateSnapRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty.<CoordinateSnapModes>} coordinateSnapModeProperty
     * @param {VectorColorPalette} cartesianVectorColorPalette
     * @param {VectorColorPalette} polarVectorColorPalette
     * @param {Object} [options]
     */
    constructor( coordinateSnapModeProperty, cartesianVectorColorPalette, polarVectorColorPalette, options ) {

      assert && assert( coordinateSnapModeProperty instanceof EnumerationProperty
      && CoordinateSnapModes.includes( coordinateSnapModeProperty.value ),
        `invalid coordinateSnapModeProperty: ${coordinateSnapModeProperty}` );
      assert && assert( cartesianVectorColorPalette instanceof VectorColorPalette,
        `invalid cartesianVectorColorPalette: ${cartesianVectorColorPalette}` );
      assert && assert( polarVectorColorPalette instanceof VectorColorPalette,
        `invalid polarVectorColorPalette: ${polarVectorColorPalette}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on options: ${options}` );

      options = _.extend( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, options );

      // Create the description of the buttons
      const content = [ {
        value: CoordinateSnapModes.CARTESIAN,
        node: VectorAdditionIconFactory.createCartesianSnapModeIcon( cartesianVectorColorPalette )
      }, {
        value: CoordinateSnapModes.POLAR,
        node: VectorAdditionIconFactory.createPolarSnapModeIcon( polarVectorColorPalette )
      } ];

      super( coordinateSnapModeProperty, content, options );
    }
  }

  return vectorAddition.register( 'CoordinateSnapRadioButtonGroup', CoordinateSnapRadioButtonGroup );
} );