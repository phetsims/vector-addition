// Copyright 2019, University of Colorado Boulder

/**
 * EquationToggleBox is the toggle box in the Equation screen that displays an equation and allows the user to change
 * the coefficients of the vectors.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const EquationTypeNode = require( 'VECTOR_ADDITION/equation/view/EquationTypeNode' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
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
     * @param {EquationVectorSet} equationVectorSet
     * @param {EquationTypes} equationType
     * @param {Object} [options]
     */
    constructor( equationVectorSet, equationType, options ) {

      assert && assert( equationVectorSet instanceof EquationVectorSet,
        `invalid equationVectorSet: ${equationVectorSet}` );
      assert && assert( EquationTypes.includes( equationType ), `invalid equationType: ${equationType}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on options: ${options}` );

      options = _.extend( {

        // superclass options
        contentFixedWidth: 205,
        contentFixedHeight: 50,
        contentXSpacing: 17

      }, options );

      // When the toggle box is collapsed, show 'Equation'
      const closedContent = new Text( equationString, TEXT_OPTIONS );

      // When the toggle box is expanded, show the interactive equation
      const openContent = new EquationTypeNode( equationVectorSet, equationType );

      super( closedContent, openContent, options );
    }
  }

  return vectorAddition.register( 'EquationToggleBox', EquationToggleBox );
} );