// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel at the top of the equation scene that allows the user to toggle the coefficients of vectors.
 *
 * 'Is a' relationship with ExpandCollapsePanel
 *    - when closed, displays 'Equation' text
 *    - when open, displays a series of number pickers/formula nodes to change the coefficients of Vectors
 *
 * A visual:
 *  https://user-images.githubusercontent.com/42391580/60623943-4128d000-9da1-11e9-9dc0-393bfa332117.png
 *
 * This panel exists for the entire sim and is never disposed.
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
  const ExpandCollapsePanel = require( 'VECTOR_ADDITION/common/view/ExpandCollapsePanel' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const interleave = require( 'PHET_CORE/interleave' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  // constants
  const COEFFICIENT_PANEL_WIDTH = 205;
  const COEFFICIENT_PANEL_HEIGHT = VectorAdditionConstants.EXPAND_COLLAPSE_PANEL_HEIGHT;


  class CoefficientSelectorPanel extends ExpandCollapsePanel {

    /**
     * @param {EquationVectorSet} equationVectorSet
     * @param {EquationTypes} equationType
     * @param {Object} [options]
     */
    constructor( equationVectorSet, equationType, options ) {

      assert && assert( equationVectorSet instanceof EquationVectorSet,
        `invalid equationVectorSet: ${equationVectorSet}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = merge( {

        // specific to this class

        // {Object} passed to all Number Picker instances
        numberPickerOptions: _.clone( VectorAdditionConstants.NUMBER_PICKER_OPTIONS ),
        labelNumberPickerSpacing: 7, // {number} spacing between the Number Picker and the label
        textSpacing: 13.5, // {number} spacing between texts
        signTextWidth: 4, // {number} align width of the sign texts (ie. '+', '-', ...)
        equationTextFont: VectorAdditionConstants.PANEL_FONT, // {Font} font of the 'equation' text
        coefficientRange: new Range( -5, 5 ), // {Range} static range of the coefficients

        // super class options
        centerY: 70,
        left: 140,
        contentFixedWidth: COEFFICIENT_PANEL_WIDTH,
        contentFixedHeight: COEFFICIENT_PANEL_HEIGHT,
        contentXSpacing: 17


      }, options );


      //----------------------------------------------------------------------------------------
      // Create the scenery node for when the panel is closed
      const equationText = new Text( 'Equation', { font: options.equationTextFont } );


      //----------------------------------------------------------------------------------------
      // Create the scenery nodes for when the panel is open

      // Gather the children that belong on the left side of the equation
      let equationChildren = [];

      //----------------------------------------------------------------------------------------
      // Create the Number Pickers/labels: Each Vector in the equationVectorSet gets a Number
      // Picker and a label displayed horizontally. All of the NumberPickers / labels belong on the left
      // side of the Equation

      equationVectorSet.vectors.forEach( equationVector => {

        // Create the number picker that toggles the coefficient of the Vector
        const numberPicker = new NumberPicker( equationVector.coefficientProperty,
          new Property( options.coefficientRange ),
          options.numberPickerOptions );

        // Create the label, which is just a Vector Symbol
        const labelNode = new VectorSymbolNode( equationVector.symbol, null, false );

        const numberPickerAndTextBox = new HBox( {
          spacing: options.labelNumberPickerSpacing,
          children: [ numberPicker, labelNode ]
        } );

        equationChildren.push( numberPickerAndTextBox );
      } );

      const sumSymbolNode = new VectorSymbolNode( equationVectorSet.vectorSum.symbol, null, false );

      // for NEGATION, the Sum symbol is on side of the equation)
      if ( equationType === EquationTypes.NEGATION ) {
        equationChildren.push( sumSymbolNode  );
      }


      // Interleave signs (i.e. '+'/'-') in between each symbol on the left side of the equation
      equationChildren = interleave( equationChildren, () => {

        const sign =  equationType === EquationTypes.SUBTRACTION ? MathSymbols.MINUS : MathSymbols.PLUS;

        return new AlignBox( new Text( sign, { font: options.equationTextFont } ), {
          alignBounds: new Bounds2( 0, 0, options.signTextWidth, COEFFICIENT_PANEL_HEIGHT ),
          maxWidth: options.signTextWidth
        } );

      } );


      // Add the second half of the equation

      // Add the equals sign
      equationChildren.push( new Text( MathSymbols.EQUAL_TO, { font: options.equationTextFont } ) );

      // If its negation, add a 0, other wise, add the sum symbol
      if (equationType === EquationTypes.NEGATION ) {
        equationChildren.push( new Text( '0', { font: options.equationTextFont } ) );
      }
      else {
        equationChildren.push( sumSymbolNode );
      }

      // Layout
      const panelOpenContent = new HBox( { spacing: options.textSpacing, children: equationChildren } );

      //----------------------------------------------------------------------------------------
      // Create the inspect a vector panel
      //----------------------------------------------------------------------------------------

      super( equationText, panelOpenContent, options );

      //----------------------------------------------------------------------------------------
      // Layout the inspect vector panel
      //----------------------------------------------------------------------------------------

      this.centerY = options.centerY;
      this.left = options.left;
    }
  }

  return vectorAddition.register( 'CoefficientSelectorPanel', CoefficientSelectorPanel );
} );