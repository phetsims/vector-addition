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

  // constants
  const RADIO_BUTTON_OPTIONS = VectorAdditionConstants.RADIO_BUTTON_OPTIONS;

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

      options = _.extend( {}, RADIO_BUTTON_OPTIONS, {

        // Superclass options
        left: 955,
        top: 460,
        buttonContentXMargin: RADIO_BUTTON_OPTIONS.xMargin,
        buttonContentYMargin: RADIO_BUTTON_OPTIONS.yMargin,
        orientation: 'horizontal'

      }, options );

      //----------------------------------------------------------------------------------------

      const radioButtonContent = [ {
        value: CoordinateSnapModes.CARTESIAN,
        node: VectorAdditionIconFactory.createCoordinateSnapModeIcon( CoordinateSnapModes.CARTESIAN )
      }, {
        value: CoordinateSnapModes.POLAR,
        node: VectorAdditionIconFactory.createCoordinateSnapModeIcon( CoordinateSnapModes.POLAR )
      } ];

      super( coordinateSnapModeProperty, radioButtonContent, options );
    }
  }

  return vectorAddition.register( 'CoordinateSnapRadioButtonGroup', CoordinateSnapRadioButtonGroup );
} );