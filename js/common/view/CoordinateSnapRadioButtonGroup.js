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
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class CoordinateSnapRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty.<CoordinateSnapModes>} coordinateSnapModeProperty
     * @param {Object} [options]
     */
    constructor( coordinateSnapModeProperty, options ) {

      assert && assert( coordinateSnapModeProperty instanceof EnumerationProperty
      && CoordinateSnapModes.includes( coordinateSnapModeProperty.value ),
        `invalid coordinateSnapModeProperty: ${coordinateSnapModeProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {}, VectorAdditionConstants.RADIO_BUTTON_OPTIONS, options );

      //----------------------------------------------------------------------------------------

      const radioButtonContent = [ {
        value: CoordinateSnapModes.CARTESIAN,
        node: VectorAdditionIconFactory.createCartesianSnapModeIcon()
      }, {
        value: CoordinateSnapModes.POLAR,
        node: VectorAdditionIconFactory.createPolarSnapModeIcon()
      } ];

      super( coordinateSnapModeProperty, radioButtonContent, options );
    }
  }

  return vectorAddition.register( 'CoordinateSnapRadioButtonGroup', CoordinateSnapRadioButtonGroup );
} );