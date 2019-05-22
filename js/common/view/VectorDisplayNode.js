// Copyright 2019, University of Colorado Boulder

/**
 * Shows a Scenery Node that display the numerical magnitude, angle and components of a vector
 *
 * @author Martin Veillette
 * */
define( require => {
  'use strict';

  // modules

  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Range = require( 'DOT/Range' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );


  const NUMBER_DISPLAY_OPTIONS = { decimalPlaces: 1 };

  class VectorDisplayNode extends Node {

    /**
     * @param {Vector} vector
     * */
    constructor( vector ) {

      super();

      const magnitudeText = new FormulaNode( '\|\\mathbf{\\vec{a}\}|' );
      const angleText = new RichText( 'Θ' );
      const xText = new RichText( 'S<sub>x</sub>' );
      const yText = new RichText( 'S<sub>y</sub>' );
      const magnitudeDisplay = new NumberDisplay( vector.magnitudeProperty, new Range( 0, 100 ), NUMBER_DISPLAY_OPTIONS );
      const angleDisplay = new NumberDisplay( vector.angleProperty, new Range( -180, 180 ), NUMBER_DISPLAY_OPTIONS );
      const xDisplay = new NumberDisplay( vector.xProperty, new Range( 0, 100 ), NUMBER_DISPLAY_OPTIONS );
      const yDisplay = new NumberDisplay( vector.yProperty, new Range( 0, 100 ), NUMBER_DISPLAY_OPTIONS );


      const box = new LayoutBox( {
        orientation: 'horizontal',
        spacing: 20,
        children: [ magnitudeText, magnitudeDisplay, angleText, angleDisplay, xText, xDisplay, yText, yDisplay ]
      } );

      this.addChild( box );
    }
  }


  return vectorAddition.register( 'VectorDisplayNode', VectorDisplayNode );
} );