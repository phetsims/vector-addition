// Copyright 2019, University of Colorado Boulder

/**
 * EquationToggleBox is the toggle box in the Equation screen that displays the equation and allows the user to change
 * the coefficients of the vectors.
 *
 * ## Content
 *  - When closed, the panel displays a text that says 'Equation'
 *  - When open, the panel displays a series of NumberPickers and VectorSymbolNodes in a 'equation' layout.
 *    See https://user-images.githubusercontent.com/42391580/62882976-4a865000-bcf0-11e9-9df4-cf1220efe314.png for a
 *    visual.
 *
 * NOTE: this displays the 'equation' for a SINGLE Equation Type. This means that it will not change its content
 *       when the Equation Type changes. Instead, create an EquationToggleBox for each Equation Type and
 *       toggle the visibility when the Equation Type changes.
 *
 * @author Brandon Li
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
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ToggleBox = require( 'VECTOR_ADDITION/common/view/ToggleBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  // strings
  const equationString = require( 'string!VECTOR_ADDITION/equation' );

  // constants
  const NUMBER_PICKER_OPTIONS = VectorAdditionConstants.NUMBER_PICKER_OPTIONS;
  const TEXT_OPTIONS = { font: VectorAdditionConstants.PANEL_FONT };


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
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {

        // specific to this class
        labelNumberPickerSpacing: 7, // {number} spacing between the Number Picker and the Vector Symbol Node
        textSpacing: 13.5,           // {number} spacing between text of the equation
        signTextWidth: 4,            // {number} align width of the sign texts (ie. '+', '-'). The 'sign' text is
                                     // aligned in an AlignBox to ensure that they are the same width.

        // super class options
        centerY: 70,
        left: 140,
        contentFixedWidth: 205,
        contentFixedHeight: 50,
        contentXSpacing: 17

      }, options );

      //----------------------------------------------------------------------------------------
      // Create the content of the panel for when it is open. When open, the panel displays a
      // series of NumberPickers and VectorSymbolNodes in a 'equation' layout.
      //
      // This can be achieved in 5 steps:
      //    1. Create a HBox of a NumberPicker and a VectorSymbolNodes for each Vector in the Vector Set, pushing them
      //       to an array (called equationChildren)
      //    2. If the Equation Type is negation, add a Vector Symbol Node for the Sum, pushing it to the same array.
      //    3. Interleave (insert between each child) of equationChildren a 'sign': if the Equation Type is subtraction,
      //       insert a '-', otherwise insert a '+'.
      //    4. Insert the '='
      //    5. If the equation type is negation, add a '0' text. Otherwise, add a Vector Symbol Node for the Sum.
      //
      // With this algorithm, all three equation types can be achieved ('a + b = c', 'a - b = c', 'a + b + c = 0')

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

        const vectorSymbolNode = new VectorSymbolNode( equationVector.symbol, null, false );

        equationChildren.push( new HBox( {
          spacing: options.labelNumberPickerSpacing,
          children: [ numberPicker, vectorSymbolNode ]
        } ) );
      } );

      //----------------------------------------------------------------------------------------
      // Step 2: If the Equation Type is negation, add a Vector Symbol Node for the Sum, pushing it to the same array.
      const sumSymbolNode = new VectorSymbolNode( equationVectorSet.vectorSum.symbol, null, false );

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
          alignBounds: new Bounds2( 0, 0, options.signTextWidth, options.contentFixedHeight ),
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

      // At this point, the equationChildren have been successfully implemented and are ready to be inserted into a HBox
      // as the 'open' content of the Panel.
      const panelOpenContent = new HBox( { spacing: options.textSpacing, children: equationChildren } );

      // Create the scenery node for when the panel is closed - which is just 'equation'
      const equationText = new Text( equationString, TEXT_OPTIONS );

      super( equationText, panelOpenContent, options );
    }
  }

  return vectorAddition.register( 'EquationToggleBox', EquationToggleBox );
} );