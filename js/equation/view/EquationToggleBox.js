// Copyright 2019, University of Colorado Boulder

/**
 * EquationToggleBox is the toggle box in the Equation screen that displays an interactive equation.
 * It allows the user to select the form of the equation, and change the coefficients of the vectors.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypeNode = require( 'VECTOR_ADDITION/equation/view/EquationTypeNode' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationTypesRadioButtonGroup = require( 'VECTOR_ADDITION/equation/view/EquationTypesRadioButtonGroup' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ToggleBox = require( 'VECTOR_ADDITION/common/view/ToggleBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // strings
  const equationString = require( 'string!VECTOR_ADDITION/equation' );

  // constants
  const TEXT_OPTIONS = { font: VectorAdditionConstants.EQUATION_FONT };

  class EquationToggleBox extends ToggleBox {

    /**
     * @param {EquationVectorSet} vectorSet
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @param {Object} [options]
     */
    constructor( vectorSet, equationTypeProperty, options ) {

      assert && assert( vectorSet instanceof EquationVectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( equationTypeProperty instanceof EnumerationProperty, `invalid equationTypeProperty: ${equationTypeProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      options = _.extend( {

        // superclass options
        contentFixedWidth: 670,
        contentFixedHeight: 50,
        contentXSpacing: 17

      }, options );

      // When the toggle box is collapsed, show 'Equation'
      const closedContent = new Text( equationString, TEXT_OPTIONS );

      // Radio buttons for selecting equation type
      const radioButtonGroup = new EquationTypesRadioButtonGroup( equationTypeProperty, vectorSet.symbols, {
        scale: 0.85
      } );

      // Create an equation of each type, only one of which will be visible at a time.
      const equationsParent = new Node();
      EquationTypes.VALUES.forEach( equationType => {

        const equationTypeNode = new EquationTypeNode( vectorSet, equationType );
        equationsParent.addChild( equationTypeNode );

        // Doesn't need to be unlinked since the equationToggleBox and the scene is never disposed
        equationTypeProperty.link( () => {
          equationTypeNode.visible = ( equationType === equationTypeProperty.value );
        } );
      } );

      // When the toggle box is expanded, show the interactive equation and radio buttons
      const openContent = new HBox( {
        children: [ radioButtonGroup, equationsParent ],
        spacing: 50
      } );

      super( closedContent, openContent, options );
    }
  }

  return vectorAddition.register( 'EquationToggleBox', EquationToggleBox );
} );