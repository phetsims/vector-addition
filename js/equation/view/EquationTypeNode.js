// Copyright 2019, University of Colorado Boulder

/**
 * EquationTypeNode displays an interactive equation for one of the EquationTypes enumeration values.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const interleave = require( 'PHET_CORE/interleave' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  // constants
  const NUMBER_PICKER_OPTIONS = VectorAdditionConstants.NUMBER_PICKER_OPTIONS;
  const TEXT_OPTIONS = { font: VectorAdditionConstants.EQUATION_FONT };

  class EquationTypeNode extends Node {

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

      //----------------------------------------------------------------------------------------

      options = _.extend( {

        // {number} spacing between the NumberPicker and the VectorSymbolNode
        labelNumberPickerSpacing: 7,

        // {number} spacing between text of the equation
        textSpacing: 13.5,

        // {number} align width of the sign texts (ie. '+', '-'). The 'sign' text is
        // aligned in an AlignBox to ensure that they are the same width.
        signTextWidth: 4

      }, options );

      //----------------------------------------------------------------------------------------
      // Create the 'equation' layout. This is achieved in 5 steps:
      //    1. Create a HBox of a NumberPicker and a VectorSymbolNodes for each Vector in the Vector Set, pushing them
      //       to an array (called equationChildren)
      //    2. If the Equation Type is negation, add a Vector Symbol Node for the Sum, pushing it to the same array.
      //    3. Interleave (insert between each child) of equationChildren a 'sign': if the Equation Type is subtraction,
      //       insert a '-', otherwise insert a '+'.
      //    4. Insert the '='
      //    5. If the equation type is negation, add a '0' text. Otherwise, add a Vector Symbol Node for the Sum.
      //
      // With this algorithm, all three equation types are supported: 'Ma + Nb = c', 'Ma - Nb = c', 'Ma + Nb + c = 0',
      // where M and N are coefficients.

      let equationChildren = [];

      //----------------------------------------------------------------------------------------
      // Step 1: Loop through the VectorSet and push a HBox of a NumberPicker and a VectorSymbolNode for each Vector.
      equationVectorSet.vectors.forEach( equationVector => {

        assert && assert( equationVector.coefficientProperty.range,
          'coefficientProperty must have an associated range' );
        
        // Create the number picker that toggles the coefficient of the Vector
        const numberPicker = new NumberPicker( equationVector.coefficientProperty,
          new Property( equationVector.coefficientProperty.range ),
          NUMBER_PICKER_OPTIONS );

        const vectorSymbolNode = new VectorSymbolNode( { symbol: equationVector.symbol } );

        equationChildren.push( new HBox( {
          spacing: options.labelNumberPickerSpacing,
          children: [ numberPicker, vectorSymbolNode ]
        } ) );
      } );

      //----------------------------------------------------------------------------------------
      // Step 2: If the Equation Type is negation, add a Vector Symbol Node for the Sum, pushing it to the same array.
      const sumSymbolNode = new VectorSymbolNode( { symbol: equationVectorSet.sumVector.symbol } );

      if ( equationType === EquationTypes.NEGATION ) {
        equationChildren.push( sumSymbolNode );
      }

      //----------------------------------------------------------------------------------------
      // Step 3: Interleave (insert between each child) of equationChildren a 'sign': if the Equation Type is
      //         subtraction, insert a '-', otherwise insert a '+'.
      equationChildren = interleave( equationChildren, () => {

        const signText = equationType === EquationTypes.SUBTRACTION ? MathSymbols.MINUS : MathSymbols.PLUS;

        // Align the 'sign' text in a Align Box to ensure that the '+' and the '-' are the same size
        return new AlignBox( new Text( signText, TEXT_OPTIONS ), {
          alignBounds: new Bounds2( 0, 0, options.signTextWidth, 1 ),
          maxWidth: options.signTextWidth
        } );

      } );

      //----------------------------------------------------------------------------------------
      // Step 4: insert the equals sign
      equationChildren.push( new Text( MathSymbols.EQUAL_TO, TEXT_OPTIONS ) );


      //----------------------------------------------------------------------------------------
      // Step 5: If the equation type is negation, add a '0' text. Otherwise, add a Vector Symbol Node for the Sum.
      if (equationType === EquationTypes.NEGATION ) {
        equationChildren.push( new Text( '0', TEXT_OPTIONS ) );
      }
      else {
        equationChildren.push( sumSymbolNode );
      }

      //----------------------------------------------------------------------------------------
      // At this point, the equationChildren have been successfully created and are ready to be added
      // to an HBox for layout.
      const hBox = new HBox( {
        spacing: options.textSpacing,
        children: equationChildren
      } );
      assert && assert( !options.children, 'EquationTypeNode sets children' );
      options.children = [ hBox ];

      super( options );
    }
  }

  return vectorAddition.register( 'EquationTypeNode', EquationTypeNode );
} );