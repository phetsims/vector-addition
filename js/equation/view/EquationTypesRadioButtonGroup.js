// Copyright 2019, University of Colorado Boulder

/**
 * View for the radio button group near the top of the scene that allows the user to select a equation type.
 *
 * See EquationTypes.js
 *
 * 'Is a' relationship with RadioButtonGroup but adds:
 *    - Radio button for 'ADDITION' => 'a' + 'b' = 'c'
 *    - Radio button for 'SUBTRACTION' => 'a' - 'b' = 'c'
 *    - Radio button for 'NEGATION' => 'a' + 'b' + 'c' = 0
 *
 * Icons created from the VectorAdditionIconFactory.
 *
 * EquationTypesRadioButtonGroup is never disposed and exists for the entire simulation.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class EquationTypesRadioButtonGroup extends RadioButtonGroup {
    /**
     * @constructor
     *
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty - property of the possible equation types
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. All options are
     *                             specific to the super class (RadioButtonGroup)
     */
    constructor( equationTypeProperty, options ) {

      assert && assert( equationTypeProperty instanceof EnumerationProperty
      && EquationTypes.includes( equationTypeProperty.value ),
        `invalid equationTypeProperty: ${equationTypeProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {
        centerY: 55,
        left: 465,
        orientation: 'horizontal'
      }, VectorAdditionConstants.RADIO_BUTTON_OPTIONS, options );


      //----------------------------------------------------------------------------------------

      const equationTypesRadioButtonContent = [ {
        value: EquationTypes.ADDITION,
        node: VectorAdditionIconFactory.createCartesianIcon()
      }, {
        value: EquationTypes.SUBTRACTION,
        node: VectorAdditionIconFactory.createPolarIcon()
      }, {
        value: EquationTypes.NEGATION,
        node: VectorAdditionIconFactory.createPolarIcon()
      } ];

      super( equationTypeProperty, equationTypesRadioButtonContent, options );
    }
  }

  return vectorAddition.register( 'EquationTypesRadioButtonGroup', EquationTypesRadioButtonGroup );
} );