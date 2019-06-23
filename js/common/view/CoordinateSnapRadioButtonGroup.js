// Copyright 2019, University of Colorado Boulder

/**
 * Control panel for different modes of coordinate snaps
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

  // constants
  const RADIO_BUTTON_OPTIONS = _.extend( {}, VectorAdditionConstants.RADIO_BUTTON_OPTIONS, {
    left: 950,
    top: 455
  } );

  class CoordinateSnapRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty<CoordinateSnapModes>} coordinateSnapModeProperty - property of the possible modes of
     * snapping vectors to the graph.
     * @param {Object} [options]
     * @constructor
     */
    constructor( coordinateSnapModeProperty, options ) {

      // component style radio buttons
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