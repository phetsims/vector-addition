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
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty - Property of the possible equation types
     * @param {string[]} vectorSymbols - symbols on the buttons
     * @param {Object} [options]
     */
    constructor( equationTypeProperty, vectorSymbols, options ) {

      assert && assert( equationTypeProperty instanceof EnumerationProperty,
        `invalid equationTypeProperty: ${equationTypeProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
        buttonContentXMargin: 12
      }, options );

      //----------------------------------------------------------------------------------------

      const equationTypesRadioButtonContent = [ {
        value: EquationTypes.ADDITION,
        node: VectorAdditionIconFactory.createEquationTypeIcon( EquationTypes.ADDITION, vectorSymbols )
      }, {
        value: EquationTypes.SUBTRACTION,
        node: VectorAdditionIconFactory.createEquationTypeIcon( EquationTypes.SUBTRACTION, vectorSymbols )
      }, {
        value: EquationTypes.NEGATION,
        node: VectorAdditionIconFactory.createEquationTypeIcon( EquationTypes.NEGATION, vectorSymbols )
      } ];

      super( equationTypeProperty, equationTypesRadioButtonContent, options );
    }
  }

  return vectorAddition.register( 'EquationTypesRadioButtonGroup', EquationTypesRadioButtonGroup );
} );