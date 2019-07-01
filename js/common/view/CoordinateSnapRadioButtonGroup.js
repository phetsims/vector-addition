// Copyright 2019, University of Colorado Boulder

/**
 * Radio button group for switching between polar and cartesian mode. See
 * https://github.com/phetsims/vector-addition/issues/21 for context.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );

  // constants
  const RADIO_BUTTON_OPTIONS = _.extend( {}, VectorAdditionConstants.RADIO_BUTTON_OPTIONS, {
    left: 955,
    top: 460
  } );

  class CoordinateSnapRadioButtonGroup extends RadioButtonGroup {
    /**
     * @param {EnumerationProperty.<CoordinateSnapModes>} coordinateSnapModeProperty - property of the possible modes of
     * snapping vectors to the graph.
     * @param {Object} [options]
     * @constructor
     */
    constructor( coordinateSnapModeProperty, options ) {

      assert && assert( coordinateSnapModeProperty instanceof EnumerationProperty
      && CoordinateSnapModes.includes( coordinateSnapModeProperty.value ),
        `invalid coordinateSnapModeProperty: ${coordinateSnapModeProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );


      const coordinateSnapModesRadioButtonContent = [ {
        value: CoordinateSnapModes.CARTESIAN,
        node: VectorAdditionIconFactory.createCartesianIcon()
      }, {
        value: CoordinateSnapModes.POLAR,
        node: VectorAdditionIconFactory.createPolarIcon()
      } ];

      super( coordinateSnapModeProperty, coordinateSnapModesRadioButtonContent, RADIO_BUTTON_OPTIONS );
    }
  }

  return vectorAddition.register( 'CoordinateSnapRadioButtonGroup', CoordinateSnapRadioButtonGroup );
} );